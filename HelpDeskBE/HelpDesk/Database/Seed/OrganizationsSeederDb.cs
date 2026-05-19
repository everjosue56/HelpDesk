using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class OrganizationSeeder : IEntityTypeConfiguration<OrganizationEntity>
    {
        public void Configure(EntityTypeBuilder<OrganizationEntity> builder)
        {
            builder.HasData(
                new OrganizationEntity
                {
                    Id = 1,
                    Name = "CODIMERSA",
                    Address = "Santa Rosa de Copán",
                    PhoneNumber = "50426620000",
                    Logo = "codimersa_logo.png",
                    Description = "Sede Principal",
                    CreatedDate = new DateTime(2026, 5, 8),
                    CreatedBy = 1
                },
                new OrganizationEntity
                {
                    Id = 2,
                    Name = "CODIMERSA",
                    Address = "Honduras",
                    PhoneNumber = "50499999999",
                    Logo = "codimersa_logo.png",
                    Description = "Servicios de Software",
                    CreatedDate = new DateTime(2026, 5, 8),
                    CreatedBy = 1
                }
            );
        }
    }
}