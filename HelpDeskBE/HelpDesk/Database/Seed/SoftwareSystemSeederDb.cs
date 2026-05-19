using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class SoftwareSystemSeeder : IEntityTypeConfiguration<SoftwareSystemEntity>
    {
        public void Configure(EntityTypeBuilder<SoftwareSystemEntity> builder)
        {
            builder.HasData(
                new SoftwareSystemEntity
                {
                    Id = 1,
                    Name = "Infraestructura de Red / Servidores",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new SoftwareSystemEntity
                {
                    Id = 2,
                    Name = "Correo Institucional y Suite Office",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                }
            );
        }
    }
}