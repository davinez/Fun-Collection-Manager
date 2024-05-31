using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Manager.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "manager");

            migrationBuilder.CreateTable(
                name: "identity_provider",
                schema: "manager",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    provider_name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_identity_provider", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "offer",
                schema: "manager",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    offer_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    offer_start_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    offer_end_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    description = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    discount_amount = table.Column<decimal>(type: "numeric", nullable: true),
                    discount_percentage = table.Column<decimal>(type: "numeric", nullable: true),
                    created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    last_modified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_offer", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "permission",
                schema: "manager",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    description = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_permission", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "plan",
                schema: "manager",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    plan_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    current_price = table.Column<decimal>(type: "numeric", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    last_modified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_plan", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "user_role",
                schema: "manager",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    description = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_role", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "webhook_event",
                schema: "manager",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    data = table.Column<byte[]>(type: "bytea", nullable: false),
                    stale = table.Column<int>(type: "integer", nullable: false),
                    processing_erros = table.Column<string>(type: "character varying(600)", maxLength: 600, nullable: false),
                    external_id = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_webhook_event", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "granted_permission",
                schema: "manager",
                columns: table => new
                {
                    user_role_id = table.Column<int>(type: "integer", nullable: false),
                    permission_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_granted_permission", x => new { x.permission_id, x.user_role_id });
                    table.ForeignKey(
                        name: "FK_granted_permission_permission_permission_id",
                        column: x => x.permission_id,
                        principalSchema: "manager",
                        principalTable: "permission",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_granted_permission_user_role_user_role_id",
                        column: x => x.user_role_id,
                        principalSchema: "manager",
                        principalTable: "user_role",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_account",
                schema: "manager",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    username = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    date_of_birth = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    zip_code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    payment_provider_customer_id = table.Column<int>(type: "integer", nullable: false),
                    role_id = table.Column<int>(type: "integer", nullable: false),
                    created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    last_modified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_account", x => x.id);
                    table.ForeignKey(
                        name: "FK_user_account_user_role_role_id",
                        column: x => x.role_id,
                        principalSchema: "manager",
                        principalTable: "user_role",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "collection_group",
                schema: "manager",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    user_account_id = table.Column<int>(type: "integer", nullable: false),
                    created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    last_modified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_collection_group", x => x.id);
                    table.ForeignKey(
                        name: "FK_collection_group_user_account_user_account_id",
                        column: x => x.user_account_id,
                        principalSchema: "manager",
                        principalTable: "user_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "subscription",
                schema: "manager",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    trial_period_start_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    trial_period_end_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    subscribe_after_trial = table.Column<bool>(type: "boolean", nullable: false),
                    date_subscribed = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    valid_to = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    date_unsubscribed = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    offer_id = table.Column<int>(type: "integer", nullable: false),
                    current_plan_id = table.Column<int>(type: "integer", nullable: false),
                    user_account_id = table.Column<int>(type: "integer", nullable: false),
                    created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    last_modified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_subscription", x => x.id);
                    table.ForeignKey(
                        name: "FK_subscription_offer_offer_id",
                        column: x => x.offer_id,
                        principalSchema: "manager",
                        principalTable: "offer",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_subscription_plan_current_plan_id",
                        column: x => x.current_plan_id,
                        principalSchema: "manager",
                        principalTable: "plan",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_subscription_user_account_user_account_id",
                        column: x => x.user_account_id,
                        principalSchema: "manager",
                        principalTable: "user_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "use_account_identity_provider",
                schema: "manager",
                columns: table => new
                {
                    user_account_id = table.Column<int>(type: "integer", nullable: false),
                    identity_provider_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_use_account_identity_provider", x => new { x.identity_provider_id, x.user_account_id });
                    table.ForeignKey(
                        name: "FK_use_account_identity_provider_identity_provider_identity_pr~",
                        column: x => x.identity_provider_id,
                        principalSchema: "manager",
                        principalTable: "identity_provider",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_use_account_identity_provider_user_account_user_account_id",
                        column: x => x.user_account_id,
                        principalSchema: "manager",
                        principalTable: "user_account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "collection",
                schema: "manager",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    icon = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    parent_node_id = table.Column<int>(type: "integer", nullable: false),
                    collection_group_id = table.Column<int>(type: "integer", nullable: false),
                    created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    last_modified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_collection", x => x.id);
                    table.ForeignKey(
                        name: "FK_collection_collection_group_collection_group_id",
                        column: x => x.collection_group_id,
                        principalSchema: "manager",
                        principalTable: "collection_group",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_collection_collection_parent_node_id",
                        column: x => x.parent_node_id,
                        principalSchema: "manager",
                        principalTable: "collection",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "plan_history",
                schema: "manager",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    date_start = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    date_end = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    plan_id = table.Column<int>(type: "integer", nullable: false),
                    subscription_id = table.Column<int>(type: "integer", nullable: false),
                    created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    last_modified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_plan_history", x => x.id);
                    table.ForeignKey(
                        name: "FK_plan_history_plan_plan_id",
                        column: x => x.plan_id,
                        principalSchema: "manager",
                        principalTable: "plan",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_plan_history_subscription_subscription_id",
                        column: x => x.subscription_id,
                        principalSchema: "manager",
                        principalTable: "subscription",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "bookmark",
                schema: "manager",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cover = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    website_url = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    collection_id = table.Column<int>(type: "integer", nullable: false),
                    created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    last_modified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bookmark", x => x.id);
                    table.ForeignKey(
                        name: "FK_bookmark_collection_collection_id",
                        column: x => x.collection_id,
                        principalSchema: "manager",
                        principalTable: "collection",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "invoice",
                schema: "manager",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    customer_invoice_data = table.Column<string>(type: "text", nullable: false),
                    invoice_period_start_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    invoice_period_end_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    invoice_description = table.Column<string>(type: "text", nullable: false),
                    invoice_amount = table.Column<decimal>(type: "numeric", nullable: false),
                    invoice_created_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    invoice_due_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    invoice_paid_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    plan_history_id = table.Column<int>(type: "integer", nullable: false),
                    subscription_id = table.Column<int>(type: "integer", nullable: false),
                    created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    last_modified = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invoice", x => x.id);
                    table.ForeignKey(
                        name: "FK_invoice_plan_history_plan_history_id",
                        column: x => x.plan_history_id,
                        principalSchema: "manager",
                        principalTable: "plan_history",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_invoice_subscription_subscription_id",
                        column: x => x.subscription_id,
                        principalSchema: "manager",
                        principalTable: "subscription",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_bookmark_collection_id",
                schema: "manager",
                table: "bookmark",
                column: "collection_id");

            migrationBuilder.CreateIndex(
                name: "IX_collection_collection_group_id",
                schema: "manager",
                table: "collection",
                column: "collection_group_id");

            migrationBuilder.CreateIndex(
                name: "IX_collection_parent_node_id",
                schema: "manager",
                table: "collection",
                column: "parent_node_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_collection_group_user_account_id",
                schema: "manager",
                table: "collection_group",
                column: "user_account_id");

            migrationBuilder.CreateIndex(
                name: "IX_granted_permission_user_role_id",
                schema: "manager",
                table: "granted_permission",
                column: "user_role_id");

            migrationBuilder.CreateIndex(
                name: "IX_invoice_plan_history_id",
                schema: "manager",
                table: "invoice",
                column: "plan_history_id");

            migrationBuilder.CreateIndex(
                name: "IX_invoice_subscription_id",
                schema: "manager",
                table: "invoice",
                column: "subscription_id");

            migrationBuilder.CreateIndex(
                name: "IX_plan_history_plan_id",
                schema: "manager",
                table: "plan_history",
                column: "plan_id");

            migrationBuilder.CreateIndex(
                name: "IX_plan_history_subscription_id",
                schema: "manager",
                table: "plan_history",
                column: "subscription_id");

            migrationBuilder.CreateIndex(
                name: "IX_subscription_current_plan_id",
                schema: "manager",
                table: "subscription",
                column: "current_plan_id");

            migrationBuilder.CreateIndex(
                name: "IX_subscription_offer_id",
                schema: "manager",
                table: "subscription",
                column: "offer_id");

            migrationBuilder.CreateIndex(
                name: "IX_subscription_user_account_id",
                schema: "manager",
                table: "subscription",
                column: "user_account_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_use_account_identity_provider_user_account_id",
                schema: "manager",
                table: "use_account_identity_provider",
                column: "user_account_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_account_role_id",
                schema: "manager",
                table: "user_account",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_account_username",
                schema: "manager",
                table: "user_account",
                column: "username");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bookmark",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "granted_permission",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "invoice",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "use_account_identity_provider",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "webhook_event",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "collection",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "permission",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "plan_history",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "identity_provider",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "collection_group",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "subscription",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "offer",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "plan",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "user_account",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "user_role",
                schema: "manager");
        }
    }
}
