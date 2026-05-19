namespace HelpDesk.Dtos.UsersDto
{
    public class UserResponseDto
    {
        public long Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public string AgencyName { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty; 
        public string Token { get; set; } = string.Empty;
        public string AreaName { get; set; } = string.Empty;
    }
}
