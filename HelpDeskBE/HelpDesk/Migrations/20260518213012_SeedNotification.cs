using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class SeedNotification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "notification",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_user = table.Column<long>(type: "bigint", nullable: false),
                    id_alert_type = table.Column<long>(type: "bigint", nullable: false),
                    text_message = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    sent_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    is_read = table.Column<bool>(type: "bit", nullable: false),
                    id_reference = table.Column<long>(type: "bigint", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notification", x => x.id);
                    table.ForeignKey(
                        name: "FK_notification_alert_type_id_alert_type",
                        column: x => x.id_alert_type,
                        principalTable: "alert_type",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_notification_user_id_user",
                        column: x => x.id_user,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "notification",
                columns: new[] { "id", "created_by", "created_date", "id_alert_type", "id_reference", "id_user", "is_read", "sent_at", "text_message", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 18, 9, 0, 0, 0, DateTimeKind.Unspecified), 1L, 101L, 1L, false, null, "Se te ha asignado el Ticket #101: Fallo de red en el Laboratorio de Cómputo.", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 18, 14, 30, 0, 0, DateTimeKind.Unspecified), 2L, 1L, 1L, true, new DateTime(2026, 5, 18, 14, 35, 0, 0, DateTimeKind.Unspecified), "El mantenimiento preventivo de la Laptop Dell (Id: 1) ha sido completado con éxito.", null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_notification_id_alert_type",
                table: "notification",
                column: "id_alert_type");

            migrationBuilder.CreateIndex(
                name: "IX_notification_id_user",
                table: "notification",
                column: "id_user");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "notification");
        }
    }
}
