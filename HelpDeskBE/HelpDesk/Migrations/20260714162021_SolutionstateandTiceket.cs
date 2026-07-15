using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class SolutionstateandTiceket : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "id_solution_state",
                table: "ticket",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "user_assigned_id",
                table: "ticket",
                type: "bigint",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "agency",
                keyColumn: "id",
                keyValue: 1L,
                column: "name",
                value: "Sede Principal - Example");

            migrationBuilder.UpdateData(
                table: "agency",
                keyColumn: "id",
                keyValue: 2L,
                column: "name",
                value: "Sucursal San Pedro Sula - Example");

            migrationBuilder.UpdateData(
                table: "agency",
                keyColumn: "id",
                keyValue: 3L,
                column: "name",
                value: "Oficina Desarrollo - Example ");

            migrationBuilder.UpdateData(
                table: "alert_configuration",
                keyColumn: "id",
                keyValue: 1L,
                column: "title",
                value: "Caída General de Servidores - Example");

            migrationBuilder.UpdateData(
                table: "alert_configuration",
                keyColumn: "id",
                keyValue: 2L,
                column: "title",
                value: "Mantenimiento Preventivo Trimestral - Example");

            migrationBuilder.UpdateData(
                table: "alert_type",
                keyColumn: "id",
                keyValue: 2L,
                column: "name",
                value: "Notificación Interna");

            migrationBuilder.UpdateData(
                table: "area",
                keyColumn: "id",
                keyValue: 1L,
                column: "name_area",
                value: "Sistemas / IT - Example ");

            migrationBuilder.UpdateData(
                table: "area",
                keyColumn: "id",
                keyValue: 2L,
                column: "name_area",
                value: "Contabilidad y Finanzas - Example");

            migrationBuilder.UpdateData(
                table: "area",
                keyColumn: "id",
                keyValue: 3L,
                column: "name_area",
                value: "Atención al Cliente - Example");

            migrationBuilder.UpdateData(
                table: "area",
                keyColumn: "id",
                keyValue: 4L,
                column: "name_area",
                value: "Ventas y Mercadeo - Example");

            migrationBuilder.UpdateData(
                table: "area",
                keyColumn: "id",
                keyValue: 5L,
                column: "name_area",
                value: "Logística y Bodega - Example");

            migrationBuilder.UpdateData(
                table: "device",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "brand_name", "code" },
                values: new object[] { "Dell Latitude 3420 - Example", "UNEE-001" });

            migrationBuilder.UpdateData(
                table: "device",
                keyColumn: "id",
                keyValue: 2L,
                column: "brand_name",
                value: "HP ProLiant DL380 - Example");

            migrationBuilder.UpdateData(
                table: "device",
                keyColumn: "id",
                keyValue: 3L,
                column: "brand_name",
                value: "Logitech M170 - Example");

            migrationBuilder.UpdateData(
                table: "maintenance",
                keyColumn: "id",
                keyValue: 1L,
                column: "details",
                value: "Limpieza física de ventiladores y cambio de pasta térmica - example.");

            migrationBuilder.UpdateData(
                table: "maintenance",
                keyColumn: "id",
                keyValue: 2L,
                column: "details",
                value: "Reemplazo de disco duro sólido por fallo en sectores - example.");

            migrationBuilder.UpdateData(
                table: "notification",
                keyColumn: "id",
                keyValue: 1L,
                column: "text_message",
                value: "Se te ha asignado el Ticket #101: Fallo de red en el Laboratorio de Cómputo - example.");

            migrationBuilder.UpdateData(
                table: "notification",
                keyColumn: "id",
                keyValue: 2L,
                column: "text_message",
                value: "El mantenimiento preventivo de la Laptop Dell (Id: 1) ha sido completado con éxito - example.");

            migrationBuilder.UpdateData(
                table: "organization",
                keyColumn: "id",
                keyValue: 1L,
                column: "name",
                value: "CODIMERSA - example");

            migrationBuilder.UpdateData(
                table: "organization",
                keyColumn: "id",
                keyValue: 2L,
                column: "name",
                value: "CODIMERSA - example");

            migrationBuilder.UpdateData(
                table: "resolution",
                keyColumn: "id",
                keyValue: 1L,
                column: "second_observation",
                value: "Se notificó al jefe de área - example.");

            migrationBuilder.UpdateData(
                table: "resolution",
                keyColumn: "id",
                keyValue: 2L,
                column: "observation",
                value: "Pruebas de carga exitosas después del reinicio - example.");

            migrationBuilder.UpdateData(
                table: "software_system",
                keyColumn: "id",
                keyValue: 1L,
                column: "name",
                value: "Infraestructura de Red / Servidores - example");

            migrationBuilder.UpdateData(
                table: "software_system",
                keyColumn: "id",
                keyValue: 2L,
                column: "name",
                value: "Correo Institucional y Suite Office - example");

            migrationBuilder.UpdateData(
                table: "ticket",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "description", "id_solution_state", "user_assigned_id" },
                values: new object[] { "Error al intentar referenciar un paciente en el módulo de emergencias - example.", 3L, null });

            migrationBuilder.UpdateData(
                table: "ticket",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "description", "id_solution_state", "user_assigned_id" },
                values: new object[] { "No se cargan las citas disponibles para el mes de junio en la vista de calendario - example.", 3L, null });

            migrationBuilder.UpdateData(
                table: "type_device",
                keyColumn: "id",
                keyValue: 1L,
                column: "name",
                value: "Desktop - example");

            migrationBuilder.UpdateData(
                table: "type_device",
                keyColumn: "id",
                keyValue: 2L,
                column: "name",
                value: "Laptop  - example");

            migrationBuilder.UpdateData(
                table: "type_device",
                keyColumn: "id",
                keyValue: 3L,
                column: "name",
                value: "Servidor  - example");

            migrationBuilder.UpdateData(
                table: "type_device",
                keyColumn: "id",
                keyValue: 4L,
                column: "name",
                value: "Impresora / Multifuncional  - example");

            migrationBuilder.UpdateData(
                table: "type_device",
                keyColumn: "id",
                keyValue: 5L,
                column: "name",
                value: "Equipo de Red  - example");

            migrationBuilder.UpdateData(
                table: "type_error",
                keyColumn: "id",
                keyValue: 1L,
                column: "name",
                value: "Errores de software - example");

            migrationBuilder.UpdateData(
                table: "type_error",
                keyColumn: "id",
                keyValue: 2L,
                column: "name",
                value: "Errores de conectividad y red - example");

            migrationBuilder.UpdateData(
                table: "type_error",
                keyColumn: "id",
                keyValue: 3L,
                column: "name",
                value: "Errores de Hadware y perifericos - example");

            migrationBuilder.UpdateData(
                table: "type_error",
                keyColumn: "id",
                keyValue: 4L,
                column: "name",
                value: "Consultas y configuracion - example");

            migrationBuilder.UpdateData(
                table: "type_maintenance",
                keyColumn: "id",
                keyValue: 1L,
                column: "name",
                value: "Mantenimiento Preventivo - example");

            migrationBuilder.UpdateData(
                table: "type_maintenance",
                keyColumn: "id",
                keyValue: 2L,
                column: "name",
                value: "Mantenimiento Correctiv - example");

            migrationBuilder.UpdateData(
                table: "type_maintenance",
                keyColumn: "id",
                keyValue: 3L,
                column: "name",
                value: "Actualización de Software - example");

            migrationBuilder.UpdateData(
                table: "type_maintenance",
                keyColumn: "id",
                keyValue: 4L,
                column: "name",
                value: "Limpieza de Hardware - example");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "email", "first_name", "last_name" },
                values: new object[] { "admin@me.com", "Example", "Example" });

            migrationBuilder.CreateIndex(
                name: "IX_ticket_id_solution_state",
                table: "ticket",
                column: "id_solution_state");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_user_assigned_id",
                table: "ticket",
                column: "user_assigned_id");

            migrationBuilder.AddForeignKey(
                name: "FK_ticket_solution_status_id_solution_state",
                table: "ticket",
                column: "id_solution_state",
                principalTable: "solution_status",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ticket_user_user_assigned_id",
                table: "ticket",
                column: "user_assigned_id",
                principalTable: "user",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ticket_solution_status_id_solution_state",
                table: "ticket");

            migrationBuilder.DropForeignKey(
                name: "FK_ticket_user_user_assigned_id",
                table: "ticket");

            migrationBuilder.DropIndex(
                name: "IX_ticket_id_solution_state",
                table: "ticket");

            migrationBuilder.DropIndex(
                name: "IX_ticket_user_assigned_id",
                table: "ticket");

            migrationBuilder.DropColumn(
                name: "id_solution_state",
                table: "ticket");

            migrationBuilder.DropColumn(
                name: "user_assigned_id",
                table: "ticket");

            migrationBuilder.UpdateData(
                table: "agency",
                keyColumn: "id",
                keyValue: 1L,
                column: "name",
                value: "Sede Principal - Santa Rosa");

            migrationBuilder.UpdateData(
                table: "agency",
                keyColumn: "id",
                keyValue: 2L,
                column: "name",
                value: "Sucursal San Pedro Sula");

            migrationBuilder.UpdateData(
                table: "agency",
                keyColumn: "id",
                keyValue: 3L,
                column: "name",
                value: "Oficina Desarrollo");

            migrationBuilder.UpdateData(
                table: "alert_configuration",
                keyColumn: "id",
                keyValue: 1L,
                column: "title",
                value: "Caída General de Servidores");

            migrationBuilder.UpdateData(
                table: "alert_configuration",
                keyColumn: "id",
                keyValue: 2L,
                column: "title",
                value: "Mantenimiento Preventivo Trimestral");

            migrationBuilder.UpdateData(
                table: "alert_type",
                keyColumn: "id",
                keyValue: 2L,
                column: "name",
                value: "Notificación Interna (In-App)");

            migrationBuilder.UpdateData(
                table: "area",
                keyColumn: "id",
                keyValue: 1L,
                column: "name_area",
                value: "Sistemas / IT");

            migrationBuilder.UpdateData(
                table: "area",
                keyColumn: "id",
                keyValue: 2L,
                column: "name_area",
                value: "Contabilidad y Finanzas");

            migrationBuilder.UpdateData(
                table: "area",
                keyColumn: "id",
                keyValue: 3L,
                column: "name_area",
                value: "Atención al Cliente");

            migrationBuilder.UpdateData(
                table: "area",
                keyColumn: "id",
                keyValue: 4L,
                column: "name_area",
                value: "Ventas y Mercadeo");

            migrationBuilder.UpdateData(
                table: "area",
                keyColumn: "id",
                keyValue: 5L,
                column: "name_area",
                value: "Logística y Bodega");

            migrationBuilder.UpdateData(
                table: "device",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "brand_name", "code" },
                values: new object[] { "Dell Latitude 3420", "UNAH-001" });

            migrationBuilder.UpdateData(
                table: "device",
                keyColumn: "id",
                keyValue: 2L,
                column: "brand_name",
                value: "HP ProLiant DL380");

            migrationBuilder.UpdateData(
                table: "device",
                keyColumn: "id",
                keyValue: 3L,
                column: "brand_name",
                value: "Logitech M170");

            migrationBuilder.UpdateData(
                table: "maintenance",
                keyColumn: "id",
                keyValue: 1L,
                column: "details",
                value: "Limpieza física de ventiladores y cambio de pasta térmica.");

            migrationBuilder.UpdateData(
                table: "maintenance",
                keyColumn: "id",
                keyValue: 2L,
                column: "details",
                value: "Reemplazo de disco duro sólido por fallo en sectores.");

            migrationBuilder.UpdateData(
                table: "notification",
                keyColumn: "id",
                keyValue: 1L,
                column: "text_message",
                value: "Se te ha asignado el Ticket #101: Fallo de red en el Laboratorio de Cómputo.");

            migrationBuilder.UpdateData(
                table: "notification",
                keyColumn: "id",
                keyValue: 2L,
                column: "text_message",
                value: "El mantenimiento preventivo de la Laptop Dell (Id: 1) ha sido completado con éxito.");

            migrationBuilder.UpdateData(
                table: "organization",
                keyColumn: "id",
                keyValue: 1L,
                column: "name",
                value: "CODIMERSA");

            migrationBuilder.UpdateData(
                table: "organization",
                keyColumn: "id",
                keyValue: 2L,
                column: "name",
                value: "CODIMERSA");

            migrationBuilder.UpdateData(
                table: "resolution",
                keyColumn: "id",
                keyValue: 1L,
                column: "second_observation",
                value: "Se notificó al jefe de área.");

            migrationBuilder.UpdateData(
                table: "resolution",
                keyColumn: "id",
                keyValue: 2L,
                column: "observation",
                value: "Pruebas de carga exitosas después del reinicio.");

            migrationBuilder.UpdateData(
                table: "software_system",
                keyColumn: "id",
                keyValue: 1L,
                column: "name",
                value: "Infraestructura de Red / Servidores");

            migrationBuilder.UpdateData(
                table: "software_system",
                keyColumn: "id",
                keyValue: 2L,
                column: "name",
                value: "Correo Institucional y Suite Office");

            migrationBuilder.UpdateData(
                table: "ticket",
                keyColumn: "id",
                keyValue: 1L,
                column: "description",
                value: "Error al intentar referenciar un paciente en el módulo de emergencias.");

            migrationBuilder.UpdateData(
                table: "ticket",
                keyColumn: "id",
                keyValue: 2L,
                column: "description",
                value: "No se cargan las citas disponibles para el mes de junio en la vista de calendario.");

            migrationBuilder.UpdateData(
                table: "type_device",
                keyColumn: "id",
                keyValue: 1L,
                column: "name",
                value: "Desktop");

            migrationBuilder.UpdateData(
                table: "type_device",
                keyColumn: "id",
                keyValue: 2L,
                column: "name",
                value: "Laptop");

            migrationBuilder.UpdateData(
                table: "type_device",
                keyColumn: "id",
                keyValue: 3L,
                column: "name",
                value: "Servidor");

            migrationBuilder.UpdateData(
                table: "type_device",
                keyColumn: "id",
                keyValue: 4L,
                column: "name",
                value: "Impresora / Multifuncional");

            migrationBuilder.UpdateData(
                table: "type_device",
                keyColumn: "id",
                keyValue: 5L,
                column: "name",
                value: "Equipo de Red");

            migrationBuilder.UpdateData(
                table: "type_error",
                keyColumn: "id",
                keyValue: 1L,
                column: "name",
                value: "Errores de software");

            migrationBuilder.UpdateData(
                table: "type_error",
                keyColumn: "id",
                keyValue: 2L,
                column: "name",
                value: "Errores de conectividad y red");

            migrationBuilder.UpdateData(
                table: "type_error",
                keyColumn: "id",
                keyValue: 3L,
                column: "name",
                value: "Errores de Hadware y perifericos");

            migrationBuilder.UpdateData(
                table: "type_error",
                keyColumn: "id",
                keyValue: 4L,
                column: "name",
                value: "Consultas y configuracion");

            migrationBuilder.UpdateData(
                table: "type_maintenance",
                keyColumn: "id",
                keyValue: 1L,
                column: "name",
                value: "Mantenimiento Preventivo");

            migrationBuilder.UpdateData(
                table: "type_maintenance",
                keyColumn: "id",
                keyValue: 2L,
                column: "name",
                value: "Mantenimiento Correctivo");

            migrationBuilder.UpdateData(
                table: "type_maintenance",
                keyColumn: "id",
                keyValue: 3L,
                column: "name",
                value: "Actualización de Software");

            migrationBuilder.UpdateData(
                table: "type_maintenance",
                keyColumn: "id",
                keyValue: 4L,
                column: "name",
                value: "Limpieza de Hardware");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "email", "first_name", "last_name" },
                values: new object[] { "admin@systemdeluxe.com", "Ever", "Garcia" });
        }
    }
}
