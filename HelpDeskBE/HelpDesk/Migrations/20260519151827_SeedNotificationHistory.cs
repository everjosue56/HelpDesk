using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class SeedNotificationHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "notification_history",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_notification = table.Column<long>(type: "bigint", nullable: false),
                    action_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notification_history", x => x.id);
                    table.ForeignKey(
                        name: "FK_notification_history_notification_id_notification",
                        column: x => x.id_notification,
                        principalTable: "notification",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "notification_history",
                columns: new[] { "id", "action_date", "created_by", "created_date", "id_notification", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, new DateTime(2026, 5, 18, 9, 0, 5, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, null, null },
                    { 2L, new DateTime(2026, 5, 18, 14, 30, 12, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 2L, null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_notification_history_id_notification",
                table: "notification_history",
                column: "id_notification");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "notification_history");
        }
    }
}
