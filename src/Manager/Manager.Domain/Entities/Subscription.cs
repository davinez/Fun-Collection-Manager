using System;
using Manager.Domain.Common;

namespace Manager.Domain.Entities;

public class Subscription : AuditableEntity
{
    public DateTime? TrialPeriodStartDate { get; set; }
    public DateTime? TrialPeriodEndDate { get; set; }
    public bool SubscribeAfterTrial { get; set; }
    public DateTime DateSubscribed { get; set; }
    public DateTime ValidTo { get; set; }
    public DateTime? DateUnsubscribed { get; set; }
    public int OfferId { get; set; }
    public int CurrentPlanId { get; set; }
    public int UserAccountId { get; set; }


    public UserAccount UserAccount { get; set; } = null!;
    public Offer Offer { get; set; } = null!;
    public Plan Plan { get; set; } = null!;
}
