using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Security.Cryptography;
using System.Text;

namespace HelpDesk.Database.Seed
{
    public class UserSeeder : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            byte[] hash;
            byte[] salt;

   
            byte[] seedKey = Encoding.UTF8.GetBytes("HelpDeskStaticSeedKeyForAdmin1234.");

            using (var hmac = new HMACSHA512(seedKey))
            {
                salt = hmac.Key;
                hash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Admin1234."));
            }

            builder.HasData(
                new UserEntity
                {
                    Id = 1,
                    FirstName = "Example",
                    LastName = "Example",
                    UserName = "admin",
                    Email = "admin@me.com",
                    PasswordHash = hash,
                    PasswordSalt = salt,
                    PhoneNumber = "50400000000",
                    IdRol = 1, // Administrador
                    IdAgency = 1,
                    IdArea = 1,
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 5, 11),
                    CreatedBy = 1
                }
            );
        }
    }
}