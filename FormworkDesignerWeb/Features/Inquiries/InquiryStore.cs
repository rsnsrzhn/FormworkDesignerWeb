using Microsoft.Data.Sqlite;
using FormworkDesignerWeb.Configuration;
using System.Globalization;
using System.Text;

namespace FormworkDesignerWeb.Features.Inquiries;

public sealed class InquiryStore(SiteOptions options)
{
    private string DatabasePath => Path.Combine(Path.GetFullPath(options.DataDirectory), "inquiries.db");

    private SqliteConnection Open()
    {
        var connection = new SqliteConnection(new SqliteConnectionStringBuilder
        {
            DataSource = DatabasePath, DefaultTimeout = 5, Pooling = true
        }.ToString());
        connection.Open();
        return connection;
    }

    public void Initialize()
    {
        Directory.CreateDirectory(Path.GetDirectoryName(DatabasePath)!);
        using var connection = Open();
        using var command = connection.CreateCommand();
        command.CommandText = """
            PRAGMA journal_mode=WAL;
            CREATE TABLE IF NOT EXISTS inquiries (
                id TEXT PRIMARY KEY, full_name TEXT NOT NULL, email TEXT NOT NULL,
                phone TEXT NOT NULL, created_at TEXT NOT NULL, policy_version TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS ix_inquiries_created_at ON inquiries(created_at);
            PRAGMA user_version=1;
            """;
        command.ExecuteNonQuery();
    }

    public async Task<bool> SaveAsync(InquiryRequest request, CancellationToken cancellationToken)
    {
        using var connection = Open();
        using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO inquiries(id, full_name, email, phone, created_at, policy_version)
            VALUES($id, $name, $email, $phone, $created, $policy)
            ON CONFLICT(id) DO NOTHING;
            """;
        command.Parameters.AddWithValue("$id", request.RequestId.ToString());
        command.Parameters.AddWithValue("$name", request.FullName!.Trim());
        command.Parameters.AddWithValue("$email", request.Email!.Trim());
        command.Parameters.AddWithValue("$phone", InquiryValidation.NormalizePhone(request.Phone));
        command.Parameters.AddWithValue("$created", DateTimeOffset.UtcNow.ToString("O", CultureInfo.InvariantCulture));
        command.Parameters.AddWithValue("$policy", request.PolicyVersion!);
        if (await command.ExecuteNonQueryAsync(cancellationToken) > 0) return true;
        command.CommandText = "SELECT full_name,email,phone,policy_version FROM inquiries WHERE id=$id";
        command.Parameters.Clear();
        command.Parameters.AddWithValue("$id", request.RequestId.ToString());
        using var reader = await command.ExecuteReaderAsync(cancellationToken);
        return await reader.ReadAsync(cancellationToken) &&
            reader.GetString(0) == request.FullName.Trim() &&
            reader.GetString(1) == request.Email.Trim() &&
            reader.GetString(2) == InquiryValidation.NormalizePhone(request.Phone) &&
            reader.GetString(3) == request.PolicyVersion;
    }

    public int PurgeExpired()
    {
        using var connection = Open();
        using var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM inquiries WHERE created_at < $cutoff";
        command.Parameters.AddWithValue("$cutoff", DateTimeOffset.UtcNow.AddMonths(-options.RetentionMonths).ToString("O", CultureInfo.InvariantCulture));
        return command.ExecuteNonQuery();
    }

    public int Delete(Guid id)
    {
        using var connection = Open();
        using var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM inquiries WHERE id=$id";
        command.Parameters.AddWithValue("$id", id.ToString());
        return command.ExecuteNonQuery();
    }

    public void Backup(string destination)
    {
        if (File.Exists(destination)) throw new IOException("Файл назначения уже существует.");
        Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(destination))!);
        using var source = Open();
        using var target = new SqliteConnection(new SqliteConnectionStringBuilder { DataSource = destination }.ToString());
        target.Open();
        source.BackupDatabase(target);
    }

    public void Export(string destination)
    {
        using var stream = new FileStream(destination, FileMode.CreateNew, FileAccess.Write);
        using var writer = new StreamWriter(stream, new UTF8Encoding(true));
        writer.WriteLine("id,full_name,email,phone,created_at,policy_version");
        using var connection = Open();
        using var command = connection.CreateCommand();
        command.CommandText = "SELECT id,full_name,email,phone,created_at,policy_version FROM inquiries ORDER BY created_at";
        using var reader = command.ExecuteReader();
        while (reader.Read()) writer.WriteLine(string.Join(",", Enumerable.Range(0, 6).Select(i => Csv(reader.GetString(i)))));
    }

    private static string Csv(string value)
    {
        if (value.TrimStart().FirstOrDefault() is '=' or '+' or '-' or '@' || value.StartsWith('\t') || value.StartsWith('\r')) value = "'" + value;
        return "\"" + value.Replace("\"", "\"\"") + "\"";
    }
}
