using System;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class Invoice : BaseAuditableEntity
{
    public string? CustomerInvoiceData { get; set; }
    public DateTime InvoicePeriodStartDate { get; set; }

    public DateTime InvoicePeriodEndDate { get; set; }

    public string? InvoiceDescription { get; set; }

    public decimal InvoiceAmount { get; set; }

    public DateTime InvoiceCreatedDate { get; set; }

    public DateTime InvoiceDueDate { get; set; }

    public DateTime? InvoicePaidDate { get; set; }

    public int PlanHistoryId { get; set; }

    public int SubscriptionId { get; set; }

    public PlanHistory PlanHistory { get; set; } = null!;

    public Subscription Subscription { get; set; } = null!;
}
