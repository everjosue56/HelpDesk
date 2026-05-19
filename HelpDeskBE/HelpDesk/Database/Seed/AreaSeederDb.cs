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
                // --- Áreas para CODIMERSA - Sede Principal (IdAgency = 1) ---
                new AreaEntity
                {
                    Id = 1,
                    NameArea = "Sistemas / IT",
                    IdAgency = 1,
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 12),
                    CreatedBy = 1
                },
                new AreaEntity
                {
                    Id = 2,
                    NameArea = "Contabilidad y Finanzas",
                    IdAgency = 1,
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 12),
                    CreatedBy = 1
                },
                new AreaEntity
                {
                    Id = 3,
                    NameArea = "Atención al Cliente",
                    IdAgency = 1,
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 12),
                    CreatedBy = 1
                },

                // --- Áreas para CODIMERSA - Sucursal SPS (IdAgency = 2) ---
                new AreaEntity
                {
                    Id = 4,
                    NameArea = "Ventas y Mercadeo",
                    IdAgency = 2,
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 12),
                    CreatedBy = 1
                },
                new AreaEntity
                {
                    Id = 5,
                    NameArea = "Logística y Bodega",
                    IdAgency = 2,
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 12),
                    CreatedBy = 1
                }
            );
        }
    }
}