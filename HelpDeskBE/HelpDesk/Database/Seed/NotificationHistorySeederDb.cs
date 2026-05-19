using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class NotificationHistorySeeder : IEntityTypeConfiguration<NotificationHistoryEntity>
    {
        public void Configure(EntityTypeBuilder<NotificationHistoryEntity> builder)
        {
            builder.HasData(
                new NotificationHistoryEntity
                {
                    Id = 1,
                    IdNotification = 1, 
                    ActionDate = new DateTime(2026, 5, 18, 9, 0, 5), 
                    CreatedDate = new DateTime(2026, 5, 18),
                    CreatedBy = 1,
                },
                new NotificationHistoryEntity
                {
                    Id = 2,
                    IdNotification = 2, 
                    ActionDate = new DateTime(2026, 5, 18, 14, 30, 12),
                    CreatedDate = new DateTime(2026, 5, 18),
                    CreatedBy = 1,
                }
            );
        }
    }
}