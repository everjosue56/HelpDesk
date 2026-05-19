using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class SolutionStateSeeder : IEntityTypeConfiguration<SolutionStatusEntity>
    {
        public void Configure(EntityTypeBuilder<SolutionStatusEntity> builder)
        {
            builder.HasData(
                new SolutionStatusEntity
                {
                    Id = 1,
                    Name = "Terminado",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new SolutionStatusEntity
                {
                    Id = 2,
                    Name = "En Proceso",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new SolutionStatusEntity
                {
                    Id = 3,
                    Name = "Pendiente",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new SolutionStatusEntity
                {
                    Id = 4,
                    Name = "Cancelado",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                }
            );
        }
    }
}