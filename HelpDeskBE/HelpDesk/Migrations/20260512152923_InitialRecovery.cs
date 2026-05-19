using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class InitialRecovery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "organization",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    logo = table.Column<string>(type: "nvarchar(240)", maxLength: 240, nullable: false),
                    phone_number = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    description = table.Column<string>(type: "nvarchar(240)", maxLength: 240, nullable: false),
                    address = table.Column<string>(type: "nvarchar(240)", maxLength: 240, nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_organization", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "agency",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    address = table.Column<string>(type: "nvarchar(240)", maxLength: 240, nullable: false),
                    phone_number = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    email = table.Column<string>(type: "nvarchar(240)", maxLength: 240, nullable: false),
                    id_organization = table.Column<long>(type: "bigint", nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_agency", x => x.id);
                    table.ForeignKey(
                        name: "FK_agency_organization_id_organization",
                        column: x => x.id_organization,
                        principalTable: "organization",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "area",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name_area = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    id_agency = table.Column<long>(type: "bigint", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_area", x => x.id);
                    table.ForeignKey(
                        name: "FK_area_agency_id_agency",
                        column: x => x.id_agency,
                        principalTable: "agency",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    first_name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    last_name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    user_name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    email = table.Column<string>(type: "nvarchar(240)", maxLength: 240, nullable: false),
                    password_hash = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    password_salt = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    phone_number = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    id_rol = table.Column<long>(type: "bigint", nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    id_agency = table.Column<long>(type: "bigint", nullable: false),
                    refresh_token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    token_created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    token_expires = table.Column<DateTime>(type: "datetime2", nullable: false),
                    id_area = table.Column<long>(type: "bigint", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user", x => x.id);
                    table.ForeignKey(
                        name: "FK_user_agency_id_agency",
                        column: x => x.id_agency,
                        principalTable: "agency",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_user_area_id_area",
                        column: x => x.id_area,
                        principalTable: "area",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_user_roles_id_rol",
                        column: x => x.id_rol,
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "organization",
                columns: new[] { "id", "address", "created_by", "created_date", "description", "logo", "name", "phone_number", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, "Santa Rosa de Copán", 1L, new DateTime(2026, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sede Principal", "codimersa_logo.png", "CODIMERSA", "50426620000", null, null },
                    { 2L, "Honduras", 1L, new DateTime(2026, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Servicios de Software", "systemdeluxe_logo.png", "SystemdeLuxe Tech", "50499999999", null, null }
                });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "id", "created_by", "created_date", "type", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Administrador", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Tecnico", null, null }
                });

            migrationBuilder.InsertData(
                table: "agency",
                columns: new[] { "id", "address", "created_by", "created_date", "email", "id_organization", "is_active", "name", "phone_number", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, "Barrio El Centro, Santa Rosa de Copán", 1L, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "src@codimersa.com", 1L, true, "Sede Principal - Santa Rosa", "50426620000", null, null },
                    { 2L, "Barrio Guamilito, SPS", 1L, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "sps@codimersa.com", 1L, true, "Sucursal San Pedro Sula", "50425500000", null, null },
                    { 3L, "Edificio 4, UNAH-CUROC", 1L, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "dev@systemdeluxe.com", 2L, true, "Oficina Desarrollo - SystemdeLuxe", "50499999999", null, null }
                });

            migrationBuilder.InsertData(
                table: "area",
                columns: new[] { "id", "created_by", "created_date", "id_agency", "is_active", "name_area", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, true, "Sistemas / IT", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, true, "Contabilidad y Finanzas", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, true, "Atención al Cliente", null, null },
                    { 4L, 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 2L, true, "Ventas y Mercadeo", null, null },
                    { 5L, 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 2L, true, "Logística y Bodega", null, null }
                });

            migrationBuilder.InsertData(
                table: "user",
                columns: new[] { "id", "created_by", "created_date", "email", "first_name", "id_agency", "id_area", "id_rol", "is_active", "last_name", "password_hash", "password_salt", "phone_number", "refresh_token", "token_created", "token_expires", "updated_by", "updated_date", "user_name" },
                values: new object[] { 1L, 1L, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@systemdeluxe.com", "Ever", 1L, 1L, 1L, true, "Garcia", new byte[] { 108, 107, 24, 155, 143, 101, 154, 137, 230, 203, 19, 110, 18, 159, 172, 237, 34, 181, 151, 169, 134, 155, 115, 20, 255, 106, 12, 191, 153, 31, 124, 60, 251, 25, 226, 182, 150, 48, 202, 202, 219, 109, 219, 165, 182, 121, 118, 132, 119, 173, 219, 39, 186, 68, 107, 33, 217, 109, 172, 150, 202, 124, 49, 142 }, new byte[] { 203, 205, 144, 230, 154, 213, 246, 21, 38, 184, 187, 33, 143, 214, 111, 244, 117, 135, 23, 159, 18, 11, 122, 125, 193, 191, 161, 39, 232, 164, 47, 57, 184, 111, 219, 121, 38, 109, 45, 170, 4, 18, 111, 110, 148, 175, 104, 112, 231, 187, 225, 47, 117, 206, 225, 121, 176, 254, 30, 232, 85, 227, 242, 154, 144, 17, 158, 238, 206, 44, 132, 248, 201, 8, 162, 53, 58, 124, 150, 177, 114, 174, 162, 70, 4, 243, 157, 85, 255, 192, 175, 30, 15, 230, 164, 199, 123, 121, 60, 20, 41, 253, 110, 135, 144, 223, 22, 144, 100, 39, 87, 113, 246, 8, 172, 33, 142, 157, 144, 18, 38, 226, 178, 254, 162, 101, 116, 233 }, "50400000000", "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "admin" });

            migrationBuilder.CreateIndex(
                name: "IX_agency_id_organization",
                table: "agency",
                column: "id_organization");

            migrationBuilder.CreateIndex(
                name: "IX_area_id_agency",
                table: "area",
                column: "id_agency");

            migrationBuilder.CreateIndex(
                name: "IX_user_id_agency",
                table: "user",
                column: "id_agency");

            migrationBuilder.CreateIndex(
                name: "IX_user_id_area",
                table: "user",
                column: "id_area");

            migrationBuilder.CreateIndex(
                name: "IX_user_id_rol",
                table: "user",
                column: "id_rol");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user");

            migrationBuilder.DropTable(
                name: "area");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "agency");

            migrationBuilder.DropTable(
                name: "organization");
        }
    }
}
