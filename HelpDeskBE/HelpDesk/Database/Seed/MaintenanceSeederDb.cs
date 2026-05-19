using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class MaintenanceSeeder : IEntityTypeConfiguration<MaintenanceEntity>
    {
        public void Configure(EntityTypeBuilder<MaintenanceEntity> builder)
        {
            builder.HasData(
                new MaintenanceEntity
                {
                    Id = 1,
                    IdMaintenanceType = 1, 
                    IdArea = 1,           
                    IdDevice = 1,
                    NotificationDate = new DateTime(2026, 5, 10, 8, 0, 0),
                    CompletionDate = new DateTime(2026, 5, 10, 10, 0, 0),
                    Details = "Limpieza física de ventiladores y cambio de pasta térmica.",
                    ExecutionTime = 2.0m,
                    CreatedDate = new DateTime(2026, 5, 10),
                    CreatedBy = 1
                },
                new MaintenanceEntity
                {
                    Id = 2,
                    IdMaintenanceType = 2, 
                    IdArea = 2,          
                    IdDevice = 2,          
                    NotificationDate = new DateTime(2026, 5, 12, 14, 0, 0),
                    CompletionDate = new DateTime(2026, 5, 12, 17, 30, 0),
                    Details = "Reemplazo de disco duro sólido por fallo en sectores.",
                    ExecutionTime = 3.5m,
                    CreatedDate = new DateTime(2026, 5, 12),
                    CreatedBy = 1
                }
            );
        }
    }
}