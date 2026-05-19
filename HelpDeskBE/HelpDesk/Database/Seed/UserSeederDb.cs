using HelpDesk.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace HelpDesk.Database.Seed
{
    public class UserSeeder : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            // Hash y Salt pre-generados para "Admin1234."
            byte[] hash = { 108, 107, 24, 155, 143, 101, 154, 137, 230, 203, 19, 110, 18, 159, 172, 237, 34, 181, 151, 169, 134, 155, 115, 20, 255, 106, 12, 191, 153, 31, 124, 60, 251, 25, 226, 182, 150, 48, 202, 202, 219, 109, 219, 165, 182, 121, 118, 132, 119, 173, 219, 39, 186, 68, 107, 33, 217, 109, 172, 150, 202, 124, 49, 142 };
            byte[] salt = { 203, 205, 144, 230, 154, 213, 246, 21, 38, 184, 187, 33, 143, 214, 111, 244, 117, 135, 23, 159, 18, 11, 122, 125, 193, 191, 161, 39, 232, 164, 47, 57, 184, 111, 219, 121, 38, 109, 45, 170, 4, 18, 111, 110, 148, 175, 104, 112, 231, 187, 225, 47, 117, 206, 225, 121, 176, 254, 30, 232, 85, 227, 242, 154, 144, 17, 158, 238, 206, 44, 132, 248, 201, 8, 162, 53, 58, 124, 150, 177, 114, 174, 162, 70, 4, 243, 157, 85, 255, 192, 175, 30, 15, 230, 164, 199, 123, 121, 60, 20, 41, 253, 110, 135, 144, 223, 22, 144, 100, 39, 87, 113, 246, 8, 172, 33, 142, 157, 144, 18, 38, 226, 178, 254, 162, 101, 116, 233 };

            builder.HasData(
                new UserEntity
                {
                    Id = 1,
                    FirstName = "Ever",
                    LastName = "Garcia",
                    UserName = "admin",
                    Email = "admin@systemdeluxe.com",
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