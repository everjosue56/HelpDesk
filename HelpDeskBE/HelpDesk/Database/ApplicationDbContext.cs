using HelpDesk.Database.Entities;
using HelpDesk.Database.Seed;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System.Threading.Tasks;

namespace HelpDesk.Database
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
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

        // --- Alertas y Notificaciones ---
        public DbSet<AlertTypeEntity> AlertsType { get; set; }
        public DbSet<NotificationEntity> Notifications { get; set; }
        public DbSet<AlertConfigurationEntity> AlertConfigurations { get; set; }
        public DbSet<NotificationHistoryEntity> NotificationHistories { get; set; }
        public DbSet<AlertHistoryEntity> AlertHistories { get; set; }
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

            // Relacion de agencia a organizacion 
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
            });
            
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
                // Especificamos el nombre de la tabla
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
        }
         
    }
}