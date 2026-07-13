using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class AlertTypeSeeder : IEntityTypeConfiguration<AlertTypeEntity>
    {
        public void Configure(EntityTypeBuilder<AlertTypeEntity> builder)
        {
            builder.HasData(
                new AlertTypeEntity
                {
                    Id = 1,
                    Name = "Email",
                    CreatedDate = new DateTime(2026, 5, 18),
                    CreatedBy = 1 
                },
                new AlertTypeEntity
                {
                    Id = 2,
                    Name = "Notificación Interna",
                    CreatedDate = new DateTime(2026, 5, 18),
                    CreatedBy = 1
                },
                new AlertTypeEntity
                {
                    Id = 3,
                    Name = "Alerta Crítica del Sistema",
                    CreatedDate = new DateTime(2026, 5, 18),
                    CreatedBy = 1
                }
            );
        }
    }
}