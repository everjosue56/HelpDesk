using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class AlertHistorySeeder : IEntityTypeConfiguration<AlertHistoryEntity>
    {
        public void Configure(EntityTypeBuilder<AlertHistoryEntity> builder)
        {
            builder.HasData(
                new AlertHistoryEntity
                {
                    Id = 1,
                    IdAlertConfiguration = 1, 
                    IdUser = 1,               
                    ActionDate = new DateTime(2026, 5, 18, 10, 15, 0),
                    CreatedDate = new DateTime(2026, 5, 18),
                    CreatedBy = 1,
                },
                new AlertHistoryEntity
                {
                    Id = 2,
                    IdAlertConfiguration = 2,
                    IdUser = 1,
                    ActionDate = new DateTime(2026, 5, 18, 16, 45, 22),
                    CreatedDate = new DateTime(2026, 5, 18),
                    CreatedBy = 1,
                }
            );
        }
    }
}