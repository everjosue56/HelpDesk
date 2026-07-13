using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class TicketSeeder : IEntityTypeConfiguration<TicketEntity>
    {
        public void Configure(EntityTypeBuilder<TicketEntity> builder)
        {
            builder.HasData(
                new TicketEntity
                {
                    Id = 1,
                    Description = "Error al intentar referenciar un paciente en el módulo de emergencias - example.",
                    ReportDate = new DateTime(2026, 5, 10, 8, 30, 0),
                    IdUser = 1,
                    IdTypeError = 1, 
                    IdArea = 1,
                    IdSoftwareSystem = 1, 
                    IdImpact = 3, 
                    IdPriority = 1, 
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 10),
                    CreatedBy = 1
                },
                new TicketEntity
                {
                    Id = 2,
                    Description = "No se cargan las citas disponibles para el mes de junio en la vista de calendario - example.",
                    ReportDate = new DateTime(2026, 5, 12, 14, 15, 0),
                    IdUser = 1,
                    IdTypeError = 4, 
                    IdArea = 1,
                    IdSoftwareSystem = 2, 
                    IdImpact = 2, 
                    IdPriority = 2, 
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 12),
                    CreatedBy = 1
                }
            );
        }
    }
}