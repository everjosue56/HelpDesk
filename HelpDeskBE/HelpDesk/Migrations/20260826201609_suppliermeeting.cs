using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class suppliermeeting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_supplier_meeting_supplier_id_supplier",
                table: "supplier_meeting");

            migrationBuilder.InsertData(
                table: "supplier_meeting",
                columns: new[] { "id", "created_by", "created_date", "description", "evidence", "id_supplier", "IsDeleted", "meeting_date", "reason_work", "updated_by", "updated_date" },
                values: new object[] { 1L, 1L, new DateTime(2026, 8, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), "Empresa de red", "PDF", 1L, false, new DateTime(2026, 8, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), "Nuevas Actualizacones en el sistema.", null, null });

            migrationBuilder.AddForeignKey(
                name: "FK_supplier_meeting_supplier_id_supplier",
                table: "supplier_meeting",
                column: "id_supplier",
                principalTable: "supplier",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_supplier_meeting_supplier_id_supplier",
                table: "supplier_meeting");

            migrationBuilder.DeleteData(
                table: "supplier_meeting",
                keyColumn: "id",
                keyValue: 1L);

            migrationBuilder.AddForeignKey(
                name: "FK_supplier_meeting_supplier_id_supplier",
                table: "supplier_meeting",
                column: "id_supplier",
                principalTable: "supplier",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
