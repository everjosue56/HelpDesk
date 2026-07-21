using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class newfrequency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "solution_time",
                table: "maintenance",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.UpdateData(
                table: "maintenance",
                keyColumn: "id",
                keyValue: 1L,
                column: "solution_time",
                value: 0m);

            migrationBuilder.UpdateData(
                table: "maintenance",
                keyColumn: "id",
                keyValue: 2L,
                column: "solution_time",
                value: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "solution_time",
                table: "maintenance");
        }
    }
}
