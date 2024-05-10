using System;
using System.ComponentModel.DataAnnotations.Schema;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class Invoice : AuditableEntity
{
    [Column("customer_invoice_data")]
    public string? CustomerInvoiceData { get; set; }

    [Column("invoice_period_start_date")]
    public DateTime InvoicePeriodStartDate { get; set; }

    [Column("invoice_period_end_date")]
    public DateTime InvoicePeriodEndDate { get; set; }

    [Column("invoice_description")]
    public string? InvoiceDescription { get; set; }

    [Column("invoice_amount")]
    public decimal InvoiceAmount { get; set; }

    [Column("invoice_created_date")]
    public DateTime InvoiceCreatedDate { get; set; }

    [Column("invoice_due_date")]
    public DateTime InvoiceDueDate { get; set; }

    [Column("invoice_paid_date")]
    public DateTime? InvoicePaidDate { get; set; }

    [Column("plan_history_id")]
    public int PlanHistoryId { get; set; }

    [Column("subscription_id")]
    public int SubscriptionId { get; set; }
}
