using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class TypeErrorSeeder : IEntityTypeConfiguration<TypeErrorEntity>
    {
        public void Configure(EntityTypeBuilder<TypeErrorEntity> builder)
        {
            builder.HasData(
                new TypeErrorEntity
                {
                    Id = 1,
                    Name = "Errores de software",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new TypeErrorEntity
                {
                    Id = 2,
                    Name = "Errores de conectividad y red",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new TypeErrorEntity
                {
                    Id = 3,
                    Name = "Errores de Hadware y perifericos",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new TypeErrorEntity
                {
                    Id = 4,
                    Name = "Consultas y configuracion",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                }
            );
        }
    }
}