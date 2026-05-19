using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class AgencySeeder : IEntityTypeConfiguration<AgencyEntity>
    {
        public void Configure(EntityTypeBuilder<AgencyEntity> builder)
        {
            builder.HasData(
                new AgencyEntity
                {
                    Id = 1,
                    Name = "Sede Principal - Santa Rosa",
                    Address = "Barrio El Centro, Santa Rosa de Copán",
                    PhoneNumber = "50426620000",
                    Email = "src@codimersa.com",
                    IdOrganization = 1, 
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 11),
                    CreatedBy = 1
                },
                new AgencyEntity
                {
                    Id = 2,
                    Name = "Sucursal San Pedro Sula",
                    Address = "Barrio Guamilito, SPS",
                    PhoneNumber = "50425500000",
                    Email = "sps@codimersa.com",
                    IdOrganization = 1, 
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 11),
                    CreatedBy = 1
                },
                new AgencyEntity
                {
                    Id = 3,
                    Name = "Oficina Desarrollo",
                    Address = "Edificio 4",
                    PhoneNumber = "50499999999",
                    Email = "dev@example.com",
                    IdOrganization = 2, 
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 11),
                    CreatedBy = 1
                }
            );
        }
    }
}