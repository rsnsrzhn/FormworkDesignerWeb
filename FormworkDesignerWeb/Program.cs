using System.Net;
using System.Threading.RateLimiting;
using FormworkDesignerWeb.Configuration;
using FormworkDesignerWeb.Features.Inquiries;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;

var maintenance = args.FirstOrDefault() is "backup" or "export" or "purge" or "delete";
var builder = WebApplication.CreateBuilder(maintenance ? [] : args);
var site = builder.Configuration.GetSection("Site").Get<SiteOptions>() ?? new SiteOptions();
if (site.RetentionMonths is < 1 or > 120) throw new InvalidOperationException("Site:RetentionMonths должен быть от 1 до 120.");
site.DataDirectory = Path.GetFullPath(site.DataDirectory, builder.Environment.ContentRootPath);
builder.Services.AddSingleton(site);
builder.Services.AddSingleton<InquiryStore>();
builder.Services.AddHostedService<RetentionWorker>();
builder.WebHost.ConfigureKestrel(server => server.Limits.MaxRequestBodySize = 8192);
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor;
    if (IPAddress.TryParse(builder.Configuration["TrustedProxy"], out var proxy)) options.KnownProxies.Add(proxy);
});
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.Headers.RetryAfter = "600";
        await context.HttpContext.Response.WriteAsJsonAsync(new { message = "Слишком много попыток. Попробуйте через 10 минут." }, token);
    };
    options.AddPolicy("inquiries", context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromMinutes(10), QueueLimit = 0 }));
});
var app = builder.Build();
var store = app.Services.GetRequiredService<InquiryStore>();
store.Initialize();
if (maintenance)
{
    switch (args[0])
    {
        case "backup" when args.Length == 2: store.Backup(args[1]); break;
        case "export" when args.Length == 2: store.Export(args[1]); break;
        case "purge" when args.Length == 1: Console.WriteLine($"Удалено: {store.PurgeExpired()}"); break;
        case "delete" when args.Length == 2 && Guid.TryParse(args[1], out var id): Console.WriteLine($"Удалено: {store.Delete(id)}"); break;
        default: throw new ArgumentException("Команды: backup <file>, export <file>, purge, delete <guid>");
    }
    return;
}
app.UseForwardedHeaders();
app.Use(async (context, next) =>
{
    context.Response.Headers.XContentTypeOptions = "nosniff";
    context.Response.Headers.CacheControl = "no-store";
    try { await next(context); }
    catch (BadHttpRequestException exception) when (!context.Response.HasStarted)
    {
        context.Response.StatusCode = exception.StatusCode;
        await context.Response.WriteAsJsonAsync(new { message = "Запрос содержит некорректные данные или превышает допустимый размер." });
    }
    catch (Exception exception) when (!context.Response.HasStarted && exception is not OperationCanceledException)
    {
        app.Logger.LogError("Ошибка HTTP: {Type}", exception.GetType().Name);
        context.Response.StatusCode = 500;
        await context.Response.WriteAsJsonAsync(new { message = "Не удалось сохранить заявку. Попробуйте позже." });
    }
});
app.UseRateLimiter();
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));
app.MapGet("/api/site-config", () => Results.Ok(new
{
    inquiriesEnabled = site.IsReady(app.Environment.IsDevelopment()),
    development = app.Environment.IsDevelopment(),
    site.OperatorName, site.OperatorAddress, site.PrivacyEmail, site.PolicyVersion, site.RetentionMonths
}));
app.MapPost("/api/inquiries", async (InquiryRequest request, HttpContext context, CancellationToken cancellationToken) =>
{
    if (!site.IsReady(app.Environment.IsDevelopment()))
        return Results.Json(new { message = "Приём заявок пока недоступен. Пожалуйста, зайдите позже." }, statusCode: 503);
    var origin = context.Request.Headers.Origin.ToString();
    var expected = site.PublicOrigin.TrimEnd('/');
    if (app.Environment.IsDevelopment() && string.IsNullOrEmpty(expected)) expected = $"{context.Request.Scheme}://{context.Request.Host}";
    if (!string.Equals(origin, expected, StringComparison.OrdinalIgnoreCase)) return Results.StatusCode(403);
    if (!string.IsNullOrEmpty(request.Website)) return Results.Accepted(value: new { message = "Заявка принята." });
    var errors = InquiryValidation.Validate(request, site.PolicyVersion);
    if (errors.Count > 0) return Results.ValidationProblem(errors);
    if (!await store.SaveAsync(request, cancellationToken))
        return Results.Conflict(new { message = "Данные заявки изменились. Обновите страницу перед новой отправкой." });
    return Results.Accepted(value: new { message = "Заявка принята. Мы свяжемся с вами по указанным контактам." });
}).RequireRateLimiting("inquiries");
app.Run();

public partial class Program;
