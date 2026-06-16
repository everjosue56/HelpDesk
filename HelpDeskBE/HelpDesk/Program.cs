using HelpDesk.BackgroundServices;
using HelpDesk.Config;
using HelpDesk.Database;
using HelpDesk.Herlpers;
using HelpDesk.Services;
using HelpDesk.Services.AgencyService;
using HelpDesk.Services.AlertConfigurationService;
using HelpDesk.Services.AlertHistoryService;
using HelpDesk.Services.AlertHistoryServices;
using HelpDesk.Services.AlertTypeService;
using HelpDesk.Services.AlertTypeServices;
using HelpDesk.Services.AreaServices;
using HelpDesk.Services.AuditService;
using HelpDesk.Services.AuditServices;
using HelpDesk.Services.AuthService;
using HelpDesk.Services.Common;
using HelpDesk.Services.DashboardServices;
using HelpDesk.Services.DeviceService;
using HelpDesk.Services.DeviceServices;
using HelpDesk.Services.EmailService;
using HelpDesk.Services.ImpactServices;
using HelpDesk.Services.MaintenanceHistoryService;
using HelpDesk.Services.MaintenanceService;
using HelpDesk.Services.MaintenancesHistoryService;
using HelpDesk.Services.NotificationHistoryService;
using HelpDesk.Services.NotificationService;
using HelpDesk.Services.NotificationServices;
using HelpDesk.Services.Organizations;
using HelpDesk.Services.PriorityServices;
using HelpDesk.Services.ResolutionService;
using HelpDesk.Services.RolServices;
using HelpDesk.Services.SoftwareSystemServices;
using HelpDesk.Services.SolutionStateServices;
using HelpDesk.Services.TicketHistoryService;
using HelpDesk.Services.TicketHistoryServices;
using HelpDesk.Services.TicketService;
using HelpDesk.Services.TypeDeviceService;
using HelpDesk.Services.TypeDeviceServices;
using HelpDesk.Services.TypeError;
using HelpDesk.Services.TypeMaintenanceService;
using HelpDesk.Services.TypeMaintenanceServices;
using HelpDesk.Services.UserServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. SERVICIOS DEL CONTENEDOR (Inyección de Dependencias)
builder.Services.AddControllers();

// Configuración de SQL Server
// 'DefaultConnection' debe estar definido en tu appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configuración de OpenAPI / Swagger
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

// Servicios de la aplicacion (Inyeccion de dependencias)
builder.Services.AddScoped<IOrganizationService, OrganizationService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRolService, RolService>();
builder.Services.AddScoped<IAgencyService, AgencyService>();
builder.Services.AddScoped<IAreaService, AreaService>();
builder.Services.AddScoped<ITypeErrorService, TypeErrorService>();
builder.Services.AddScoped<IImpactService, ImpactService>();
builder.Services.AddScoped<ISoftwareSystemService, SoftwareSystemService>();
builder.Services.AddScoped<IPriorityService, PriorityService>();
builder.Services.AddScoped<ITicketService, TicketServices>();
builder.Services.AddScoped<ISolutionStateService, SolutionStateService>();
builder.Services.AddScoped<IResolutionService, ResolutionServices>();
builder.Services.AddScoped<ITicketHistoryService, TicketHistoryService>();
builder.Services.AddScoped<ITypeMaintenanceService, TypeMaintenanceService>();
builder.Services.AddScoped<ITypeDevicesService, TypeDeviceService>();
builder.Services.AddScoped<IDeviceService, DeviceService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IMaintenanceService, MaintenanceService>();
builder.Services.AddScoped<IMaintenancesHistoryService, MaintenanceHistoryService>();
builder.Services.AddScoped<IAlertTypeService, AlertTypeService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IAlertConfigurationService,  AlertConfigurationService>();
builder.Services.AddScoped<INotificationHistoryService, NotificationHistoryService>();
builder.Services.AddScoped<IAlertHistoryService, AlertHistoryService>();
builder.Services.AddHostedService<AlertSchedulerWorker>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IAuditService, AuditService>();
// Inyeccion de email 
// Mapear la sección del appsettings.json a la clase EmailSettings
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddTransient<IEmailService, EmailService>();

//Configuracion de Automapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
builder.Services.AddSwaggerGen(c =>
{
    // Usamos el nombre completo para evitar el error del using
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "HelpDesk API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando el esquema Bearer.",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("HelpDeskCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddHttpContextAccessor();

// CONFIGURAR EL ESQUEMA DE AUTENTICACIÓN
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
            .GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value!)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero 
    };
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{     
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "HelpDesk API V1");
    });
}

app.UseHttpsRedirection();

app.UseCors("HelpDeskCorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();