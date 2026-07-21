using System;

namespace HelpDesk.Helpers
{
    public static class EmailTemplates
    {
        // Plantilla para Apertura de Ticket (Cliente / Técnicos)
        public static string GetTicketCreationTemplate(string userName, long ticketId, string area, string system, string priority, string description)
        {
            return $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;'>
                <div style='background-color: #1e3a8a; padding: 20px; text-align: center;'>
                    <h1 style='color: #ffffff; margin: 0; font-size: 24px;'>Financiera Codimersa HelpDesk</h1>
                    <p style='color: #93c5fd; margin: 5px 0 0 0;'>Notificación de Soporte Técnico</p>
                </div>
                <div style='padding: 20px; background-color: #ffffff;'>
                    <h2 style='color: #333333; margin-top: 0;'>¡Ticket Registrado con Éxito!</h2>
                    <p style='color: #555555; line-height: 1.6;'>Hola <strong>{userName}</strong>, se ha generado un nuevo ticket de soporte en la plataforma para <strong>Financiera Codimersa</strong>.</p>
                    
                    <div style='background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;'>
                        <table style='width: 100%; border-collapse: collapse;'>
                            <tr>
                                <td style='padding: 5px 0; color: #6b7280; font-weight: bold;'>Número de Ticket:</td>
                                <td style='padding: 5px 0; color: #111827;'>#{ticketId}</td>
                            </tr>
                            <tr>
                                <td style='padding: 5px 0; color: #6b7280; font-weight: bold;'>Área / Departamento:</td>
                                <td style='padding: 5px 0; color: #111827;'>{area}</td>
                            </tr>
                            <tr>
                                <td style='padding: 5px 0; color: #6b7280; font-weight: bold;'>Sistema Afectado:</td>
                                <td style='padding: 5px 0; color: #111827;'>{system}</td>
                            </tr>
                            <tr>
                                <td style='padding: 5px 0; color: #6b7280; font-weight: bold;'>Prioridad Asignada:</td>
                                <td style='padding: 5px 0; color: #111827;'><span style='background-color: #fef3c7; color: #d97706; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;'>{priority}</span></td>
                            </tr>
                        </table>
                    </div>

                    <h3 style='color: #333333; margin-bottom: 5px;'>Descripción del Problema:</h3>
                    <p style='background-color: #fafafa; padding: 12px; border-left: 4px solid #1e3a8a; color: #4b5563; margin: 0; font-style: italic;'>""{description}""</p>
                    
                    <p style='color: #555555; line-height: 1.6; margin-top: 25px;'>El equipo de ingenieros de TI ya ha sido notificado y comenzará a evaluar la incidencia a la brevedad posible.</p>
                </div>
                <div style='background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;'>
                    <p style='color: #9ca3af; font-size: 12px; margin: 0;'>Este es un correo automático, por favor no responder directamente a este mensaje.</p>
                    <p style='color: #1e3a8a; font-size: 12px; font-weight: bold; margin: 5px 0 0 0;'>HelpDesk — Automatización Operativa de TI</p>
                </div>
            </div>";
        }

        //plantilla para TI cuando se genera un nuevo ticket en el sistema

        public static string GetTiNotificationTemplate(string clientName, long ticketId, string area, string system, string priority, string description)
        {
            return $@"
    <div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;'>
        <div style='background-color: #1e5f8a; padding: 20px; text-align: center;'>
            <h2 style='color: #ffffff; margin: 0;'>⚠️ Nueva Incidencia Reportada</h2>
        </div>
        <div style='padding: 20px; background-color: #f8f9fa;'>
            <p style='font-size: 16px;'>Hola, equipo de Soporte TI,</p>
            <p>Se ha registrado un nuevo ticket en la plataforma que requiere atención. Aquí están los detalles:</p>
            
            <div style='background-color: #ffffff; padding: 15px; border-radius: 6px; border-left: 4px solid #1e5f8a; margin: 20px 0;'>
                <p style='margin: 5px 0;'><strong>Ticket No:</strong> #{ticketId}</p>
                <p style='margin: 5px 0;'><strong>Reportado por:</strong> {clientName}</p>
                <p style='margin: 5px 0;'><strong>Área:</strong> {area}</p>
                <p style='margin: 5px 0;'><strong>Sistema:</strong> {system}</p>
                <p style='margin: 5px 0;'><strong>Prioridad:</strong> <span style='color: #e74c3c;'>{priority}</span></p>
                <p style='margin: 10px 0 5px 0;'><strong>Descripción del problema:</strong></p>
                <p style='margin: 0; color: #555; font-style: italic;'>{description}</p>
            </div>

            <div style='text-align: center; margin-top: 30px;'>
                <a href='http://servidor-local/dashboard/tickets' style='background-color: #1e5f8a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;'>
                    Ir al Dashboard para Resolver
                </a>
            </div>
        </div>
    </div>";
        }

