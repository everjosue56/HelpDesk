using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class SeedAlertHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "alert_history",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_alert_configuration = table.Column<long>(type: "bigint", nullable: false),
                    id_user = table.Column<long>(type: "bigint", nullable: false),
                    action_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_alert_history", x => x.id);
                    table.ForeignKey(
                        name: "FK_alert_history_alert_configuration_id_alert_configuration",
                        column: x => x.id_alert_configuration,
                        principalTable: "alert_configuration",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_alert_history_user_id_user",
                        column: x => x.id_user,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "alert_history",
                columns: new[] { "id", "action_date", "created_by", "created_date", "id_alert_configuration", "id_user", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, new DateTime(2026, 5, 18, 10, 15, 0, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, 1L, null, null },
                    { 2L, new DateTime(2026, 5, 18, 16, 45, 22, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 2L, 1L, null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_alert_history_id_alert_configuration",
                table: "alert_history",
                column: "id_alert_configuration");

            migrationBuilder.CreateIndex(
                name: "IX_alert_history_id_user",
                table: "alert_history",
                column: "id_user");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "alert_history");
        }
    }
}
