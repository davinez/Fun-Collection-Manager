using System;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class PlanHistory : AuditableEntity
{
    public DateTime DateStart { get; set; }
    public DateTime DateEnd { get; set; }
    public int PlanId { get; set; }
    public int SubscriptionId { get; set; }
}
