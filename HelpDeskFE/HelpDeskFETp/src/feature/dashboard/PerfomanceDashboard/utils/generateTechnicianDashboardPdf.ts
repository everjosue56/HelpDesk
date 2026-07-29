import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// 🔍 Actualizamos el tipo para alinearlo con TechnicianPerformanceData
export interface TechRecord {
  idUsuario?: number; // Opcional para evitar el conflicto
  tecnicoNombre: string;
  ticketsResueltos: number;
  mttrHoras: number;
}

interface KpiData {
  totalResueltos: number;
  promedioMttr: number;
}

const NOMBRES_MESES: Record<number, string> = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
  5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
  9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
};

export const downloadTechnicianDashboardPdf = (
  year: number,
  techRecords: TechRecord[],
  kpis: KpiData,
  month?: number,
  techName?: string
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

  const tecnicoTexto = techName && techName !== 'Todos' ? techName : 'Todos los Técnicos';

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
  doc.text('Informe Gerencial de Productividad y Rendimiento del Equipo Técnico TI', margin, 23);

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
  doc.text('1. RESUMEN EJECUTIVO DE PRODUCTIVIDAD', margin, yPos);

  yPos += 5;

  const detalleEnfoque = month && NOMBRES_MESES[month]
    ? `durante el mes de ${NOMBRES_MESES[month]} del año ${year}`
    : `a lo largo del ciclo anual ${year}`;

  const textoParrafo = `El presente informe consolida el rendimiento y la eficiencia de resolución de solicitudes del equipo de soporte de Tecnologías de la Información ${detalleEnfoque}. Evaluando el filtro seleccionado (${tecnicoTexto}), se registra un total acumulado de ${kpis.totalResueltos || 0} incidencias resueltas exitosamente. El Tiempo Medio de Resolución (MTTR) ponderado del equipo/técnico se ubica en ${kpis.promedioMttr.toFixed(2)} horas por ticket.`;

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
  doc.text('2. PARÁMETROS GLOBALES EVALUADOS', margin, yPos);

  yPos += 4;

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Métrica de Desempeño', 'Resultado Registrado', 'Métrica de Desempeño', 'Resultado Registrado']],
    body: [
      ['Técnico(s) Evaluado(s)', tecnicoTexto, 'Total Incidencias Resueltas', `${kpis.totalResueltos || 0} Casos`],
      ['Tiempo Promedio Solución (MTTR)', `${kpis.promedioMttr.toFixed(2)} Horas`, 'Período Evalución', periodoTexto],
      ['Clasificación del Reporte', 'Confidencial / Auditoría TI', 'Total Personal Registrado', `${techRecords.length} Especialistas`],
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

  // --- 4. TABLA DETALLADA POR TÉCNICO ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('3. DESGLOSE INDIVIDUAL DE DESEMPEÑO TÉCNICO', margin, yPos);

  yPos += 4;

  const filasTabla = techRecords.map((t) => [
    t.tecnicoNombre || 'Especialista TI',
    `${t.ticketsResueltos} Incidencias`,
    `${t.mttrHoras.toFixed(2)} Horas`,
    t.ticketsResueltos > 0 ? 'ACTIVO' : 'SIN ACTIVIDAD',
  ]);

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Nombre del Técnico Especialista', 'Tickets Resueltos', 'MTTR Promedio', 'Estado de Carga']],
    body: filasTabla.length > 0 ? filasTabla : [['Sin registros de técnicos', '-', '-', '-']],
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

  // --- 5. FIRMAS DE AUDITORÍA Y JEFATURA ---
  const yFirmas = 245;

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);

  doc.line(margin + 10, yFirmas, margin + 70, yFirmas);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Elaborado por: Jefatura de Soporte TI', margin + 12, yFirmas + 4);

  doc.line(pageWidth - margin - 70, yFirmas, pageWidth - margin - 10, yFirmas);
  doc.text('Revisado por: Dirección General / Auditoría', pageWidth - margin - 68, yFirmas + 4);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Informe oficial generado por el Sistema HelpDesk para la evaluación operativa y productiva del personal.', pageWidth / 2, 285, { align: 'center' });

  doc.save(`Informe_Rendimiento_Tecnicos_${month ? `Mes_${month}_` : ''}${year}.pdf`);
};