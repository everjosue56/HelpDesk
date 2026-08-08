using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDesk.Migrations
{
    /// <inheritdoc />
    public partial class finish : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "alert_type",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_alert_type", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Action = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TableName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

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
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_impact", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "maintenance_frequency",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    days_interval = table.Column<int>(type: "int", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_maintenance_frequency", x => x.id);
                });

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
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_organization", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "priority",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_priority", x => x.id);
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
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "SlaGoals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Month = table.Column<int>(type: "int", nullable: false),
                    GoalValue = table.Column<double>(type: "float", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SlaGoals", x => x.Id);
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
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_software_system", x => x.id);
                });

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
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_solution_status", x => x.id);
                });

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
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_type_device", x => x.id);
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
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_type_error", x => x.id);
                });

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
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_type_maintenance", x => x.id);
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
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
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
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
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
                name: "alert_configuration",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    subject = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    is_global = table.Column<bool>(type: "bit", nullable: false),
                    area_id = table.Column<long>(type: "bigint", nullable: true),
                    agency_id = table.Column<long>(type: "bigint", nullable: true),
                    scheduled_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    last_triggerd_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_alert_configuration", x => x.id);
                    table.ForeignKey(
                        name: "FK_alert_configuration_agency_agency_id",
                        column: x => x.agency_id,
                        principalTable: "agency",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_alert_configuration_area_area_id",
                        column: x => x.area_id,
                        principalTable: "area",
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
                    password_reset_code = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    reset_code_expiry = table.Column<DateTime>(type: "datetime2", nullable: true),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
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

            migrationBuilder.CreateTable(
                name: "alert_history",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_alert_configuration = table.Column<long>(type: "bigint", nullable: false),
                    id_user = table.Column<long>(type: "bigint", nullable: false),
                    action_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_alert_history", x => x.id);
                    table.ForeignKey(
                        name: "FK_alert_history_alert_configuration_id_alert_configuration",
                        column: x => x.id_alert_configuration,
                        principalTable: "alert_configuration",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_alert_history_user_id_user",
                        column: x => x.id_user,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "device",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    brand_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    code = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    id_device_type = table.Column<long>(type: "bigint", nullable: false),
                    id_user = table.Column<long>(type: "bigint", nullable: false),
                    id_area = table.Column<long>(type: "bigint", nullable: false),
                    observation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_device", x => x.id);
                    table.ForeignKey(
                        name: "FK_device_area_id_area",
                        column: x => x.id_area,
                        principalTable: "area",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_device_type_device_id_device_type",
                        column: x => x.id_device_type,
                        principalTable: "type_device",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_device_user_id_user",
                        column: x => x.id_user,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "notification",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_user = table.Column<long>(type: "bigint", nullable: false),
                    id_alert_type = table.Column<long>(type: "bigint", nullable: false),
                    text_message = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    sent_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    is_read = table.Column<bool>(type: "bit", nullable: false),
                    id_reference = table.Column<long>(type: "bigint", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notification", x => x.id);
                    table.ForeignKey(
                        name: "FK_notification_alert_type_id_alert_type",
                        column: x => x.id_alert_type,
                        principalTable: "alert_type",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_notification_user_id_user",
                        column: x => x.id_user,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ticket",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    report_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    description = table.Column<string>(type: "nvarchar(360)", maxLength: 360, nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    type_error_id = table.Column<long>(type: "bigint", nullable: false),
                    area_id = table.Column<long>(type: "bigint", nullable: false),
                    software_system_id = table.Column<long>(type: "bigint", nullable: false),
                    impact_id = table.Column<long>(type: "bigint", nullable: false),
                    priority_id = table.Column<long>(type: "bigint", nullable: false),
                    id_solution_state = table.Column<long>(type: "bigint", nullable: false),
                    user_assigned_id = table.Column<long>(type: "bigint", nullable: true),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ticket", x => x.id);
                    table.ForeignKey(
                        name: "FK_ticket_area_area_id",
                        column: x => x.area_id,
                        principalTable: "area",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ticket_impact_impact_id",
                        column: x => x.impact_id,
                        principalTable: "impact",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ticket_priority_priority_id",
                        column: x => x.priority_id,
                        principalTable: "priority",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ticket_software_system_software_system_id",
                        column: x => x.software_system_id,
                        principalTable: "software_system",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ticket_solution_status_id_solution_state",
                        column: x => x.id_solution_state,
                        principalTable: "solution_status",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ticket_type_error_type_error_id",
                        column: x => x.type_error_id,
                        principalTable: "type_error",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ticket_user_user_assigned_id",
                        column: x => x.user_assigned_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ticket_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "maintenance",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_maintenance_type = table.Column<long>(type: "bigint", nullable: false),
                    id_area = table.Column<long>(type: "bigint", nullable: false),
                    completion_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    notification_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    id_device = table.Column<long>(type: "bigint", nullable: false),
                    details = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    execution_time = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    id_maintenance_frequency = table.Column<long>(type: "bigint", nullable: false),
                    solution_time = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_maintenance", x => x.id);
                    table.ForeignKey(
                        name: "FK_maintenance_area_id_area",
                        column: x => x.id_area,
                        principalTable: "area",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_maintenance_device_id_device",
                        column: x => x.id_device,
                        principalTable: "device",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_maintenance_maintenance_frequency_id_maintenance_frequency",
                        column: x => x.id_maintenance_frequency,
                        principalTable: "maintenance_frequency",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_maintenance_type_maintenance_id_maintenance_type",
                        column: x => x.id_maintenance_type,
                        principalTable: "type_maintenance",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "notification_history",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_notification = table.Column<long>(type: "bigint", nullable: false),
                    action_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notification_history", x => x.id);
                    table.ForeignKey(
                        name: "FK_notification_history_notification_id_notification",
                        column: x => x.id_notification,
                        principalTable: "notification",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "resolution",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ticket_id = table.Column<long>(type: "bigint", nullable: false),
                    priority_id = table.Column<long>(type: "bigint", nullable: false),
                    action_taken = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    solution_status_id = table.Column<long>(type: "bigint", nullable: false),
                    resolution_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    root_cause = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    preventive_measures = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    observation = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    second_observation = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    device_id = table.Column<long>(type: "bigint", nullable: true),
                    solution_time = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resolution", x => x.id);
                    table.ForeignKey(
                        name: "FK_resolution_device_device_id",
                        column: x => x.device_id,
                        principalTable: "device",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_resolution_priority_priority_id",
                        column: x => x.priority_id,
                        principalTable: "priority",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_resolution_solution_status_solution_status_id",
                        column: x => x.solution_status_id,
                        principalTable: "solution_status",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_resolution_ticket_ticket_id",
                        column: x => x.ticket_id,
                        principalTable: "ticket",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_resolution_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "maintenance_history",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_maintenance = table.Column<long>(type: "bigint", nullable: false),
                    id_device = table.Column<long>(type: "bigint", nullable: false),
                    id_user = table.Column<long>(type: "bigint", nullable: false),
                    solution_time = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    id_type_device = table.Column<long>(type: "bigint", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updated_date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_maintenance_history", x => x.id);
                    table.ForeignKey(
                        name: "FK_maintenance_history_device_id_device",
                        column: x => x.id_device,
                        principalTable: "device",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_maintenance_history_maintenance_id_maintenance",
                        column: x => x.id_maintenance,
                        principalTable: "maintenance",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_maintenance_history_type_device_id_type_device",
                        column: x => x.id_type_device,
                        principalTable: "type_device",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_maintenance_history_user_id_user",
                        column: x => x.id_user,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

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
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
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
                table: "alert_configuration",
                columns: new[] { "id", "created_by", "created_date", "description", "agency_id", "area_id", "is_active", "IsDeleted", "is_global", "last_triggerd_date", "scheduled_date", "subject", "title", "updated_by", "updated_date" },
                values: new object[] { 1L, 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Se ha detectado una pérdida de conectividad global en los servidores principales de la UNAH-CUROC. Equipo de TI favor verificar infraestructura.", null, null, false, false, true, null, null, "[CRÍTICO] Interrupción de Servicios de Red", "Caída General de Servidores - Example", null, null });

            migrationBuilder.InsertData(
                table: "alert_type",
                columns: new[] { "id", "created_by", "created_date", "IsDeleted", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Email", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Notificación Interna", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Alerta Crítica del Sistema", null, null }
                });

            migrationBuilder.InsertData(
                table: "impact",
                columns: new[] { "id", "created_by", "created_date", "IsDeleted", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Bajo - Individual", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Medio - Departamento/Área", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Alto - Institucional/Sede", null, null },
                    { 4L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Crítico - Bloqueo Total de Operaciones", null, null }
                });

            migrationBuilder.InsertData(
                table: "maintenance_frequency",
                columns: new[] { "id", "created_by", "created_date", "days_interval", "IsDeleted", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 0L, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 30, false, "Mensual", null, null },
                    { 2L, 0L, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 90, false, "Trimestral", null, null },
                    { 3L, 0L, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 180, false, "Semestral", null, null },
                    { 4L, 0L, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 365, false, "Anual", null, null }
                });

            migrationBuilder.InsertData(
                table: "organization",
                columns: new[] { "id", "address", "created_by", "created_date", "description", "IsDeleted", "logo", "name", "phone_number", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, "Santa Rosa de Copán", 1L, new DateTime(2026, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sede Principal", false, "codimersa_logo.png", "CODIMERSA - example", "50426620000", null, null },
                    { 2L, "Honduras", 1L, new DateTime(2026, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Servicios de Software", false, "codimersa_logo.png", "CODIMERSA - example", "50499999999", null, null }
                });

            migrationBuilder.InsertData(
                table: "priority",
                columns: new[] { "id", "created_by", "created_date", "IsDeleted", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Bajo", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Medio", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Alto", null, null },
                    { 4L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Urgente", null, null }
                });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "id", "created_by", "created_date", "IsDeleted", "type", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Administrador", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "TI", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Cliente", null, null }
                });

            migrationBuilder.InsertData(
                table: "software_system",
                columns: new[] { "id", "created_by", "created_date", "IsDeleted", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Infraestructura de Red / Servidores - example", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Correo Institucional y Suite Office - example", null, null }
                });

            migrationBuilder.InsertData(
                table: "solution_status",
                columns: new[] { "id", "created_by", "created_date", "IsDeleted", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Terminado", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "En Proceso", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Pendiente", null, null },
                    { 4L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Cancelado", null, null }
                });

            migrationBuilder.InsertData(
                table: "type_device",
                columns: new[] { "id", "created_by", "created_date", "description", "IsDeleted", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Computadoras de escritorio de oficina o laboratorios.", false, "Desktop - example", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Equipos portátiles asignados a personal administrativo o docentes.", false, "Laptop  - example", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Equipos de alto rendimiento para alojamiento de sistemas y bases de datos.", false, "Servidor  - example", null, null },
                    { 4L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Dispositivos de impresión, escaneo y fotocopiado.", false, "Impresora / Multifuncional  - example", null, null },
                    { 5L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Routers, Switches, Access Points y otros dispositivos de conectividad.", false, "Equipo de Red  - example", null, null }
                });

            migrationBuilder.InsertData(
                table: "type_error",
                columns: new[] { "id", "created_by", "created_date", "IsDeleted", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Errores de software - example", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Errores de conectividad y red - example", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Errores de Hadware y perifericos - example", null, null },
                    { 4L, 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Consultas y configuracion - example", null, null }
                });

            migrationBuilder.InsertData(
                table: "type_maintenance",
                columns: new[] { "id", "created_by", "created_date", "EstimatedTime", "IsDeleted", "name", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 60, false, "Mantenimiento Preventivo - example", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 120, false, "Mantenimiento Correctiv - example", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 45, false, "Actualización de Software - example", null, null },
                    { 4L, 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 30, false, "Limpieza de Hardware - example", null, null }
                });

            migrationBuilder.InsertData(
                table: "agency",
                columns: new[] { "id", "address", "created_by", "created_date", "email", "id_organization", "is_active", "IsDeleted", "name", "phone_number", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, "Barrio El Centro, Santa Rosa de Copán", 1L, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "src@codimersa.com", 1L, true, false, "Sede Principal - Example", "50426620000", null, null },
                    { 2L, "Barrio Guamilito, SPS", 1L, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "sps@codimersa.com", 1L, true, false, "Sucursal San Pedro Sula - Example", "50425500000", null, null },
                    { 3L, "Edificio 4", 1L, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "dev@example.com", 2L, true, false, "Oficina Desarrollo - Example ", "50499999999", null, null }
                });

            migrationBuilder.InsertData(
                table: "area",
                columns: new[] { "id", "created_by", "created_date", "id_agency", "is_active", "IsDeleted", "name_area", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, true, false, "Sistemas / IT - Example ", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, true, false, "Contabilidad y Finanzas - Example", null, null },
                    { 3L, 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, true, false, "Atención al Cliente - Example", null, null },
                    { 4L, 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 2L, true, false, "Ventas y Mercadeo - Example", null, null },
                    { 5L, 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 2L, true, false, "Logística y Bodega - Example", null, null }
                });

            migrationBuilder.InsertData(
                table: "alert_configuration",
                columns: new[] { "id", "created_by", "created_date", "description", "agency_id", "area_id", "is_active", "IsDeleted", "is_global", "last_triggerd_date", "scheduled_date", "subject", "title", "updated_by", "updated_date" },
                values: new object[] { 2L, 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Estimado equipo, se les recuerda que según el calendario establecido se debe dar inicio al mantenimiento preventivo de los laboratorios asignados.", null, 1L, false, false, false, null, new DateTime(2026, 6, 1, 8, 0, 0, 0, DateTimeKind.Unspecified), "Recordatorio: Inicio de Mantenimiento de Equipos de Cómputo", "Mantenimiento Preventivo Trimestral - Example", null, null });

            migrationBuilder.InsertData(
                table: "user",
                columns: new[] { "id", "created_by", "created_date", "email", "first_name", "id_agency", "id_area", "id_rol", "is_active", "IsDeleted", "last_name", "password_hash", "password_reset_code", "password_salt", "phone_number", "refresh_token", "reset_code_expiry", "token_created", "token_expires", "updated_by", "updated_date", "user_name" },
                values: new object[] { 1L, 1L, new DateTime(2026, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@me.com", "Example", 1L, 1L, 1L, true, false, "Example", new byte[] { 33, 173, 60, 232, 76, 104, 206, 56, 174, 132, 144, 132, 134, 158, 210, 202, 140, 38, 246, 213, 170, 123, 222, 111, 87, 231, 33, 204, 212, 175, 38, 180, 220, 29, 183, 218, 64, 109, 253, 85, 243, 239, 115, 91, 144, 59, 201, 244, 214, 255, 24, 19, 243, 70, 39, 143, 214, 70, 220, 21, 14, 82, 88, 212 }, null, new byte[] { 72, 101, 108, 112, 68, 101, 115, 107, 83, 116, 97, 116, 105, 99, 83, 101, 101, 100, 75, 101, 121, 70, 111, 114, 65, 100, 109, 105, 110, 49, 50, 51, 52, 46 }, "50400000000", "", null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "admin" });

            migrationBuilder.InsertData(
                table: "alert_history",
                columns: new[] { "id", "action_date", "created_by", "created_date", "id_alert_configuration", "id_user", "IsDeleted", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, new DateTime(2026, 5, 18, 10, 15, 0, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, 1L, false, null, null },
                    { 2L, new DateTime(2026, 5, 18, 16, 45, 22, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 2L, 1L, false, null, null }
                });

            migrationBuilder.InsertData(
                table: "device",
                columns: new[] { "id", "brand_name", "code", "created_by", "created_date", "id_area", "id_device_type", "id_user", "is_active", "IsDeleted", "observation", "quantity", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, "Dell Latitude 3420 - Example", "UNEE-001", 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, 2L, 1L, true, false, "Equipo nuevo asignado para desarrollo.", 1, null, null },
                    { 2L, "HP ProLiant DL380 - Example", "SR-SERVER-01", 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, 3L, 1L, true, false, "Servidor principal de base de datos local.", 1, null, null },
                    { 3L, "Logitech M170 - Example", "ACC-GEN-01", 1L, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 2L, 1L, 1L, true, false, "Lote de mouses para laboratorio.", 25, null, null }
                });

            migrationBuilder.InsertData(
                table: "notification",
                columns: new[] { "id", "created_by", "created_date", "id_alert_type", "id_reference", "id_user", "IsDeleted", "is_read", "sent_at", "text_message", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 18, 9, 0, 0, 0, DateTimeKind.Unspecified), 1L, 101L, 1L, false, false, null, "Se te ha asignado el Ticket #101: Fallo de red en el Laboratorio de Cómputo - example.", null, null },
                    { 2L, 1L, new DateTime(2026, 5, 18, 14, 30, 0, 0, DateTimeKind.Unspecified), 2L, 1L, 1L, false, true, new DateTime(2026, 5, 18, 14, 35, 0, 0, DateTimeKind.Unspecified), "El mantenimiento preventivo de la Laptop Dell (Id: 1) ha sido completado con éxito - example.", null, null }
                });

            migrationBuilder.InsertData(
                table: "ticket",
                columns: new[] { "id", "created_by", "created_date", "description", "area_id", "impact_id", "priority_id", "software_system_id", "id_solution_state", "type_error_id", "user_id", "user_assigned_id", "is_active", "IsDeleted", "report_date", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Error al intentar referenciar un paciente en el módulo de emergencias - example.", 1L, 3L, 1L, 1L, 3L, 1L, 1L, null, true, false, new DateTime(2026, 5, 10, 8, 30, 0, 0, DateTimeKind.Unspecified), null, null },
                    { 2L, 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "No se cargan las citas disponibles para el mes de junio en la vista de calendario - example.", 1L, 2L, 2L, 2L, 3L, 4L, 1L, null, true, false, new DateTime(2026, 5, 12, 14, 15, 0, 0, DateTimeKind.Unspecified), null, null }
                });

            migrationBuilder.InsertData(
                table: "maintenance",
                columns: new[] { "id", "completion_date", "created_by", "created_date", "details", "execution_time", "id_area", "id_device", "id_maintenance_frequency", "id_maintenance_type", "IsDeleted", "notification_date", "solution_time", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, new DateTime(2026, 5, 10, 10, 0, 0, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Limpieza física de ventiladores y cambio de pasta térmica - example.", 2.0m, 1L, 1L, 1L, 1L, false, new DateTime(2026, 5, 10, 8, 0, 0, 0, DateTimeKind.Unspecified), 0m, null, null },
                    { 2L, new DateTime(2026, 5, 12, 17, 30, 0, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Reemplazo de disco duro sólido por fallo en sectores - example.", 3.5m, 2L, 2L, 2L, 2L, false, new DateTime(2026, 5, 12, 14, 0, 0, 0, DateTimeKind.Unspecified), 0m, null, null }
                });

            migrationBuilder.InsertData(
                table: "notification_history",
                columns: new[] { "id", "action_date", "created_by", "created_date", "id_notification", "IsDeleted", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, new DateTime(2026, 5, 18, 9, 0, 5, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, false, null, null },
                    { 2L, new DateTime(2026, 5, 18, 14, 30, 12, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 2L, false, null, null }
                });

            migrationBuilder.InsertData(
                table: "resolution",
                columns: new[] { "id", "action_taken", "created_by", "created_date", "device_id", "priority_id", "solution_status_id", "ticket_id", "user_id", "IsDeleted", "observation", "preventive_measures", "resolution_date", "root_cause", "second_observation", "solution_time", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, "Se depuró el procedimiento almacenado y se actualizaron los permisos de la base de datos.", 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, 1L, 1L, 1L, 1L, false, "El sistema quedó operativo inmediatamente.", "Implementar logs de auditoría para transacciones fallidas.", new DateTime(2026, 5, 14, 10, 0, 0, 0, DateTimeKind.Unspecified), "Conflicto de concurrencia en la tabla de referencias médicas.", "Se notificó al jefe de área - example.", 1.5m, null, null },
                    { 2L, "Se reinició el pool de aplicaciones en IIS y se limpió el caché del servidor.", 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, 2L, 1L, 2L, 1L, false, "Pruebas de carga exitosas después del reinicio - example.", "Programar reinicio automático de servicios los domingos.", new DateTime(2026, 5, 14, 15, 45, 0, 0, DateTimeKind.Unspecified), "Saturación de memoria en el servidor de pruebas.", "", 0.75m, null, null }
                });

            migrationBuilder.InsertData(
                table: "maintenance_history",
                columns: new[] { "id", "created_by", "created_date", "id_device", "id_maintenance", "id_type_device", "id_user", "IsDeleted", "solution_time", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, 1L, 1L, 1L, false, 2.0m, null, null },
                    { 2L, 1L, new DateTime(2026, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 2L, 2L, 2L, 1L, false, 3.5m, null, null }
                });

            migrationBuilder.InsertData(
                table: "ticket_history",
                columns: new[] { "id", "close_date", "created_by", "created_date", "id_resolution", "id_report", "id_user", "IsDeleted", "updated_by", "updated_date" },
                values: new object[,]
                {
                    { 1L, new DateTime(2026, 5, 14, 11, 0, 0, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 1L, 1L, 1L, false, null, null },
                    { 2L, new DateTime(2026, 5, 14, 16, 30, 0, 0, DateTimeKind.Unspecified), 1L, new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 2L, 2L, 1L, false, null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_agency_id_organization",
                table: "agency",
                column: "id_organization");

            migrationBuilder.CreateIndex(
                name: "IX_alert_configuration_agency_id",
                table: "alert_configuration",
                column: "agency_id");

            migrationBuilder.CreateIndex(
                name: "IX_alert_configuration_area_id",
                table: "alert_configuration",
                column: "area_id");

            migrationBuilder.CreateIndex(
                name: "IX_alert_history_id_alert_configuration",
                table: "alert_history",
                column: "id_alert_configuration");

            migrationBuilder.CreateIndex(
                name: "IX_alert_history_id_user",
                table: "alert_history",
                column: "id_user");

            migrationBuilder.CreateIndex(
                name: "IX_area_id_agency",
                table: "area",
                column: "id_agency");

            migrationBuilder.CreateIndex(
                name: "IX_device_code",
                table: "device",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_device_id_area",
                table: "device",
                column: "id_area");

            migrationBuilder.CreateIndex(
                name: "IX_device_id_device_type",
                table: "device",
                column: "id_device_type");

            migrationBuilder.CreateIndex(
                name: "IX_device_id_user",
                table: "device",
                column: "id_user");

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_id_area",
                table: "maintenance",
                column: "id_area");

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_id_device",
                table: "maintenance",
                column: "id_device");

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_id_maintenance_frequency",
                table: "maintenance",
                column: "id_maintenance_frequency");

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_id_maintenance_type",
                table: "maintenance",
                column: "id_maintenance_type");

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_history_id_device",
                table: "maintenance_history",
                column: "id_device");

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_history_id_maintenance",
                table: "maintenance_history",
                column: "id_maintenance");

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_history_id_type_device",
                table: "maintenance_history",
                column: "id_type_device");

            migrationBuilder.CreateIndex(
                name: "IX_maintenance_history_id_user",
                table: "maintenance_history",
                column: "id_user");

            migrationBuilder.CreateIndex(
                name: "IX_notification_id_alert_type",
                table: "notification",
                column: "id_alert_type");

            migrationBuilder.CreateIndex(
                name: "IX_notification_id_user",
                table: "notification",
                column: "id_user");

            migrationBuilder.CreateIndex(
                name: "IX_notification_history_id_notification",
                table: "notification_history",
                column: "id_notification");

            migrationBuilder.CreateIndex(
                name: "IX_resolution_device_id",
                table: "resolution",
                column: "device_id");

            migrationBuilder.CreateIndex(
                name: "IX_resolution_priority_id",
                table: "resolution",
                column: "priority_id");

            migrationBuilder.CreateIndex(
                name: "IX_resolution_solution_status_id",
                table: "resolution",
                column: "solution_status_id");

            migrationBuilder.CreateIndex(
                name: "IX_resolution_ticket_id",
                table: "resolution",
                column: "ticket_id");

            migrationBuilder.CreateIndex(
                name: "IX_resolution_user_id",
                table: "resolution",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_area_id",
                table: "ticket",
                column: "area_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_id_solution_state",
                table: "ticket",
                column: "id_solution_state");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_impact_id",
                table: "ticket",
                column: "impact_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_priority_id",
                table: "ticket",
                column: "priority_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_software_system_id",
                table: "ticket",
                column: "software_system_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_type_error_id",
                table: "ticket",
                column: "type_error_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_user_assigned_id",
                table: "ticket",
                column: "user_assigned_id");

            migrationBuilder.CreateIndex(
                name: "IX_ticket_user_id",
                table: "ticket",
                column: "user_id");

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
                name: "alert_history");

            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "maintenance_history");

            migrationBuilder.DropTable(
                name: "notification_history");

            migrationBuilder.DropTable(
                name: "SlaGoals");

            migrationBuilder.DropTable(
                name: "ticket_history");

            migrationBuilder.DropTable(
                name: "alert_configuration");

            migrationBuilder.DropTable(
                name: "maintenance");

            migrationBuilder.DropTable(
                name: "notification");

            migrationBuilder.DropTable(
                name: "resolution");

            migrationBuilder.DropTable(
                name: "maintenance_frequency");

            migrationBuilder.DropTable(
                name: "type_maintenance");

            migrationBuilder.DropTable(
                name: "alert_type");

            migrationBuilder.DropTable(
                name: "device");

            migrationBuilder.DropTable(
                name: "ticket");

            migrationBuilder.DropTable(
                name: "type_device");

            migrationBuilder.DropTable(
                name: "impact");

            migrationBuilder.DropTable(
                name: "priority");

            migrationBuilder.DropTable(
                name: "software_system");

            migrationBuilder.DropTable(
                name: "solution_status");

            migrationBuilder.DropTable(
                name: "type_error");

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
