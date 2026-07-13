using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class TypeDeviceSeeder : IEntityTypeConfiguration<TypeDeviceEntity>
    {
        public void Configure(EntityTypeBuilder<TypeDeviceEntity> builder)
        {
            builder.HasData(
                new TypeDeviceEntity
                {
                    Id = 1,
                    Name = "Desktop - example",
                    Description = "Computadoras de escritorio de oficina o laboratorios.",
                    CreatedDate = new DateTime(2026, 5, 15),
                    CreatedBy = 1
                },
                new TypeDeviceEntity
                {
                    Id = 2,
                    Name = "Laptop  - example",
                    Description = "Equipos portátiles asignados a personal administrativo o docentes.",
                    CreatedDate = new DateTime(2026, 5, 15),
                    CreatedBy = 1
                },
                new TypeDeviceEntity
                {
                    Id = 3,
                    Name = "Servidor  - example",
                    Description = "Equipos de alto rendimiento para alojamiento de sistemas y bases de datos.",
                    CreatedDate = new DateTime(2026, 5, 15),
                    CreatedBy = 1
                },
                new TypeDeviceEntity
                {
                    Id = 4,
                    Name = "Impresora / Multifuncional  - example",
                    Description = "Dispositivos de impresión, escaneo y fotocopiado.",
                    CreatedDate = new DateTime(2026, 5, 15),
                    CreatedBy = 1
                },
                new TypeDeviceEntity
                {
                    Id = 5,
                    Name = "Equipo de Red  - example",
                    Description = "Routers, Switches, Access Points y otros dispositivos de conectividad.",
                    CreatedDate = new DateTime(2026, 5, 15),
                    CreatedBy = 1
                }
            );
        }
    }
}