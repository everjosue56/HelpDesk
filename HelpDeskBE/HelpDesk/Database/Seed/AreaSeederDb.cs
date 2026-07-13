using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class AreaSeeder : IEntityTypeConfiguration<AreaEntity>
    {
        public void Configure(EntityTypeBuilder<AreaEntity> builder)
        {
            builder.HasData(
                new AreaEntity
                {
                    Id = 1,
                    NameArea = "Sistemas / IT - Example ",
                    IdAgency = 1,
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 12),
                    CreatedBy = 1
                },
                new AreaEntity
                {
                    Id = 2,
                    NameArea = "Contabilidad y Finanzas - Example",
                    IdAgency = 1,
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 12),
                    CreatedBy = 1
                },
                new AreaEntity
                {
                    Id = 3,
                    NameArea = "Atención al Cliente - Example",
                    IdAgency = 1,
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 12),
                    CreatedBy = 1
                },

                new AreaEntity
                {
                    Id = 4,
                    NameArea = "Ventas y Mercadeo - Example",
                    IdAgency = 2,
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 12),
                    CreatedBy = 1
                },
                new AreaEntity
                {
                    Id = 5,
                    NameArea = "Logística y Bodega - Example",
                    IdAgency = 2,
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 12),
                    CreatedBy = 1
                }
            );
        }
    }
}