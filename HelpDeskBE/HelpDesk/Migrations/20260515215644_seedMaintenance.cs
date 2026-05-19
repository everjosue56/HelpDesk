using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class seedMaintenance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "maintenance",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_maintenance_type = table.Column<long>(type: "bigint", nullable: false),
                    id_area = table.Column<long>(type: "bigint", nullable: false),
                    completion_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    notification_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    id_device = table.Column<long>(type: "bigint", nullable: false),
                    details = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    execution_time = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_maintenance", x => x.id);
                    table.ForeignKey(
                        name: "FK_maintenance_area_id_area",
                        column: x => x.id_area,
                        principalTable: "area",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_maintenance_device_id_device",
                        column: x => x.id_device,
                        principalTable: "device",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_maintenance_type_maintenance_id_maintenance_type",
                        column: x => x.id_maintenance_type,
                        principalTable: "type_maintenance",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "maintenance",
                columns: new[] { "id", "completion_date", "created_by", "created_date", "details", "execution_time", "id_area", "id_device", "id_maintenance_type", "notification_date", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, new DateTime(2026, 5, 10, 10, 0, 0, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Limpieza física de ventiladores y cambio de pasta térmica.", 2.0m, 1L, 1L, 1L, new DateTime(2026, 5, 10, 8, 0, 0, 0, DateTimeKind.Unspecified), null, null },
                    { 2L, new DateTime(2026, 5, 12, 17, 30, 0, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Reemplazo de disco duro sólido por fallo en sectores.", 3.5m, 2L, 2L, 2L, new DateTime(2026, 5, 12, 14, 0, 0, 0, DateTimeKind.Unspecified), null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_resolution_device_id",
                table: "resolution",
                column: "device_id");

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_id_area",
                table: "maintenance",
                column: "id_area");

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_id_device",
                table: "maintenance",
                column: "id_device");

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_id_maintenance_type",
                table: "maintenance",
                column: "id_maintenance_type");

            migrationBuilder.AddForeignKey(
                name: "FK_resolution_device_device_id",
                table: "resolution",
                column: "device_id",
                principalTable: "device",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_resolution_device_device_id",
                table: "resolution");

            migrationBuilder.DropTable(
                name: "maintenance");

            migrationBuilder.DropIndex(
                name: "IX_resolution_device_id",
                table: "resolution");
        }
    }
}
