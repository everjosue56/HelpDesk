using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class RolSeeder : IEntityTypeConfiguration<RolEntity>
    {
        public void Configure(EntityTypeBuilder<RolEntity> builder)
        {
            builder.HasData(
                new RolEntity
                {
                    Id = 1,
                    Name = "Administrador",
                    CreatedDate = new DateTime(2026, 5, 11),
                    CreatedBy = 1 
                },
                new RolEntity
                {
                    Id = 2,
                    Name = "TI",
                    CreatedDate = new DateTime(2026, 5, 11),
                    CreatedBy = 1
                },
                new RolEntity
                {
                    Id = 3,
                    Name = "Cliente",
                    CreatedDate = new DateTime(2026, 5, 11),
                    CreatedBy = 1
                }
         
            );
        }
    }
}