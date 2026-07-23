import { describe, expect, it } from 'vitest';
import { normalizeMaintenanceDashboardPayload } from './useMaintenanceDashboard';

describe('normalizeMaintenanceDashboardPayload', () => {
  it('unwraps dashboard data when the backend returns it inside a data property', () => {
    const payload = {
      success: true,
      data: {
        totalProgramados: 5,
        totalRealizados: 3,
        totalVencidos: 1,
        tiempoTotalEjecucion: 12.5,
        porEstado: [{ estado: 'Completado', cantidad: 3, color: 'green' }],
        porFrecuencia: [{ frecuencia: 'Mensual', cantidad: 2 }],
        porArea: [{ area: 'Soporte', cantidad: 2 }],
        historialMensual: [{ mesNumero: 1, mesNombre: 'enero', cantidad: 2 }],
      },
    };

    const normalized = normalizeMaintenanceDashboardPayload(payload);

    expect(normalized).not.toBeNull();
    expect(normalized?.totalProgramados).toBe(5);
    expect(normalized?.porEstado).toHaveLength(1);
    expect(normalized?.historialMensual[0].mesNombre).toBe('enero');
  });
});
