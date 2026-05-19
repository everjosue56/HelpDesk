using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class TypeMaintenanceSeeder : IEntityTypeConfiguration<TypeMaintenanceEntity>
    {
        public void Configure(EntityTypeBuilder<TypeMaintenanceEntity> builder)
        {
            builder.HasData(
                new TypeMaintenanceEntity
                {
                    Id = 1,
                    Name = "Mantenimiento Preventivo",
                    EstimatedTime = 60, 
                    CreatedDate = new DateTime(2026, 5, 15),
                    CreatedBy = 1
                },
                new TypeMaintenanceEntity
                {
                    Id = 2,
                    Name = "Mantenimiento Correctivo",
                    EstimatedTime = 120,
                    CreatedDate = new DateTime(2026, 5, 15),
                    CreatedBy = 1
                },
                new TypeMaintenanceEntity
                {
                    Id = 3,
                    Name = "Actualización de Software",
                    EstimatedTime = 45,
                    CreatedDate = new DateTime(2026, 5, 15),
                    CreatedBy = 1
                },
                new TypeMaintenanceEntity
                {
                    Id = 4,
                    Name = "Limpieza de Hardware",
                    EstimatedTime = 30,
                    CreatedDate = new DateTime(2026, 5, 15),
                    CreatedBy = 1
                }
            );
        }
    }
}