using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class MaintenanceHistorySeeder : IEntityTypeConfiguration<MaintenanceHistoryEntity>
    {
        public void Configure(EntityTypeBuilder<MaintenanceHistoryEntity> builder)
        {
            builder.HasData(
                new MaintenanceHistoryEntity
                {
                    Id = 1,
                    IdMaintenance = 1, 
                    IdDevice = 1,     
                    IdUser = 1,        
                    IdTypeDevice = 1,
                    SolutionTime = 2.0m,
                    CreatedDate = new DateTime(2026, 5, 10),
                    CreatedBy = 1
                },
                new MaintenanceHistoryEntity
                {
                    Id = 2,
                    IdMaintenance = 2, 
                    IdDevice = 2,      
                    IdUser = 1,
                    IdTypeDevice = 2,
                    SolutionTime = 3.5m,
                    CreatedDate = new DateTime(2026, 5, 12),
                    CreatedBy = 1
                }
            );
        }
    }
}