using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class TicketHistorySeeder : IEntityTypeConfiguration<TicketHistoryEntity>
    {
        public void Configure(EntityTypeBuilder<TicketHistoryEntity> builder)
        {
            builder.HasData(
                new TicketHistoryEntity
                {
                    Id = 1,
                    IdTicket = 1,      
                    IdResolution = 1,  
                    IdUser = 1,       
                    CloseDate = new DateTime(2026, 5, 14, 11, 0, 0),
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                },
                new TicketHistoryEntity
                {
                    Id = 2,
                    IdTicket = 2,     
                    IdResolution = 2,  
                    IdUser = 1,
                    CloseDate = new DateTime(2026, 5, 14, 16, 30, 0),
                    CreatedDate = new DateTime(2026, 5, 14),
                    CreatedBy = 1
                }
            );
        }
    }
}