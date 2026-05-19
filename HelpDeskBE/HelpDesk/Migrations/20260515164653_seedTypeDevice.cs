using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class seedTypeDevice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "type_device",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    description = table.Column<string>(type: "nvarchar(240)", maxLength: 240, nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_type_device", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "type_device",
                columns: new[] { "id", "created_by", "created_date", "description", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Computadoras de escritorio de oficina o laboratorios.", "Desktop", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Equipos portátiles asignados a personal administrativo o docentes.", "Laptop", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Equipos de alto rendimiento para alojamiento de sistemas y bases de datos.", "Servidor", null, null },
                    { 4L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Dispositivos de impresión, escaneo y fotocopiado.", "Impresora / Multifuncional", null, null },
                    { 5L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Routers, Switches, Access Points y otros dispositivos de conectividad.", "Equipo de Red", null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "type_device");
        }
    }
}
