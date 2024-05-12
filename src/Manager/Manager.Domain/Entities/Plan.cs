using System.Collections.Generic;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class Plan : AuditableEntity
{
    public string? PlanName { get; set; }
    public decimal CurrentPrice { get; set; }
    public bool IsActive { get; set; }

    public List<Subscription> Subscriptions { get; } = [];
    public List<PlanHistory> PlanHistories { get; } = [];
}
