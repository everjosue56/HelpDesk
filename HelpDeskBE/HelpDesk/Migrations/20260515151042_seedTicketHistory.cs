using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class seedTicketHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ticket_history",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_report = table.Column<long>(type: "bigint", nullable: false),
                    id_resolution = table.Column<long>(type: "bigint", nullable: false),
                    id_user = table.Column<long>(type: "bigint", nullable: false),
                    close_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ticket_history", x => x.id);
                    table.ForeignKey(
                        name: "FK_ticket_history_resolution_id_resolution",
                        column: x => x.id_resolution,
                        principalTable: "resolution",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ticket_history_ticket_id_report",
                        column: x => x.id_report,
                        principalTable: "ticket",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ticket_history_user_id_user",
                        column: x => x.id_user,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "ticket_history",
                columns: new[] { "id", "close_date", "created_by", "created_date", "id_resolution", "id_report", "id_user", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, new DateTime(2026, 5, 14, 11, 0, 0, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, 1L, 1L, null, null },
                    { 2L, new DateTime(2026, 5, 14, 16, 30, 0, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 2L, 2L, 1L, null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ticket_history_id_report",
                table: "ticket_history",
                column: "id_report");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_history_id_resolution",
                table: "ticket_history",
                column: "id_resolution");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_history_id_user",
                table: "ticket_history",
                column: "id_user");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ticket_history");
        }
    }
}
