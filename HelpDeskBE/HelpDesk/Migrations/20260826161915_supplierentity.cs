using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class supplierentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "supplier",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_organization = table.Column<long>(type: "bigint", nullable: false),
                    name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    contac = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    email = table.Column<string>(type: "nvarchar(240)", maxLength: 240, nullable: false),
                    phone = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    registration_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    address = table.Column<string>(type: "nvarchar(240)", maxLength: 240, nullable: false),
                    compliance = table.Column<bool>(type: "bit", nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_supplier", x => x.id);
                    table.ForeignKey(
                        name: "FK_supplier_organization_id_organization",
                        column: x => x.id_organization,
                        principalTable: "organization",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "supplier_meeting",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_supplier = table.Column<long>(type: "bigint", nullable: false),
                    description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    reason_work = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    evidence = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    meeting_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_supplier_meeting", x => x.id);
                    table.ForeignKey(
                        name: "FK_supplier_meeting_supplier_id_supplier",
                        column: x => x.id_supplier,
                        principalTable: "supplier",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "supplier",
                columns: new[] { "id", "address", "compliance", "contac", "created_by", "created_date", "description", "email", "id_organization", "is_active", "IsDeleted", "name", "phone", "registration_date", "updated_by", "updated_date" },
                values: new object[] { 1L, "Ave 12 calle real numero 10", true, "Manuel", 1L, new DateTime(2026, 8, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), "Empresa de red", "Manuel@me.com", 1L, true, false, "Tigo - Example", "9032-4353", new DateTime(2026, 8, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null });

            migrationBuilder.CreateIndex(
                name: "IX_supplier_id_organization",
                table: "supplier",
                column: "id_organization");

            migrationBuilder.CreateIndex(
                name: "IX_supplier_meeting_id_supplier",
                table: "supplier_meeting",
                column: "id_supplier");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "supplier_meeting");

            migrationBuilder.DropTable(
                name: "supplier");
        }
    }
}
