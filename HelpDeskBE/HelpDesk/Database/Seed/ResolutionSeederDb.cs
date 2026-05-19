using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class ResolutionSeeder : IEntityTypeConfiguration<ResolutionEntity>
    {
        public void Configure(EntityTypeBuilder<ResolutionEntity> builder)
        {
            builder.HasData(
                new ResolutionEntity
                {
                    Id = 1,
                    IdTicket = 1, 
                    IdPriority = 1, 
                    ActionTaken = "Se depuró el procedimiento almacenado y se actualizaron los permisos de la base de datos.",
                    IdSolutionStatus = 1, 
                    ResolutionDate = new DateTime(2026, 5, 14, 10, 0, 0),
                    SolutionTime = 1.5m, 
                    RootCause = "Conflicto de concurrencia en la tabla de referencias médicas.",
                    PreventiveMeasures = "Implementar logs de auditoría para transacciones fallidas.",
                    Observation = "El sistema quedó operativo inmediatamente.",
                    SecondObservation = "Se notificó al jefe de área.",
                    IdUser = 1, 
                    IdDevice = 1, 
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new ResolutionEntity
                {
                    Id = 2,
                    IdTicket = 2, 
                    IdPriority = 2,
                    ActionTaken = "Se reinició el pool de aplicaciones en IIS y se limpió el caché del servidor.",
                    IdSolutionStatus = 1,
                    ResolutionDate = new DateTime(2026, 5, 14, 15, 45, 0),
                    SolutionTime = 0.75m, 
                    RootCause = "Saturación de memoria en el servidor de pruebas.",
                    PreventiveMeasures = "Programar reinicio automático de servicios los domingos.",
                    Observation = "Pruebas de carga exitosas después del reinicio.",
                    SecondObservation = string.Empty,
                    IdUser = 1,
                    IdDevice = 1,
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                }
            );
        }
    }
}