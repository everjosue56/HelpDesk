using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class AlertConfigurationSeeder : IEntityTypeConfiguration<AlertConfigurationEntity>
    {
        public void Configure(EntityTypeBuilder<AlertConfigurationEntity> builder)
        {
            builder.HasData(
                new AlertConfigurationEntity
                {
                    Id = 1,
                    Title = "Caída General de Servidores",
                    Subject = "[CRÍTICO] Interrupción de Servicios de Red",
                    Description = "Se ha detectado una pérdida de conectividad global en los servidores principales de la UNAH-CUROC. Equipo de TI favor verificar infraestructura.",
                    IsGlobal = true,
                    IdArea = null,
                    IdAgency = null,
                    ScheduledDate = null,
                    CreatedDate = new DateTime(2026, 5, 18),
                    CreatedBy = 1
                },
                new AlertConfigurationEntity
                {
                    Id = 2,
                    Title = "Mantenimiento Preventivo Trimestral",
                    Subject = "Recordatorio: Inicio de Mantenimiento de Equipos de Cómputo",
                    Description = "Estimado equipo, se les recuerda que según el calendario establecido se debe dar inicio al mantenimiento preventivo de los laboratorios asignados.",
                    IsGlobal = false,
                    IdArea = 1, 
                    IdAgency = null,
                    ScheduledDate = new DateTime(2026, 6, 1, 8, 0, 0),  
                    CreatedDate = new DateTime(2026, 5, 18),
                    CreatedBy = 1
                }
            );
        }
    }
}