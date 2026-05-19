using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class SeedSolutionState : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "solution_status",
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
                    table.PrimaryKey("PK_solution_status", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "solution_status",
                columns: new[] { "id", "created_by", "created_date", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Terminado", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "En Proceso", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pendiente", null, null },
                    { 4L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cancelado", null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "solution_status");
        }
    }
}
