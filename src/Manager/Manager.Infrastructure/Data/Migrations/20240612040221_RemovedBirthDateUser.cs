using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Manager.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovedBirthDateUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_subscription_offer_offer_id",
                schema: "manager",
                table: "subscription");

            migrationBuilder.DropColumn(
                name: "date_of_birth",
                schema: "manager",
                table: "user_account");

            migrationBuilder.AlterColumn<int>(
                name: "offer_id",
                schema: "manager",
                table: "subscription",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_subscription_offer_offer_id",
                schema: "manager",
                table: "subscription",
                column: "offer_id",
                principalSchema: "manager",
                principalTable: "offer",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_subscription_offer_offer_id",
                schema: "manager",
                table: "subscription");

            migrationBuilder.AddColumn<DateTime>(
                name: "date_of_birth",
                schema: "manager",
                table: "user_account",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<int>(
                name: "offer_id",
                schema: "manager",
                table: "subscription",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_subscription_offer_offer_id",
                schema: "manager",
                table: "subscription",
                column: "offer_id",
                principalSchema: "manager",
                principalTable: "offer",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
