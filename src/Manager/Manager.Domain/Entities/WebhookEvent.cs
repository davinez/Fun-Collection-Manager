using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class WebhookEvent: BaseEntity
{
    public byte[] Data { get; set; } = [];
    public int Stale { get; set; }
    public string? ProcessingErrors { get; set; }
    public string? ExternalId { get; set; }
}
