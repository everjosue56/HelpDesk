using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class DeviceSeeder : IEntityTypeConfiguration<DeviceEntity>
    {
        public void Configure(EntityTypeBuilder<DeviceEntity> builder)
        {
            builder.HasData(
                new DeviceEntity
                {
                    Id = 1,
                    Quantity = 1,
                    BrandName = "Dell Latitude 3420",
                    Code = "UNAH-001",
                    IdDeviceType = 2, 
                    IdUser = 1,      
                    IdArea = 1,      
                    Observation = "Equipo nuevo asignado para desarrollo.",
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 15),
                    CreatedBy = 1
                },
                new DeviceEntity
                {
                    Id = 2,
                    Quantity = 1,
                    BrandName = "HP ProLiant DL380",
                    Code = "SR-SERVER-01",
                    IdDeviceType = 3, 
                    IdUser = 1,
                    IdArea = 1,
                    Observation = "Servidor principal de base de datos local.",
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 15),
                    CreatedBy = 1
                },
                new DeviceEntity
                {
                    Id = 3,
                    Quantity = 25,
                    BrandName = "Logitech M170",
                    Code = "ACC-GEN-01",
                    IdDeviceType = 1, 
                    IdUser = 1,
                    IdArea = 2,       
                    Observation = "Lote de mouses para laboratorio.",
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 15),
                    CreatedBy = 1
                }
            );
        }
    }
}