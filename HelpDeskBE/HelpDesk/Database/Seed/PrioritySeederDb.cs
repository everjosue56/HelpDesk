using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class PrioritySeeder : IEntityTypeConfiguration<PriorityEntity>
    {
        public void Configure(EntityTypeBuilder<PriorityEntity> builder)
        {
            builder.HasData(
                new PriorityEntity
                {
                    Id = 1,
                    Name = "Bajo",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new PriorityEntity
                {
                    Id = 2,
                    Name = "Medio",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new PriorityEntity
                {
                    Id = 3,
                    Name = "Alto",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new PriorityEntity
                {
                    Id = 4,
                    Name = "Urgente",
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                }
            );
        }
    }
}