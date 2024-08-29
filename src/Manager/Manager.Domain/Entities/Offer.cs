using System;
using System.Collections.Generic;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class Offer : BaseAuditableEntity
{
    public string? OfferName { get; set; }
    public DateTime OfferStartDate { get; set; }
    public DateTime? OfferEndDate { get; set; }
    public string? Description { get; set; }
    public decimal? DiscountAmount { get; set; }
    public decimal? DiscountPercentage { get; set; }

    public List<Subscription> Subscriptions { get; } = [];
}