        // 2. Plantilla para Resolución de Ticket (TI hacia el Cliente)
        public static string GetTicketResolutionTemplate(string userName, long ticketId, string technicianName, string diagnosis, string solutionDescription)
        {
            return $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;'>
                <div style='background-color: #10b981; padding: 20px; text-align: center;'>
                    <h1 style='color: #ffffff; margin: 0; font-size: 24px;'>Financiera Codimersa HelpDesk</h1>
                    <p style='color: #d1fae5; margin: 5px 0 0 0;'>Incidencia Resuelta Exitosamente</p>
                </div>
                <div style='padding: 20px; background-color: #ffffff;'>
                    <h2 style='color: #333333; margin-top: 0;'>¡Tu caso ha sido cerrado!</h2>
                    <p style='color: #555555; line-height: 1.6;'>Hola <strong>{userName}</strong>, te informamos que el ticket de soporte <strong>#{ticketId}</strong> ha sido resuelto por nuestro departamento de TI.</p>
                    
                    <div style='background-color: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #bbf7d0;'>
                        <p style='margin: 0 0 8px 0; color: #166534;'><strong>Técnico Asignado:</strong> {technicianName}</p>
                        <hr style='border: 0; border-top: 1px solid #bbf7d0; margin: 10px 0;' />
                        
                        <h4 style='margin: 0 0 5px 0; color: #166534;'>🔬 Diagnóstico Técnico:</h4>
                        <p style='margin: 0 0 15px 0; color: #4b5563; font-size: 14px;'>{diagnosis}</p>
                        
                        <h4 style='margin: 0 0 5px 0; color: #166534;'>🛠️ Solución Aplicada:</h4>
                        <p style='margin: 0; color: #4b5563; font-size: 14px;'>{solutionDescription}</p>
                    </div>

                    <p style='color: #555555; line-height: 1.6;'>Agradecemos tu paciencia durante el proceso. Si el inconveniente persiste o necesitas asistencia adicional, puedes abrir un nuevo reporte en la plataforma.</p>
                </div>
                <div style='background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;'>
                    <p style='color: #9ca3af; font-size: 12px; margin: 0;'>Soporte Técnico Financiera Codimersa</p>
                    <p style='color: #10b981; font-size: 12px; font-weight: bold; margin: 5px 0 0 0;'>Powered by TI</p>
                </div>
            </div>";
        }

        // 3. plantilla para configuracion de alertas (TI hacia Clientes)
        public static string GetAlertConfigurationTemplate(string title, string subject, string description, string scope)
        {
                    return $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;'>
                <div style='background-color: #dc2626; padding: 20px; text-align: center;'>
                    <h1 style='color: #ffffff; margin: 0; font-size: 24px;'>HelpDesk - Notificación </h1>
                    <p style='color: #fca5a5; margin: 5px 0 0 0;'>Alerta de Infraestructura y Soporte</p>
                </div>
                <div style='padding: 20px; background-color: #ffffff;'>
                    <h2 style='color: #111827; margin-top: 0;'>{title}</h2>
                    <p style='color: #374151; font-weight: bold; font-size: 16px; margin-bottom: 10px;'>Asunto: {subject}</p>
            
                    <div style='background-color: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; color: #991b1b; margin: 15px 0; border-radius: 0 6px 6px 0;'>
                        <strong>Detalle de la Alerta:</strong><br/>
                        <p style='color: #4b5563; margin: 5px 0 0 0; line-height: 1.6; font-style: italic;'>""{description}""</p>
                    </div>

                    <div style='margin-top: 20px; font-size: 13px; color: #6b7280;'>
                        <p style='margin: 4px 0;'><strong>Alcance del Mensaje:</strong> {scope}</p>
                        <p style='margin: 4px 0;'><strong>Fecha de Emisión:</strong> {DateTime.Now:dd/MM/yyyy hh:mm tt}</p>
                    </div>

                    <p style='color: #4b5563; line-height: 1.6; margin-top: 25px;'>Por favor, tome las medidas necesarias correspondientes a su área de trabajo en Financiera Codimersa.</p>
                </div>
                <div style='background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;'>
                    <p style='color: #9ca3af; font-size: 12px; margin: 0;'>Este es un aviso automatizado del departamento de TI.</p>
                    <p style='color: #dc2626; font-size: 12px; font-weight: bold; margin: 5px 0 0 0;'>Powered by TI</p>
                </div>
            </div>";
        }

