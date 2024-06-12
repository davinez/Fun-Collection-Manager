using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Manager.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RBAC_Tables_Removed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_user_account_user_role_role_id",
                schema: "manager",
                table: "user_account");

            migrationBuilder.DropTable(
                name: "granted_permission",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "use_account_identity_provider",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "permission",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "user_role",
                schema: "manager");

            migrationBuilder.DropTable(
                name: "identity_provider",
                schema: "manager");

            migrationBuilder.DropIndex(
                name: "IX_user_account_role_id",
                schema: "manager",
                table: "user_account");

            migrationBuilder.DropColumn(
                name: "role_id",
                schema: "manager",
                table: "user_account");

            migrationBuilder.DropColumn(
                name: "zip_code",
                schema: "manager",
                table: "user_account");

            migrationBuilder.AddColumn<string>(
                name: "city",
                schema: "manager",
                table: "user_account",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "identity_provider_id",
                schema: "manager",
                table: "user_account",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "city",
                schema: "manager",
                table: "user_account");

            migrationBuilder.DropColumn(
                name: "identity_provider_id",
                schema: "manager",
                table: "user_account");

            migrationBuilder.AddColumn<int>(
                name: "role_id",
                schema: "manager",
                table: "user_account",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "zip_code",
                schema: "manager",
                table: "user_account",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

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
                name: "use_account_identity_provider",
                schema: "manager",
                columns: table => new
                {
                    identity_provider_id = table.Column<int>(type: "integer", nullable: false),
                    user_account_id = table.Column<int>(type: "integer", nullable: false)
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
                name: "granted_permission",
                schema: "manager",
                columns: table => new
                {
                    permission_id = table.Column<int>(type: "integer", nullable: false),
                    user_role_id = table.Column<int>(type: "integer", nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_user_account_role_id",
                schema: "manager",
                table: "user_account",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "IX_granted_permission_user_role_id",
                schema: "manager",
                table: "granted_permission",
                column: "user_role_id");

            migrationBuilder.CreateIndex(
                name: "IX_use_account_identity_provider_user_account_id",
                schema: "manager",
                table: "use_account_identity_provider",
                column: "user_account_id");

            migrationBuilder.AddForeignKey(
                name: "FK_user_account_user_role_role_id",
                schema: "manager",
                table: "user_account",
                column: "role_id",
                principalSchema: "manager",
                principalTable: "user_role",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
