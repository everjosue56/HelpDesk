using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class CoreccionEnAlertConf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_active",
                table: "alert_configuration",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "alert_configuration",
                keyColumn: "id",
                keyValue: 1L,
                column: "is_active",
                value: false);

            migrationBuilder.UpdateData(
                table: "alert_configuration",
                keyColumn: "id",
                keyValue: 2L,
                column: "is_active",
                value: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_active",
                table: "alert_configuration");
        }
    }
}
