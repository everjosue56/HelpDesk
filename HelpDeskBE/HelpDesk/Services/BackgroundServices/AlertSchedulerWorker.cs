using HelpDesk.Database;
using HelpDesk.Services.AlertConfigurationService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace HelpDesk.BackgroundServices
{
    public class AlertSchedulerWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1); // Revisa la DB cada 1 minuto

        public AlertSchedulerWorker(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                        var alertConfigService = scope.ServiceProvider.GetRequiredService<IAlertConfigurationService>();

                        var now = DateTime.Now;

                        // Buscamos alertas programadas cuya fecha ya llegó o pasó, estén activas y NO hayan sido ejecutadas aún
                        // Para saber si ya se ejecutó, verificamos si NO existe en la tabla de históricos de alertas
                        var pendingAlerts = await context.AlertConfigurations
                            .Where(ac => ac.IsActive
                                       && ac.ScheduledDate.HasValue
                                      && ac.ScheduledDate.Value <= now
                                      && !context.AlertHistories.Any(ah => ah.IdAlertConfiguration == ac.Id))
                            .ToListAsync(stoppingToken);

                        foreach (var alert in pendingAlerts)
                        {
                            // Dispararla automáticamente
                            await alertConfigService.ExecuteAlertAsync(alert.Id);
                        }
                    }
                }
                catch (Exception)
                {
                    Console.WriteLine($"[AlertSchedulerWorker] Error:  ");
        
                }

                // Espera 1 minuto antes de la siguiente revisión
                await Task.Delay(_checkInterval, stoppingToken);
            }
        }
    }
}