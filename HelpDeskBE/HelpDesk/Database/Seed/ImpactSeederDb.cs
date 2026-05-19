using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class ImpactSeeder : IEntityTypeConfiguration<ImpactEntity>
    {
        public void Configure(EntityTypeBuilder<ImpactEntity> builder)
        {
            builder.HasData(
                new ImpactEntity
                {
                    Id = 1,
                    Name = "Bajo - Individual",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new ImpactEntity
                {
                    Id = 2,
                    Name = "Medio - Departamento/Área",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new ImpactEntity
                {
                    Id = 3,
                    Name = "Alto - Institucional/Sede",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new ImpactEntity
                {
                    Id = 4,
                    Name = "Crítico - Bloqueo Total de Operaciones",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                }
            );
        }
    }
}