using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class alertconfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "last_triggerd_date",
                table: "alert_configuration",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "alert_configuration",
                keyColumn: "id",
                keyValue: 1L,
                column: "last_triggerd_date",
                value: null);

            migrationBuilder.UpdateData(
                table: "alert_configuration",
                keyColumn: "id",
                keyValue: 2L,
                column: "last_triggerd_date",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "last_triggerd_date",
                table: "alert_configuration");
        }
    }
}
