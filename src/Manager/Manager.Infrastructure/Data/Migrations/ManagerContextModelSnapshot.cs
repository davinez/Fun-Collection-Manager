﻿// <auto-generated />
using System;
using Manager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Manager.Infrastructure.Data.Migrations
{
    [DbContext(typeof(ManagerContext))]
    partial class ManagerContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasDefaultSchema("manager")
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Manager.Domain.Entities.Bookmark", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CollectionId")
                        .HasColumnType("integer")
                        .HasColumnName("collection_id");

                    b.Property<string>("Cover")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("cover");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("description");

                    b.Property<DateTimeOffset?>("LastModified")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("last_modified");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("title");

                    b.Property<string>("WebsiteUrl")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("website_url");

                    b.HasKey("Id");

                    b.HasIndex("CollectionId");

                    b.ToTable("bookmark", "manager");
                });

            modelBuilder.Entity("Manager.Domain.Entities.Collection", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CollectionGroupId")
                        .HasColumnType("integer")
                        .HasColumnName("collection_group_id");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created");

                    b.Property<string>("Icon")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("icon");

                    b.Property<DateTimeOffset?>("LastModified")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("last_modified");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("name");

                    b.Property<int>("ParentNodeId")
                        .HasColumnType("integer")
                        .HasColumnName("parent_node_id");

                    b.HasKey("Id");

                    b.HasIndex("CollectionGroupId");

                    b.HasIndex("ParentNodeId")
                        .IsUnique();

                    b.ToTable("collection", "manager");
                });

            modelBuilder.Entity("Manager.Domain.Entities.CollectionGroup", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created");

                    b.Property<DateTimeOffset?>("LastModified")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("last_modified");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("name");

                    b.Property<int>("UserAccountId")
                        .HasColumnType("integer")
                        .HasColumnName("user_account_id");

                    b.HasKey("Id");

                    b.HasIndex("UserAccountId");

                    b.ToTable("collection_group", "manager");
                });

            modelBuilder.Entity("Manager.Domain.Entities.Invoice", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created");

                    b.Property<string>("CustomerInvoiceData")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("customer_invoice_data");

                    b.Property<decimal>("InvoiceAmount")
                        .HasColumnType("numeric")
                        .HasColumnName("invoice_amount");

                    b.Property<DateTime>("InvoiceCreatedDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("invoice_created_date");

                    b.Property<string>("InvoiceDescription")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("invoice_description");

                    b.Property<DateTime>("InvoiceDueDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("invoice_due_date");

                    b.Property<DateTime?>("InvoicePaidDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("invoice_paid_date");

                    b.Property<DateTime>("InvoicePeriodEndDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("invoice_period_end_date");

                    b.Property<DateTime>("InvoicePeriodStartDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("invoice_period_start_date");

                    b.Property<DateTimeOffset?>("LastModified")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("last_modified");

                    b.Property<int>("PlanHistoryId")
                        .HasColumnType("integer")
                        .HasColumnName("plan_history_id");

                    b.Property<int>("SubscriptionId")
                        .HasColumnType("integer")
                        .HasColumnName("subscription_id");

                    b.HasKey("Id");

                    b.HasIndex("PlanHistoryId");

                    b.HasIndex("SubscriptionId");

                    b.ToTable("invoice", "manager");
                });

            modelBuilder.Entity("Manager.Domain.Entities.Offer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("description");

                    b.Property<decimal?>("DiscountAmount")
                        .HasColumnType("numeric")
                        .HasColumnName("discount_amount");

                    b.Property<decimal?>("DiscountPercentage")
                        .HasColumnType("numeric")
                        .HasColumnName("discount_percentage");

                    b.Property<DateTimeOffset?>("LastModified")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("last_modified");

                    b.Property<DateTime?>("OfferEndDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("offer_end_date");

                    b.Property<string>("OfferName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("offer_name");

                    b.Property<DateTime>("OfferStartDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("offer_start_date");

                    b.HasKey("Id");

                    b.ToTable("offer", "manager");
                });

            modelBuilder.Entity("Manager.Domain.Entities.Plan", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created");

                    b.Property<decimal>("CurrentPrice")
                        .HasColumnType("numeric")
                        .HasColumnName("current_price");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean")
                        .HasColumnName("is_active");

                    b.Property<DateTimeOffset?>("LastModified")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("last_modified");

                    b.Property<string>("PlanName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("plan_name");

                    b.HasKey("Id");

                    b.ToTable("plan", "manager");
                });

            modelBuilder.Entity("Manager.Domain.Entities.PlanHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created");

                    b.Property<DateTime>("DateEnd")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("date_end");

                    b.Property<DateTime>("DateStart")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("date_start");

                    b.Property<DateTimeOffset?>("LastModified")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("last_modified");

                    b.Property<int>("PlanId")
                        .HasColumnType("integer")
                        .HasColumnName("plan_id");

                    b.Property<int>("SubscriptionId")
                        .HasColumnType("integer")
                        .HasColumnName("subscription_id");

                    b.HasKey("Id");

                    b.HasIndex("PlanId");

                    b.HasIndex("SubscriptionId");

                    b.ToTable("plan_history", "manager");
                });

            modelBuilder.Entity("Manager.Domain.Entities.Subscription", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created");

                    b.Property<int>("CurrentPlanId")
                        .HasColumnType("integer")
                        .HasColumnName("current_plan_id");

                    b.Property<DateTime>("DateSubscribed")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("date_subscribed");

                    b.Property<DateTime?>("DateUnsubscribed")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("date_unsubscribed");

                    b.Property<DateTimeOffset?>("LastModified")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("last_modified");

                    b.Property<int?>("OfferId")
                        .HasColumnType("integer")
                        .HasColumnName("offer_id");

                    b.Property<bool>("SubscribeAfterTrial")
                        .HasColumnType("boolean")
                        .HasColumnName("subscribe_after_trial");

                    b.Property<DateTime?>("TrialPeriodEndDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("trial_period_end_date");

                    b.Property<DateTime?>("TrialPeriodStartDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("trial_period_start_date");

                    b.Property<int>("UserAccountId")
                        .HasColumnType("integer")
                        .HasColumnName("user_account_id");

                    b.Property<DateTime>("ValidTo")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("valid_to");

                    b.HasKey("Id");

                    b.HasIndex("CurrentPlanId");

                    b.HasIndex("OfferId");

                    b.HasIndex("UserAccountId")
                        .IsUnique();

                    b.ToTable("subscription", "manager");
                });

            modelBuilder.Entity("Manager.Domain.Entities.UserAccount", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("City")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("city");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("country");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created");

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("display_name");

                    b.Property<string>("GivenName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("given_name");

                    b.Property<Guid>("IdentityProviderId")
                        .HasColumnType("uuid")
                        .HasColumnName("identity_provider_id");

                    b.Property<DateTimeOffset?>("LastModified")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("last_modified");

                    b.Property<int?>("PaymentProviderCustomerId")
                        .HasColumnType("integer")
                        .HasColumnName("payment_provider_customer_id");

                    b.Property<string>("UserName")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("username");

                    b.HasKey("Id");

                    b.HasIndex("UserName");

                    b.ToTable("user_account", "manager");
                });

            modelBuilder.Entity("Manager.Domain.Entities.WebhookEvent", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<byte[]>("Data")
                        .IsRequired()
                        .HasColumnType("bytea")
                        .HasColumnName("data");

                    b.Property<string>("ExternalId")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("external_id");

                    b.Property<string>("ProcessingErrors")
                        .IsRequired()
                        .HasMaxLength(600)
                        .HasColumnType("character varying(600)")
                        .HasColumnName("processing_erros");

                    b.Property<int>("Stale")
                        .HasColumnType("integer")
                        .HasColumnName("stale");

                    b.HasKey("Id");

                    b.ToTable("webhook_event", "manager");
                });

            modelBuilder.Entity("Manager.Domain.Entities.Bookmark", b =>
                {
                    b.HasOne("Manager.Domain.Entities.Collection", "Collection")
                        .WithMany("Bookmarks")
                        .HasForeignKey("CollectionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Collection");
                });

            modelBuilder.Entity("Manager.Domain.Entities.Collection", b =>
                {
                    b.HasOne("Manager.Domain.Entities.CollectionGroup", "CollectionGroup")
                        .WithMany("Collections")
                        .HasForeignKey("CollectionGroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Manager.Domain.Entities.Collection", "ParentNode")
                        .WithOne("ChildNode")
                        .HasForeignKey("Manager.Domain.Entities.Collection", "ParentNodeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("CollectionGroup");

                    b.Navigation("ParentNode");
                });

            modelBuilder.Entity("Manager.Domain.Entities.CollectionGroup", b =>
                {
                    b.HasOne("Manager.Domain.Entities.UserAccount", "UserAccount")
                        .WithMany("CollectionGroups")
                        .HasForeignKey("UserAccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserAccount");
                });

            modelBuilder.Entity("Manager.Domain.Entities.Invoice", b =>
                {
                    b.HasOne("Manager.Domain.Entities.PlanHistory", "PlanHistory")
                        .WithMany("Invoices")
                        .HasForeignKey("PlanHistoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Manager.Domain.Entities.Subscription", "Subscription")
                        .WithMany("Invoices")
                        .HasForeignKey("SubscriptionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PlanHistory");

                    b.Navigation("Subscription");
                });

            modelBuilder.Entity("Manager.Domain.Entities.PlanHistory", b =>
                {
                    b.HasOne("Manager.Domain.Entities.Plan", "Plan")
                        .WithMany("PlanHistories")
                        .HasForeignKey("PlanId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Manager.Domain.Entities.Subscription", "Subscription")
                        .WithMany("PlanHistories")
                        .HasForeignKey("SubscriptionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Plan");

                    b.Navigation("Subscription");
                });

            modelBuilder.Entity("Manager.Domain.Entities.Subscription", b =>
                {
                    b.HasOne("Manager.Domain.Entities.Plan", "Plan")
                        .WithMany("Subscriptions")
                        .HasForeignKey("CurrentPlanId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Manager.Domain.Entities.Offer", "Offer")
                        .WithMany("Subscriptions")
                        .HasForeignKey("OfferId");

                    b.HasOne("Manager.Domain.Entities.UserAccount", "UserAccount")
                        .WithOne("Subscription")
                        .HasForeignKey("Manager.Domain.Entities.Subscription", "UserAccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Offer");

                    b.Navigation("Plan");

                    b.Navigation("UserAccount");
                });

            modelBuilder.Entity("Manager.Domain.Entities.Collection", b =>
                {
                    b.Navigation("Bookmarks");

                    b.Navigation("ChildNode")
                        .IsRequired();
                });

            modelBuilder.Entity("Manager.Domain.Entities.CollectionGroup", b =>
                {
                    b.Navigation("Collections");
                });

            modelBuilder.Entity("Manager.Domain.Entities.Offer", b =>
                {
                    b.Navigation("Subscriptions");
                });

            modelBuilder.Entity("Manager.Domain.Entities.Plan", b =>
                {
                    b.Navigation("PlanHistories");

                    b.Navigation("Subscriptions");
                });

            modelBuilder.Entity("Manager.Domain.Entities.PlanHistory", b =>
                {
                    b.Navigation("Invoices");
                });

            modelBuilder.Entity("Manager.Domain.Entities.Subscription", b =>
                {
                    b.Navigation("Invoices");

                    b.Navigation("PlanHistories");
                });

            modelBuilder.Entity("Manager.Domain.Entities.UserAccount", b =>
                {
                    b.Navigation("CollectionGroups");

                    b.Navigation("Subscription")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
