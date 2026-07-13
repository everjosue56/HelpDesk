using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class NotificationSeeder : IEntityTypeConfiguration<NotificationEntity>
    {
        public void Configure(EntityTypeBuilder<NotificationEntity> builder)
        {
            builder.HasData(
                new NotificationEntity
                {
                    Id = 1,
                    IdUser = 1,         
                    IdAlertType = 1,     
                    TextMessage = "Se te ha asignado el Ticket #101: Fallo de red en el Laboratorio de Cómputo - example.",
                    IsRead = false,
                    SentAt = null,       
                    IdReference = 101,   
                    CreatedDate = new DateTime(2026, 5, 18, 9, 0, 0),
                    CreatedBy = 1,
               
                },
                new NotificationEntity
                {
                    Id = 2,
                    IdUser = 1,
                    IdAlertType = 2,   
                    TextMessage = "El mantenimiento preventivo de la Laptop Dell (Id: 1) ha sido completado con éxito - example.",
                    IsRead = true,
                    SentAt = new DateTime(2026, 5, 18, 14, 35, 0),
                    IdReference = 1,    
                    CreatedDate = new DateTime(2026, 5, 18, 14, 30, 0),
                    CreatedBy = 1,
              
                }
            );
        }
    }
}