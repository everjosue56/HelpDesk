using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class SeedMaintenanceHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "maintenance_history",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_maintenance = table.Column<long>(type: "bigint", nullable: false),
                    id_device = table.Column<long>(type: "bigint", nullable: false),
                    id_user = table.Column<long>(type: "bigint", nullable: false),
                    solution_time = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    id_type_device = table.Column<long>(type: "bigint", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_maintenance_history", x => x.id);
                    table.ForeignKey(
                        name: "FK_maintenance_history_device_id_device",
                        column: x => x.id_device,
                        principalTable: "device",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_maintenance_history_maintenance_id_maintenance",
                        column: x => x.id_maintenance,
                        principalTable: "maintenance",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_maintenance_history_type_device_id_type_device",
                        column: x => x.id_type_device,
                        principalTable: "type_device",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_maintenance_history_user_id_user",
                        column: x => x.id_user,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "maintenance_history",
                columns: new[] { "id", "created_by", "created_date", "id_device", "id_maintenance", "id_type_device", "id_user", "solution_time", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, 1L, 1L, 1L, 2.0m, null, null },
                    { 2L, 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 2L, 2L, 2L, 1L, 3.5m, null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_history_id_device",
                table: "maintenance_history",
                column: "id_device");

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_history_id_maintenance",
                table: "maintenance_history",
                column: "id_maintenance");

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_history_id_type_device",
                table: "maintenance_history",
                column: "id_type_device");

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_history_id_user",
                table: "maintenance_history",
                column: "id_user");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "maintenance_history");
        }
    }
}
