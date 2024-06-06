using System;
using System.Collections.Generic;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class PlanHistory : BaseAuditableEntity
{
    public DateTime DateStart { get; set; }
    public DateTime DateEnd { get; set; }
    public int PlanId { get; set; }
    public int SubscriptionId { get; set; }

    public Plan Plan { get; set; } = null!;
    public Subscription Subscription { get; set; } = null!;
    public List<Invoice> Invoices { get; } = [];
}
