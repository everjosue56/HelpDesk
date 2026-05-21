using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class NewRolUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "second_observation",
                table: "resolution",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "observation",
                table: "resolution",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "agency",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "address", "email", "name" },
                values: new object[] { "Edificio 4", "dev@example.com", "Oficina Desarrollo" });

            migrationBuilder.UpdateData(
                table: "device",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "code", "observation" },
                values: new object[] { "UNAH-001", "Equipo nuevo asignado para desarrollo." });

            migrationBuilder.UpdateData(
                table: "organization",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "logo", "name" },
                values: new object[] { "codimersa_logo.png", "CODIMERSA" });

            migrationBuilder.UpdateData(
                table: "roles",
                keyColumn: "id",
                keyValue: 2L,
                column: "type",
                value: "TI");

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "id", "created_by", "created_date", "type", "updated_by", "updated_date" },
                values: new object[] { 3L, 1L, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cliente", null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "roles",
                keyColumn: "id",
                keyValue: 3L);

            migrationBuilder.AlterColumn<string>(
                name: "second_observation",
                table: "resolution",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AlterColumn<string>(
                name: "observation",
                table: "resolution",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.UpdateData(
                table: "agency",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "address", "email", "name" },
                values: new object[] { "Edificio 4, UNAH-CUROC", "dev@systemdeluxe.com", "Oficina Desarrollo - SystemdeLuxe" });

            migrationBuilder.UpdateData(
                table: "device",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "code", "observation" },
                values: new object[] { "UNAH-CUROC-001", "Equipo nuevo asignado para desarrollo de SIGREF." });

            migrationBuilder.UpdateData(
                table: "organization",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "logo", "name" },
                values: new object[] { "systemdeluxe_logo.png", "SystemdeLuxe Tech" });

            migrationBuilder.UpdateData(
                table: "roles",
                keyColumn: "id",
                keyValue: 2L,
                column: "type",
                value: "Tecnico");
        }
    }
}
