using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelpDesk.Database.Seed
{
    public class SupplierSeederDb : IEntityTypeConfiguration<SupplierEntity>
    {
        public void Configure(EntityTypeBuilder<SupplierEntity> builder)
        {
            builder.HasData(
                new SupplierEntity
                {
                    Id = 1,
                    IdOrganization = 1,
                    Name = "Tigo - Example",
                    Description = "Empresa de red",
                    Contact = "Manuel",
                    Email = "Manuel@me.com",
                    Phone = "9032-4353",
                    RegistrationDate = new System.DateTime(2026, 8, 26),
                    Address = "Ave 12 calle real numero 10",
                    Compliance = true,
                    IsActive = true,
                    CreatedDate = new System.DateTime(2026, 8, 26),
                    CreatedBy = 1
                }
              
            );
        }
    }
}
