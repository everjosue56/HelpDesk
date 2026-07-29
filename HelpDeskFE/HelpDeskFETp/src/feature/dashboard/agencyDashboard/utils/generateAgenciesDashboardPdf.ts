import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface AgencyRecord {
  idAgencia?: number;
  agenciaNombre: string;
  totalTickets: number;
  ticketsCriticos: number;
}

interface KpiData {
  totalTickets: number;
  totalAgencias: number;
}

const NOMBRES_MESES: Record<number, string> = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
  5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
  9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
};

export const downloadAgenciesDashboardPdf = (
  year: number,
  agenciesRecords: AgencyRecord[],
  kpis: KpiData,
  month?: number
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  const periodoTexto = month && NOMBRES_MESES[month]
    ? `${NOMBRES_MESES[month]} ${year}`
    : `Anual ${year}`;

  // --- 1. ENCABEZADO INSTITUCIONAL ---
  doc.setFillColor(26, 85, 139);  
  doc.rect(0, 0, pageWidth, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(26, 85, 139);
  doc.text('SISTEMA DE GESTIÓN DE SOPORTE Y HELPDESK', margin, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Informe Gerencial de Distribución de Carga y Solicitudes por Agencia', margin, 23);

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

  // --- 2. RESUMEN EJECUTIVO REDACTADO ---
  let yPos = 34;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('1. RESUMEN EJECUTIVO DE CARGA OPERATIVA', margin, yPos);

  yPos += 5;

  const detallePeriodo = month && NOMBRES_MESES[month]
    ? `durante el mes de ${NOMBRES_MESES[month]} del año ${year}`
    : `a lo largo del ciclo anual ${year}`;

  const textoParrafo = `El presente informe evalúa el volumen de incidencias técnicas reportadas por la red de agencias y sucursales institucionales ${detallePeriodo}. Durante este lapso se monitoreó una cobertura total de ${kpis.totalAgencias || 0} agencias activas, sumando un acumulado general de ${kpis.totalTickets || 0} tickets de soporte solicitados, identificando los casos con severidad crítica para su priorización operativa.`;

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
  doc.text('2. PARÁMETROS GLOBALES DE SUCURSALES', margin, yPos);

  yPos += 4;

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Métrica de Evaluación', 'Resultado Registrado', 'Métrica de Evaluación', 'Resultado Registrado']],
    body: [
      ['Total Incidentes Reportados', `${kpis.totalTickets || 0} Casos`, 'Total Agencias Analizadas', `${kpis.totalAgencias || 0} Sucursales`],
      ['Período de Evaluación', periodoTexto, 'Clasificación del Reporte', 'Confidencial / Auditoría Interna'],
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

  // --- 4. TABLA DETALLADA POR AGENCIA ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('3. DESGLOSE INDIVIDUAL DE INCIDENCIAS POR AGENCIA', margin, yPos);

  yPos += 4;

  const filasTabla = agenciesRecords.map((a) => [
    a.agenciaNombre.replace(" users", ""),
    `${a.totalTickets} Tickets`,
    `${a.ticketsCriticos} Críticos`,
    a.ticketsCriticos > 0 ? 'ATENCIÓN ALTA' : 'ESTABLE',
  ]);

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Nombre de la Agencia / Sucursal', 'Total Solicitudes', 'Casos Críticos', 'Nivel de Riesgo Operativo']],
    body: filasTabla.length > 0 ? filasTabla : [['Sin registros de agencias', '-', '-', '-']],
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

  // --- 5. FIRMAS DE AUDITORÍA Y DIRECCIÓN ---
  const yFirmas = 245;

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);

  // Firma 1: Jefatura de TI
  doc.line(margin + 10, yFirmas, margin + 70, yFirmas);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Elaborado por: Dirección / Jefatura de TI', margin + 12, yFirmas + 4);

  // Firma 2: Auditoría / Gerencia
  doc.line(pageWidth - margin - 70, yFirmas, pageWidth - margin - 10, yFirmas);
  doc.text('Revisado por: Dirección General / Auditoría', pageWidth - margin - 68, yFirmas + 4);

  // Pie de página
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Informe oficial generado por el Sistema HelpDesk para la gestión operativa y control de agencias.', pageWidth / 2, 285, { align: 'center' });

  doc.save(`Informe_Carga_Agencias_${month ? `Mes_${month}_` : ''}${year}.pdf`);
};