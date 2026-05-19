using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class seedDevice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "device",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    brand_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    code = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    id_device_type = table.Column<long>(type: "bigint", nullable: false),
                    id_user = table.Column<long>(type: "bigint", nullable: false),
                    id_area = table.Column<long>(type: "bigint", nullable: false),
                    observation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_device", x => x.id);
                    table.ForeignKey(
                        name: "FK_device_area_id_area",
                        column: x => x.id_area,
                        principalTable: "area",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_device_type_device_id_device_type",
                        column: x => x.id_device_type,
                        principalTable: "type_device",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_device_user_id_user",
                        column: x => x.id_user,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "device",
                columns: new[] { "id", "brand_name", "code", "created_by", "created_date", "id_area", "id_device_type", "id_user", "is_active", "observation", "quantity", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, "Dell Latitude 3420", "UNAH-CUROC-001", 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, 2L, 1L, true, "Equipo nuevo asignado para desarrollo de SIGREF.", 1, null, null },
                    { 2L, "HP ProLiant DL380", "SR-SERVER-01", 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, 3L, 1L, true, "Servidor principal de base de datos local.", 1, null, null },
                    { 3L, "Logitech M170", "ACC-GEN-01", 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 2L, 1L, 1L, true, "Lote de mouses para laboratorio.", 25, null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_device_code",
                table: "device",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_device_id_area",
                table: "device",
                column: "id_area");

            migrationBuilder.CreateIndex(
                name: "IX_device_id_device_type",
                table: "device",
                column: "id_device_type");

            migrationBuilder.CreateIndex(
                name: "IX_device_id_user",
                table: "device",
                column: "id_user");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "device");
        }
    }
}
