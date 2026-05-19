using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class SeedResolution : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "resolution",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ticket_id = table.Column<long>(type: "bigint", nullable: false),
                    priority_id = table.Column<long>(type: "bigint", nullable: false),
                    action_taken = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    solution_status_id = table.Column<long>(type: "bigint", nullable: false),
                    resolution_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    root_cause = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    preventive_measures = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    observation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    second_observation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    device_id = table.Column<long>(type: "bigint", nullable: false),
                    solution_time = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resolution", x => x.id);
                    table.ForeignKey(
                        name: "FK_resolution_priority_priority_id",
                        column: x => x.priority_id,
                        principalTable: "priority",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_resolution_solution_status_solution_status_id",
                        column: x => x.solution_status_id,
                        principalTable: "solution_status",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_resolution_ticket_ticket_id",
                        column: x => x.ticket_id,
                        principalTable: "ticket",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_resolution_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "resolution",
                columns: new[] { "id", "action_taken", "created_by", "created_date", "device_id", "priority_id", "solution_status_id", "ticket_id", "user_id", "observation", "preventive_measures", "resolution_date", "root_cause", "second_observation", "solution_time", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, "Se depuró el procedimiento almacenado y se actualizaron los permisos de la base de datos.", 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, 1L, 1L, 1L, 1L, "El sistema quedó operativo inmediatamente.", "Implementar logs de auditoría para transacciones fallidas.", new DateTime(2026, 5, 14, 10, 0, 0, 0, DateTimeKind.Unspecified), "Conflicto de concurrencia en la tabla de referencias médicas.", "Se notificó al jefe de área.", 1.5m, null, null },
                    { 2L, "Se reinició el pool de aplicaciones en IIS y se limpió el caché del servidor.", 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, 2L, 1L, 2L, 1L, "Pruebas de carga exitosas después del reinicio.", "Programar reinicio automático de servicios los domingos.", new DateTime(2026, 5, 14, 15, 45, 0, 0, DateTimeKind.Unspecified), "Saturación de memoria en el servidor de pruebas.", "", 0.75m, null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_resolution_priority_id",
                table: "resolution",
                column: "priority_id");

            migrationBuilder.CreateIndex(
                name: "IX_resolution_solution_status_id",
                table: "resolution",
                column: "solution_status_id");

            migrationBuilder.CreateIndex(
                name: "IX_resolution_ticket_id",
                table: "resolution",
                column: "ticket_id");

            migrationBuilder.CreateIndex(
                name: "IX_resolution_user_id",
                table: "resolution",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "resolution");
        }
    }
}
