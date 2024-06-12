using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Manager.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class sync_usertable_entra_attributes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "name",
                schema: "manager",
                table: "user_account",
                newName: "given_name");

            migrationBuilder.AlterColumn<string>(
                name: "username",
                schema: "manager",
                table: "user_account",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "display_name",
                schema: "manager",
                table: "user_account",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "display_name",
                schema: "manager",
                table: "user_account");

            migrationBuilder.RenameColumn(
                name: "given_name",
                schema: "manager",
                table: "user_account",
                newName: "name");

            migrationBuilder.AlterColumn<string>(
                name: "username",
                schema: "manager",
                table: "user_account",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);
        }
    }
}
