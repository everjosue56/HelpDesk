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
    }
}