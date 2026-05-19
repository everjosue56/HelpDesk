using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class seedTypeMaintenance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "type_maintenance",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    EstimatedTime = table.Column<int>(type: "int", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_type_maintenance", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "type_maintenance",
                columns: new[] { "id", "created_by", "created_date", "EstimatedTime", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 60, "Mantenimiento Preventivo", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 120, "Mantenimiento Correctivo", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 45, "Actualización de Software", null, null },
                    { 4L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 30, "Limpieza de Hardware", null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "type_maintenance");
        }
    }
}
