using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class SeedAlertType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "alert_type",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_alert_type", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "alert_type",
                columns: new[] { "id", "created_by", "created_date", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Email", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Notificación Interna (In-App)", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Alerta Crítica del Sistema", null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "alert_type");
        }
    }
}
