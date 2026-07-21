using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelpDesk.Database.Seed
{
    public class MaintenanceFrequencySeederDb : IEntityTypeConfiguration<MaintenanceFrequencyEntity>
    {
        public void Configure(EntityTypeBuilder<MaintenanceFrequencyEntity> builder) 
        {
            builder.HasData(
                new MaintenanceFrequencyEntity
                {
                    Id = 1,
                    Name = "Mensual",
                    DaysInterval = 30
                },
                new MaintenanceFrequencyEntity
                {
                    Id = 2,
                    Name = "Trimestral",
                    DaysInterval = 90
                },
                new MaintenanceFrequencyEntity
                {
                    Id = 3,
                    Name = "Semestral",
                    DaysInterval = 180
                },
                new MaintenanceFrequencyEntity
                {
                    Id = 4,
                    Name = "Anual",
                    DaysInterval = 365
                }
                );
        }
    }
}
