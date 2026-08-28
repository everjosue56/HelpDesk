using System;
using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelpDesk.Database.Seed
{
    public class SupplierMeetingSeederDb : IEntityTypeConfiguration<SupplierMeetingEntity>
    {
        public void Configure(EntityTypeBuilder<SupplierMeetingEntity> builder)
        {
            builder.HasData(
                new SupplierMeetingEntity
                {
                    Id = 1,
                    IdSupplier = 1,  
                    Description = "Empresa de red",
                    ReasonWork = "Nuevas Actualizacones en el sistema.",
                    Evidence = "PDF",
                    MeetingDate = new DateTime(2026, 8, 26),
                    CreatedDate = new DateTime(2026, 8, 26),
                    CreatedBy = 1,
                    IsDeleted = false  
                }
            );
        }
    }
}
