using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Manager.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixCollectionSelfReferenceOneToMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_collection_parent_node_id",
                schema: "manager",
                table: "collection");

            migrationBuilder.CreateIndex(
                name: "IX_collection_parent_node_id",
                schema: "manager",
                table: "collection",
                column: "parent_node_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_collection_parent_node_id",
                schema: "manager",
                table: "collection");

            migrationBuilder.CreateIndex(
                name: "IX_collection_parent_node_id",
                schema: "manager",
                table: "collection",
                column: "parent_node_id",
                unique: true);
        }
    }
}
