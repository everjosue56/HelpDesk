using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class SeedTicket : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ticket",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    report_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    description = table.Column<string>(type: "nvarchar(360)", maxLength: 360, nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    type_error_id = table.Column<long>(type: "bigint", nullable: false),
                    area_id = table.Column<long>(type: "bigint", nullable: false),
                    software_system_id = table.Column<long>(type: "bigint", nullable: false),
                    impact_id = table.Column<long>(type: "bigint", nullable: false),
                    priority_id = table.Column<long>(type: "bigint", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ticket", x => x.id);
                    table.ForeignKey(
                        name: "FK_ticket_area_area_id",
                        column: x => x.area_id,
                        principalTable: "area",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ticket_impact_impact_id",
                        column: x => x.impact_id,
                        principalTable: "impact",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ticket_priority_priority_id",
                        column: x => x.priority_id,
                        principalTable: "priority",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ticket_software_system_software_system_id",
                        column: x => x.software_system_id,
                        principalTable: "software_system",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ticket_type_error_type_error_id",
                        column: x => x.type_error_id,
                        principalTable: "type_error",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ticket_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "ticket",
                columns: new[] { "id", "created_by", "created_date", "description", "area_id", "impact_id", "priority_id", "software_system_id", "type_error_id", "user_id", "is_active", "report_date", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Error al intentar referenciar un paciente en el módulo de emergencias.", 1L, 3L, 1L, 1L, 1L, 1L, true, new DateTime(2026, 5, 10, 8, 30, 0, 0, DateTimeKind.Unspecified), null, null },
                    { 2L, 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "No se cargan las citas disponibles para el mes de junio en la vista de calendario.", 1L, 2L, 2L, 2L, 4L, 1L, true, new DateTime(2026, 5, 12, 14, 15, 0, 0, DateTimeKind.Unspecified), null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ticket_area_id",
                table: "ticket",
                column: "area_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_impact_id",
                table: "ticket",
                column: "impact_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_priority_id",
                table: "ticket",
                column: "priority_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_software_system_id",
                table: "ticket",
                column: "software_system_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_type_error_id",
                table: "ticket",
                column: "type_error_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_user_id",
                table: "ticket",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ticket");
        }
    }
}
