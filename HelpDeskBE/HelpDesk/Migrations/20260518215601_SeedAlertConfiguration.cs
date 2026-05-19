using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class SeedAlertConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "alert_configuration",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    subject = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    is_global = table.Column<bool>(type: "bit", nullable: false),
                    area_id = table.Column<long>(type: "bigint", nullable: true),
                    agency_id = table.Column<long>(type: "bigint", nullable: true),
                    scheduled_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_alert_configuration", x => x.id);
                    table.ForeignKey(
                        name: "FK_alert_configuration_agency_agency_id",
                        column: x => x.agency_id,
                        principalTable: "agency",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_alert_configuration_area_area_id",
                        column: x => x.area_id,
                        principalTable: "area",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "alert_configuration",
                columns: new[] { "id", "created_by", "created_date", "description", "agency_id", "area_id", "is_global", "scheduled_date", "subject", "title", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Se ha detectado una pérdida de conectividad global en los servidores principales de la UNAH-CUROC. Equipo de TI favor verificar infraestructura.", null, null, true, null, "[CRÍTICO] Interrupción de Servicios de Red", "Caída General de Servidores", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Estimado equipo, se les recuerda que según el calendario establecido se debe dar inicio al mantenimiento preventivo de los laboratorios asignados.", null, 1L, false, new DateTime(2026, 6, 1, 8, 0, 0, 0, DateTimeKind.Unspecified), "Recordatorio: Inicio de Mantenimiento de Equipos de Cómputo", "Mantenimiento Preventivo Trimestral", null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_alert_configuration_agency_id",
                table: "alert_configuration",
                column: "agency_id");

            migrationBuilder.CreateIndex(
                name: "IX_alert_configuration_area_id",
                table: "alert_configuration",
                column: "area_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "alert_configuration");
        }
    }
}
