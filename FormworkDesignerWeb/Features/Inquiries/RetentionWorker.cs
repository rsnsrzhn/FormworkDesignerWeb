namespace FormworkDesignerWeb.Features.Inquiries;

public sealed class RetentionWorker(InquiryStore store, ILogger<RetentionWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromHours(24));
        do
        {
            try { store.PurgeExpired(); }
            catch (Exception exception) { logger.LogError("Очистка заявок не выполнена: {Type}", exception.GetType().Name); }
        } while (await timer.WaitForNextTickAsync(stoppingToken));
    }
}
