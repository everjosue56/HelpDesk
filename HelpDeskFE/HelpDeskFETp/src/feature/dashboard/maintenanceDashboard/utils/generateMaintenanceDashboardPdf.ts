import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface EstadoItem {
  estado: string;
  cantidad: number;
}

interface HistorialItem {
  mesNombre: string;
  cantidad: number;
}

interface FrecuenciaItem {
  frecuencia: string;
  cantidad: number;
}

interface AreaItem {
  area: string;
  cantidad: number;
}

interface MaintenanceDashboardData {
  totalProgramados: number;
  totalRealizados: number;
  totalVencidos: number;
  tiempoTotalEjecucion: number;
  porEstado: EstadoItem[];
  historialMensual: HistorialItem[];
  porFrecuencia: FrecuenciaItem[];
  porArea: AreaItem[];
}

const NOMBRES_MESES: Record<number, string> = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
  5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
  9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
};

export const downloadMaintenanceDashboardPdf = (
  year: number,
  data?: MaintenanceDashboardData,
  selectedMonth?: number
) => {
  if (!data) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  const periodoTexto = selectedMonth && NOMBRES_MESES[selectedMonth]
    ? `${NOMBRES_MESES[selectedMonth]} ${year}`
    : `Anual ${year}`;

  // --- 1. ENCABEZADO INSTITUCIONAL ---
  doc.setFillColor(26, 85, 139); // Azul HelpDesk (#1a558b)
  doc.rect(0, 0, pageWidth, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(26, 85, 139);
  doc.text('SISTEMA DE GESTIÓN DE SOPORTE Y HELPDESK', margin, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Informe Ejecutivo de Gestión de Mantenimiento Preventivo y Correctivo', margin, 23);

  const fechaHoy = new Date().toLocaleDateString('es-HN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Período: ${periodoTexto}`, pageWidth - margin, 17, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Fecha Emisión: ${fechaHoy}`, pageWidth - margin, 22, { align: 'right' });

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, 27, pageWidth - margin, 27);

  // --- 2. RESUMEN NARRATIVO FORMAL ---
  let yPos = 34;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('1. RESUMEN EJECUTIVO Y OBJETIVO DEL PLAN', margin, yPos);

  yPos += 5;

  const detallePeriodo = selectedMonth && NOMBRES_MESES[selectedMonth]
    ? `correspondiente al mes de ${NOMBRES_MESES[selectedMonth]} del año ${year}`
    : `a lo largo del ejercicio anual ${year}`;

  const textoParrafo = `El presente informe consolida el desempeño operativo del programa de mantenimientos preventivos y correctivos ${detallePeriodo}. Durante este lapso se administró una carga total de ${data.totalProgramados || 0} mantenimientos programados, logrando completar un total de ${data.totalRealizados || 0} intervenciones efectivas. Se registraron ${data.totalVencidos || 0} mantenimientos en estado de vencimiento que requieren atención prioritaria. La inversión total en horas de servicio técnico asciende a ${(data.tiempoTotalEjecucion || 0).toFixed(1)} horas de trabajo acumuladas.`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const lineasParrafo = doc.splitTextToSize(textoParrafo, pageWidth - (margin * 2));
  doc.text(lineasParrafo, margin, yPos);

  yPos += (lineasParrafo.length * 4.5) + 5;

  // --- 3. TABLA DE KPIs GENERALES ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('2. MÉTRICAS CLAVE DE PREVENCIÓN', margin, yPos);

  yPos += 4;

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Indicador de Mantenimiento', 'Resultado Registrado', 'Indicador de Mantenimiento', 'Resultado Registrado']],
    body: [
      ['Mantenimientos Programados', `${data.totalProgramados || 0} Casos`, 'Realizados en Periodo', `${data.totalRealizados || 0} Casos`],
      ['Mantenimientos Vencidos', `${data.totalVencidos || 0} Casos`, 'Tiempo Invertido Acumulado', `${(data.tiempoTotalEjecucion || 0).toFixed(1)} Hrs`],
      ['Período de Evaluación', periodoTexto, 'Clasificación del Reporte', 'Confidencial / Auditoría'],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [26, 85, 139],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yPos = (doc as any).lastAutoTable.finalY + 7;

  // --- 4. DESGLOSE POR ESTADOS Y FRECUENCIA ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('3. DISTRIBUCIÓN POR ESTADOS Y FRECUENCIAS', margin, yPos);

  yPos += 4;

  const filasEstados = data.porEstado.map((e) => [e.estado, `${e.cantidad} Mantenimientos`]);
  const filasFrecuencias = data.porFrecuencia.map((f) => [f.frecuencia, `${f.cantidad} Asignados`]);

  // Aseguramos nivelar las dos columnas de la tabla comparativa
  const maxFilas = Math.max(filasEstados.length, filasFrecuencias.length);
  const filasCombinadas = [];

  for (let i = 0; i < maxFilas; i++) {
    filasCombinadas.push([
      filasEstados[i]?.[0] || '-',
      filasEstados[i]?.[1] || '-',
      filasFrecuencias[i]?.[0] || '-',
      filasFrecuencias[i]?.[1] || '-',
    ]);
  }

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Estado Operativo', 'Total Casos', 'Frecuencia Programada', 'Total Asignado']],
    body: filasCombinadas.length > 0 ? filasCombinadas : [['Sin Datos', '-', 'Sin Datos', '-']],
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yPos = (doc as any).lastAutoTable.finalY + 7;

  // --- 5. COBERTURA POR ÁREA OPERATIVA Y MENSUAL ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('4. COBERTURA DE MANTENIMIENTO POR ÁREA OPERATIVA', margin, yPos);

  yPos += 4;

  const filasAreas = data.porArea.map((a) => [a.area, `${a.cantidad} Mantenimientos`]);

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Área / Departamento Solicitante', 'Cantidad de Mantenimientos Atendidos']],
    body: filasAreas.length > 0 ? filasAreas : [['Sin Datos de Área', '-']],
    theme: 'grid',
    headStyles: {
      fillColor: [26, 85, 139],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // --- 6. FIRMAS DE CONFORMIDAD Y AUDITORÍA ---
  const yFirmas = 245;

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);

  // Firma 1: Administrador / Especialista
  doc.line(margin + 10, yFirmas, margin + 70, yFirmas);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Elaborado por: Especialista de TI / Soporte', margin + 10, yFirmas + 4);

  // Firma 2: Jefatura de TI / Gerencia
  doc.line(pageWidth - margin - 70, yFirmas, pageWidth - margin - 10, yFirmas);
  doc.text('Revisado por: Jefatura de Soporte y TI', pageWidth - margin - 65, yFirmas + 4);

  // Pie de página
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Este reporte oficial es consolidado por el Sistema HelpDesk para evaluación de activos e infraestructura.', pageWidth / 2, 285, { align: 'center' });

  doc.save(`Reporte_Mantenimientos_${selectedMonth ? `Mes_${selectedMonth}_` : ''}${year}.pdf`);
};