using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class SeedTypeSystemImpact : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "impact",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_impact", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "software_system",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_software_system", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "type_error",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_type_error", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "impact",
                columns: new[] { "id", "created_by", "created_date", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Bajo - Individual", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Medio - Departamento/Área", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Alto - Institucional/Sede", null, null },
                    { 4L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Crítico - Bloqueo Total de Operaciones", null, null }
                });

            migrationBuilder.InsertData(
                table: "software_system",
                columns: new[] { "id", "created_by", "created_date", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Infraestructura de Red / Servidores", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Correo Institucional y Suite Office", null, null }
                });

            migrationBuilder.InsertData(
                table: "type_error",
                columns: new[] { "id", "created_by", "created_date", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Errores de software", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Errores de conectividad y red", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Errores de Hadware y perifericos", null, null },
                    { 4L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Consultas y configuracion", null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "impact");

            migrationBuilder.DropTable(
                name: "software_system");

            migrationBuilder.DropTable(
                name: "type_error");
        }
    }
}
