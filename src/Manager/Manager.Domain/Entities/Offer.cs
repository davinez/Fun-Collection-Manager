using System;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class Offer : AuditableEntity
{
    public string? OfferName { get; set; }
    public DateTime OfferStartDate { get; set; }
    public DateTime? OfferEndDate { get; set; }
    public string? Description { get; set; }
    public decimal? DiscountAmount { get; set; }
    public decimal? DiscountPercentage { get; set; }
}