        // 4. Plantilla para Mantenimiento Preventivo Programado (TI)
        public static string GetMaintenanceScheduledTemplate(long maintenanceId, string deviceName, string area, string frequency, string scheduledDate, string executionTime, string details)
        {
            return $@"
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;'>
        <div style='background-color: #2563eb; padding: 20px; text-align: center;'>
            <h1 style='color: #ffffff; margin: 0; font-size: 24px;'>Financiera Codimersa HelpDesk</h1>
            <p style='color: #bfdbfe; margin: 5px 0 0 0;'>Mantenimiento Preventivo Programado</p>
        </div>
        <div style='padding: 20px; background-color: #ffffff;'>
            <h2 style='color: #333333; margin-top: 0;'>🔧 Registro de Mantenimiento</h2>
            <p style='color: #555555; line-height: 1.6;'>Se ha programado una nueva intervención preventiva en la plataforma para <strong>Financiera Codimersa</strong>.</p>
            
            <div style='background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2563eb;'>
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr>
                        <td style='padding: 5px 0; color: #64748b; font-weight: bold;'>Código Mantenimiento:</td>
                        <td style='padding: 5px 0; color: #0f172a;'>#{maintenanceId}</td>
                    </tr>
                    <tr>
                        <td style='padding: 5px 0; color: #64748b; font-weight: bold;'>Equipo / Dispositivo:</td>
                        <td style='padding: 5px 0; color: #0f172a;'><strong>{deviceName}</strong></td>
                    </tr>
                    <tr>
                        <td style='padding: 5px 0; color: #64748b; font-weight: bold;'>Área / Ubicación:</td>
                        <td style='padding: 5px 0; color: #0f172a;'>{area}</td>
                    </tr>
                    <tr>
                        <td style='padding: 5px 0; color: #64748b; font-weight: bold;'>Frecuencia:</td>
                        <td style='padding: 5px 0; color: #0f172a;'><span style='background-color: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;'>{frequency}</span></td>
                    </tr>
                    <tr>
                        <td style='padding: 5px 0; color: #64748b; font-weight: bold;'>Fecha Programada:</td>
                        <td style='padding: 5px 0; color: #0f172a; font-weight: bold;'>{scheduledDate}</td>
                    </tr>
                    <tr>
                        <td style='padding: 5px 0; color: #64748b; font-weight: bold;'>Tiempo Estimado:</td>
                        <td style='padding: 5px 0; color: #0f172a;'>{executionTime} hrs</td>
                    </tr>
                </table>
            </div>

            <h3 style='color: #333333; margin-bottom: 5px;'>Detalles de la Intervención:</h3>
            <p style='background-color: #fafafa; padding: 12px; border-left: 4px solid #64748b; color: #475569; margin: 0; font-style: italic;'>""{details}""</p>
            
            <p style='color: #555555; line-height: 1.6; margin-top: 25px;'>El departamento de TI coordinará el acceso al equipo en la fecha estipulada para evitar interrupciones operativas.</p>
        </div>
        <div style='background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;'>
            <p style='color: #9ca3af; font-size: 12px; margin: 0;'>Este es un aviso automático del sistema HelpDesk.</p>
            <p style='color: #2563eb; font-size: 12px; font-weight: bold; margin: 5px 0 0 0;'>Powered by TI — Financiera Codimersa</p>
        </div>
    </div>";
        }
    }
}