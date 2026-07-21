using HelpDesk.Database.Entities;
using HelpDesk.Database.Seed;
using HelpDesk.Models;
using HelpDesk.Services.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;
using System.Threading;
using System.Threading.Tasks;

namespace HelpDesk.Database
{
    public class ApplicationDbContext : DbContext
    {
        private readonly ICurrentUserService _currentUserService;
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ICurrentUserService currentUserService)
            : base(options)
        {
            _currentUserService = currentUserService;
        }

        // --- UNIFICADO Fechas automáticas y Auditoría ---
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // 1. PRIMERO: Capturar los estados para la auditoría antes de alterar el Tracker
            var auditEntries = OnBeforeSaveChanges();

            // 2. LUEGO: Asignación automática de fechas de BaseEntity
            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var entityEntry in entries)
            {
                if (entityEntry.State == EntityState.Added)
                {
                    entityEntry.Entity.CreatedDate = DateTime.UtcNow;
                    entityEntry.Entity.IsDeleted = false;
                }
                else if (entityEntry.State == EntityState.Modified)
                {
                    entityEntry.Entity.UpdatedDate = DateTime.UtcNow;
                    entityEntry.Property(x => x.CreatedDate).IsModified = false;
                    entityEntry.Property(x => x.CreatedBy).IsModified = false;
                }
            }

            // 3. Guardar los cambios principales en la base de datos (SQL Server)
            var result = await base.SaveChangesAsync(cancellationToken);

            // 4. Escribir la bitácora de auditoría si se generaron registros válidos
            if (auditEntries != null && auditEntries.Count > 0)
            {
                await OnAfterSaveChanges(auditEntries);
            }

            return result;
        }

        private List<AuditLog> OnBeforeSaveChanges()
        {
            // Forzamos a EF a consolidar el estado de todas las entidades en memoria
            ChangeTracker.DetectChanges();
            var auditEntries = new List<AuditLog>();
            var userName = _currentUserService.GetUserName();

            foreach (var entry in ChangeTracker.Entries())
            {
                // Evitamos auditar la misma tabla de logs para prevenir bucles infinitos en SQL Server
                if (entry.Entity is AuditLog || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                    continue;

                var log = new AuditLog
                {
                    UserName = userName,
                    TableName = entry.Entity.GetType().Name,
                    CreatedAt = DateTime.UtcNow
                };

                if (entry.State == EntityState.Added)
                {
                    log.Action = "CREATE";
                    log.Description = $"Se creó un nuevo registro en la tabla {log.TableName}.";
                    auditEntries.Add(log);
                }
                else if (entry.State == EntityState.Deleted)
                {
                    log.Action = "DELETE";
                    log.Description = $"Se eliminó de forma física el registro de la tabla {log.TableName}.";
                    auditEntries.Add(log);
                }
                else if (entry.State == EntityState.Modified)
                {
                    // INTERCEPCIÓN DE BORRADO LÓGICO:
                    // Buscamos si la entidad modificada tiene las columnas típicas de desactivación
                    var statusProperty = entry.Properties.FirstOrDefault(p =>
                        p.Metadata.Name == "IsDeleted" ||
                        p.Metadata.Name == "IsActive"
                    );

                    if (statusProperty != null && statusProperty.IsModified)
                    {
                        bool currentValue = false;

                        // Evaluamos el valor booleano actual que se va a guardar en SQL Server
                        if (statusProperty.CurrentValue is bool boolVal)
                        {
                            currentValue = boolVal;
                        }

                        // Caso A: Si 'IsDeleted' cambió a TRUE o Caso B: Si 'IsActive' cambió a FALSE
                        if ((statusProperty.Metadata.Name == "IsDeleted" && currentValue == true) ||
                            (statusProperty.Metadata.Name == "IsActive" && currentValue == false))
                        {
                            log.Action = "DELETE";
                            log.Description = $"Se realizó una desactivación (borrado lógico) en la tabla {log.TableName}.";
                        }
                        else
                        {
                            // Si se modificó la columna pero volvió a activarse o es un UPDATE común
                            log.Action = "UPDATE";
                            log.Description = $"Se actualizaron campos en la tabla {log.TableName}.";
                        }
                    }
                    else
                    {
                        // Si no se tocó ninguna bandera de estado, es un UPDATE normal de datos
                        log.Action = "UPDATE";
                        log.Description = $"Se actualizaron campos en la tabla {log.TableName}.";
                    }

                    auditEntries.Add(log);
                }
            }

            return auditEntries;
        }

        private async Task OnAfterSaveChanges(List<AuditLog> auditEntries)
        {
            if (auditEntries == null || auditEntries.Count == 0) return;

            // Guardamos los logs generados en la base de datos de SQL Server
            AuditLogs.AddRange(auditEntries);
            await base.SaveChangesAsync();
        }
        // --- Tablas de Organizacion ---
        public DbSet<OrganizationEntity> Organizations { get; set; }
        public DbSet<UserEntity> Users { get; set; }
        public DbSet<RolEntity> Roles { get; set; }
        public DbSet<AgencyEntity> Agencies { get; set; }
        public DbSet<AreaEntity> Areas { get; set; }

        // --- Reportes y Soluciones ---
        public DbSet<TypeErrorEntity> TypeErrors { get; set; }
        public DbSet<ImpactEntity> Impacts { get; set; }
        public DbSet<SoftwareSystemEntity> SoftwareSystems { get; set; }
        public DbSet<PriorityEntity> Priorities { get; set; }
        public DbSet<TicketEntity> Tickets { get; set; }
        public DbSet<SolutionStatusEntity> SolutionsState { get; set; }
        public DbSet<ResolutionEntity> Resolutions { get; set; }
        public DbSet<TicketHistoryEntity> TicketHistories { get; set; }

        // --- Mantenimiento ---
        public DbSet<TypeMaintenanceEntity> TypeMaintenances { get; set; }
        public DbSet<TypeDeviceEntity> TypeDevices { get; set; }
        public DbSet<DeviceEntity> Devices { get; set; }
        public DbSet<MaintenanceEntity> Maintenances { get; set; }
        public DbSet<MaintenanceHistoryEntity> MaintenanceHistories { get; set; }
        public DbSet<MaintenanceFrequencyEntity> MaintenanceFrequencies { get; set; }

        // --- Alertas y Notificaciones ---
        public DbSet<AlertTypeEntity> AlertsType { get; set; }
        public DbSet<NotificationEntity> Notifications { get; set; }
        public DbSet<AlertConfigurationEntity> AlertConfigurations { get; set; }
        public DbSet<NotificationHistoryEntity> NotificationHistories { get; set; }
        public DbSet<AlertHistoryEntity> AlertHistories { get; set; }

        // --- Auditoria ---
        public DbSet<AuditLog> AuditLogs { get; set; }

        // --- Dashboard ---
        public DbSet<SlaGoalEntity> SlaGoals { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Carga automática de todos los Seeders y configuraciones
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

            // 2. Ajustes de precisión para nombres de tablas (Snake Case)
            modelBuilder.Entity<OrganizationEntity>().ToTable("organization");
            modelBuilder.Entity<UserEntity>().ToTable("user");
            modelBuilder.Entity<RolEntity>().ToTable("roles");
            modelBuilder.Entity<AgencyEntity>().ToTable("agency");
            modelBuilder.Entity<AreaEntity>().ToTable("area");
            modelBuilder.Entity<TypeErrorEntity>().ToTable("type_error");
            modelBuilder.Entity<ImpactEntity>().ToTable("impact");
            modelBuilder.Entity<SoftwareSystemEntity>().ToTable("software_system");
            modelBuilder.Entity<PriorityEntity>().ToTable("priority");
            modelBuilder.Entity<TicketEntity>().ToTable("ticket");
            modelBuilder.Entity<SolutionStatusEntity>().ToTable("solution_status");
            modelBuilder.Entity<ResolutionEntity>().ToTable("resolution");
            modelBuilder.Entity<TicketHistoryEntity>().ToTable("ticket_history");
            modelBuilder.Entity<TypeMaintenanceEntity>().ToTable("type_maintenance");
            modelBuilder.Entity<TypeDeviceEntity>().ToTable("type_device");
            modelBuilder.Entity<DeviceEntity>().ToTable("device");
            modelBuilder.Entity<MaintenanceEntity>().ToTable("maintenance");
            modelBuilder.Entity<MaintenanceHistoryEntity>().ToTable("maintenance_history");
            modelBuilder.Entity<AlertTypeEntity>().ToTable("alert_type");
            modelBuilder.Entity<NotificationEntity>().ToTable("notification");
            modelBuilder.Entity<AlertConfigurationEntity>().ToTable("alert_configuration");
            modelBuilder.Entity<NotificationHistoryEntity>().ToTable("notification_history");
            modelBuilder.Entity<AlertHistoryEntity>().ToTable("alert_history");
            modelBuilder.Entity<MaintenanceFrequencyEntity>().ToTable("maintenance_frequency");

            // 3. Configuración de Relaciones (Fluent API)

            // Relación Usuario -> Rol
            modelBuilder.Entity<UserEntity>()
                .HasOne(u => u.Roles)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.IdRol)
                .OnDelete(DeleteBehavior.Restrict);

            // Relación Usuario -> Agencia
            modelBuilder.Entity<UserEntity>()
                .HasOne(u => u.Agency)
                .WithMany(a => a.Users)
                .HasForeignKey(u => u.IdAgency)
                .OnDelete(DeleteBehavior.Restrict);

            // Relación de agencia a organizacion 
            modelBuilder.Entity<AgencyEntity>(entity =>
            {
                entity.ToTable("agency");
                entity.HasOne(a => a.Organizations)
                    .WithMany(o => o.Agencies)
                    .HasForeignKey(a => a.IdOrganization)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<AreaEntity>(entity =>
            {
                entity.ToTable("area");

                // Relación Agencia -> Áreas
                entity.HasOne(a => a.Agencies)
                    .WithMany(ag => ag.Areas)
                    .HasForeignKey(a => a.IdAgency)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Relación Usuario -> Área
            modelBuilder.Entity<UserEntity>()
                .HasOne(u => u.Area)
                .WithMany(a => a.Users)
                .HasForeignKey(u => u.IdArea)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuración para la entidad Ticket
            modelBuilder.Entity<TicketEntity>(entity =>
            {
                entity.ToTable("ticket");

                // Relación con Usuario
                entity.HasOne(t => t.User)
                    .WithMany()
                    .HasForeignKey(t => t.IdUser)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relación con Tipo de Error
                entity.HasOne(t => t.TypeError)
                    .WithMany()
                    .HasForeignKey(t => t.IdTypeError)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relación con Área
                entity.HasOne(t => t.Area)
                    .WithMany()
                    .HasForeignKey(t => t.IdArea)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relación con SoftwareSystem 
                entity.HasOne(t => t.SoftwareSystem)
                    .WithMany()
                    .HasForeignKey(t => t.IdSoftwareSystem)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relación con Impacto
                entity.HasOne(t => t.Impact)
                    .WithMany()
                    .HasForeignKey(t => t.IdImpact)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relación con Prioridad
                entity.HasOne(t => t.Priority)
                    .WithMany()
                    .HasForeignKey(t => t.IdPriority)
                    .OnDelete(DeleteBehavior.Restrict);

               entity.HasOne(t => t.AssignedUser)
                    .WithMany()
                    .HasForeignKey(t => t.IdUserAssigned)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(t => t.SolutionStatus)
                    .WithMany()
                    .HasForeignKey(t => t.IdSolutionState)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ResolutionEntity>(entity =>
            {
                entity.ToTable("resolution");

                // Relación con el Ticket 
                entity.HasOne(r => r.Ticket)
                    .WithMany()
                    .HasForeignKey(r => r.IdTicket)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relación con el Usuario (Técnico que resuelve)
                entity.HasOne(r => r.User)
                    .WithMany()
                    .HasForeignKey(r => r.IdUser)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relación con el Estado de la Solución
                entity.HasOne(r => r.SolutionStatus)
                    .WithMany()
                    .HasForeignKey(r => r.IdSolutionStatus)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relación con el Dispositivo
                entity.HasOne(r => r.Device)
                    .WithMany()
                    .HasForeignKey(r => r.IdDevice)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relación con la Prioridad
                entity.HasOne(r => r.Priority)
                    .WithMany()
                    .HasForeignKey(r => r.IdPriority)
                    .OnDelete(DeleteBehavior.Restrict);

                // Configuración del campo decimal para el tiempo de solución
                entity.Property(r => r.SolutionTime)
                    .HasPrecision(5, 2);
            });

            modelBuilder.Entity<TicketHistoryEntity>(entity =>
            {
                entity.ToTable("ticket_history");

                // Relación con el Ticket original
                entity.HasOne(th => th.Ticket)
                    .WithMany()
                    .HasForeignKey(th => th.IdTicket)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relación con la Resolución
                entity.HasOne(th => th.Resolution)
                    .WithMany()
                    .HasForeignKey(th => th.IdResolution)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relación con el Usuario que cerró el historial
                entity.HasOne(th => th.User)
                    .WithMany()
                    .HasForeignKey(th => th.IdUser)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<DeviceEntity>(entity =>
            {
                entity.ToTable("device");

                // Relación con Tipo de Dispositivo
                entity.HasOne(d => d.TypeDevices)
                    .WithMany()
                    .HasForeignKey(d => d.IdDeviceType)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relación con el Usuario Responsable
                entity.HasOne(d => d.Users)
                    .WithMany()
                    .HasForeignKey(d => d.IdUser)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relación con el Área Física
                entity.HasOne(d => d.Areas)
                    .WithMany()
                    .HasForeignKey(d => d.IdArea)
                    .OnDelete(DeleteBehavior.Restrict);

                // Índice único para el Código de Inventario
                entity.HasIndex(d => d.Code).IsUnique();
            });

            modelBuilder.Entity<MaintenanceEntity>(entity =>
            {
                entity.ToTable("maintenance");

                // 1. Relación con Tipo de Mantenimiento
                entity.HasOne(m => m.TypeMaintenance)
                    .WithMany()
                    .HasForeignKey(m => m.IdMaintenanceType)
                    .OnDelete(DeleteBehavior.Restrict);

                // 2. Relación con el Área Física
                entity.HasOne(m => m.Area)
                    .WithMany()
                    .HasForeignKey(m => m.IdArea)
                    .OnDelete(DeleteBehavior.Restrict);

                // 3. Relación con el Dispositivo / Equipo
                entity.HasOne(m => m.Device)
                    .WithMany()
                    .HasForeignKey(m => m.IdDevice)
                    .OnDelete(DeleteBehavior.Restrict);

                // 4. Relacion con Frecuencia
                entity.HasOne(m => m.MaintenanceFrequencies)
                    .WithMany()
                    .HasForeignKey(m => m.IdMaintenanceFrequency)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<MaintenanceHistoryEntity>(entity =>
            {
                entity.ToTable("maintenance_history");

                entity.HasOne(mh => mh.Maintenances)
                    .WithMany()
                    .HasForeignKey(mh => mh.IdMaintenance)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(mh => mh.Devices)
                    .WithMany()
                    .HasForeignKey(mh => mh.IdDevice)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(mh => mh.Users)
                    .WithMany()
                    .HasForeignKey(mh => mh.IdUser)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(mh => mh.DevicesType)
                    .WithMany()
                    .HasForeignKey(mh => mh.IdTypeDevice)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<NotificationEntity>(entity =>
            {
                entity.ToTable("notification");

                entity.HasOne(n => n.Users)
                    .WithMany()
                    .HasForeignKey(n => n.IdUser)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(n => n.AlertTypes)
                    .WithMany()
                    .HasForeignKey(n => n.IdAlertType)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<AlertConfigurationEntity>(entity =>
            {
                entity.ToTable("alert_configuration");

                entity.HasOne(ac => ac.Areas)
                      .WithMany()
                      .HasForeignKey(ac => ac.IdArea)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(ac => ac.Agencys)
                      .WithMany()
                      .HasForeignKey(ac => ac.IdAgency)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<NotificationHistoryEntity>(entity =>
            {
                entity.ToTable("notification_history");

                entity.HasOne(nh => nh.Notifications)
                    .WithMany()
                    .HasForeignKey(nh => nh.IdNotification)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<AlertHistoryEntity>(entity =>
            {
                entity.ToTable("alert_history");

                entity.HasOne(ah => ah.AlertConfiguration)
                    .WithMany()
                    .HasForeignKey(ah => ah.IdAlertConfiguration)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(ah => ah.User)
                    .WithMany()
                    .HasForeignKey(ah => ah.IdUser)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<OrganizationEntity>().HasQueryFilter(o => !o.IsDeleted);
            modelBuilder.Entity<AgencyEntity>().HasQueryFilter(a => !a.IsDeleted);
            modelBuilder.Entity<AreaEntity>().HasQueryFilter(a => !a.IsDeleted);
            modelBuilder.Entity<UserEntity>().HasQueryFilter(a => !a.IsDeleted);
        }
    }
}