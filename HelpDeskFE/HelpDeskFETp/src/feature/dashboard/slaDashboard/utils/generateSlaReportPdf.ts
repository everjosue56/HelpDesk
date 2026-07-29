import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface MonthlyRecord {
  mesNumero: number;
  mesNombre: string;
  meta: number;
  metaAlcanzada: number;
  incidentesReportados: number;
  tiempoPromedioResolucion: number;
  cumplimiento: string;
}

interface ActiveKpiData {
  incidentesReportados: number;
  tiempoPromedioResolucion: number;
  cumplimiento: string;
  meta: number;
  metaAlcanzada: number;
}

const NOMBRES_MESES: Record<number, string> = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
  5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
  9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
};

export const downloadSlaReportPdf = (
  year: number,
  monthlyRecords: MonthlyRecord[],
  activeKpiData: ActiveKpiData,
  selectedMonth?: number
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  const periodoTexto = selectedMonth && NOMBRES_MESES[selectedMonth]
    ? `${NOMBRES_MESES[selectedMonth]} ${year}`
    : `Año ${year}`;

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
  doc.text('Informe Gerencial de Cumplimiento de Acuerdos de Nivel de Servicio (SLA)', margin, 23);

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
  doc.text('1. RESUMEN Y ANÁLISIS DE RENDIMIENTO', margin, yPos);

  yPos += 5;

  const totalIncidentesAnual = monthlyRecords.reduce((acc, m) => acc + m.incidentesReportados, 0);
  const promedioCumplimientoAnual = monthlyRecords.length > 0
    ? (monthlyRecords.reduce((acc, m) => acc + m.metaAlcanzada, 0) / monthlyRecords.length).toFixed(1)
    : '0.0';

  const estadoGeneral = activeKpiData.cumplimiento?.toUpperCase() || 'SIN DATOS';

  const detalleFiltroMes = selectedMonth && NOMBRES_MESES[selectedMonth]
    ? `con un enfoque específico en el mes de ${NOMBRES_MESES[selectedMonth]}`
    : `a lo largo del ciclo anual ${year}`;

  const textoParrafo = `El presente informe consolida el desempeño operativo y nivel de respuesta del equipo de Tecnologías de la Información ${detalleFiltroMes}. A lo largo del período se registraron un total de ${totalIncidentesAnual} incidentes técnicos. En la evaluación, se alcanzó un porcentaje de cumplimiento del ${promedioCumplimientoAnual}%, registrando un estado global de "${estadoGeneral}" frente a las metas estipuladas. El Tiempo Medio de Resolución (MTTR) proyectado se posiciona en ${activeKpiData.tiempoPromedioResolucion?.toFixed(2) || '0.00'} horas.`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const lineasParrafo = doc.splitTextToSize(textoParrafo, pageWidth - (margin * 2));
  doc.text(lineasParrafo, margin, yPos);

  yPos += (lineasParrafo.length * 4.5) + 5;

  // --- 3. RESUMEN DE MÉTRICAS CLAVE (KPIs) ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('2. MÉTRICAS CLAVE Y CUMPLIMIENTO GLOBAL', margin, yPos);

  yPos += 4;

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Métrica de Desempeño', 'Resultado Registrado', 'Métrica de Desempeño', 'Resultado Registrado']],
    body: [
      ['Total Incidentes Atendidos', `${totalIncidentesAnual} Casos`, 'Tiempo Prom. Resolución (MTTR)', `${activeKpiData.tiempoPromedioResolucion?.toFixed(2) || '0.00'} Horas`],
      ['Meta Institucional Fija', `${activeKpiData.meta || 95}%`, 'Meta Promedio Alcanzada', `${activeKpiData.metaAlcanzada?.toFixed(1) || '0.0'}%`],
      ['Estado Alerta SLA', estadoGeneral, 'Período Evaluado', periodoTexto],
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

  // --- 4. TABLA DETALLADA MES A MES ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('3. DESGLOSE MENSUAL DE ATENCIÓN Y ANS', margin, yPos);

  yPos += 4;

  const filasTabla = monthlyRecords.map((m) => [
    m.mesNombre.charAt(0).toUpperCase() + m.mesNombre.slice(1),
    `${m.incidentesReportados} Incidentes`,
    `${m.meta}%`,
    `${m.metaAlcanzada.toFixed(1)}%`,
    `${m.tiempoPromedioResolucion.toFixed(2)} H`,
    m.cumplimiento.toUpperCase(),
  ]);

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Mes', 'Incidentes', 'Meta Fija', 'Meta Alcanzada', 'MTTR Promedio', 'Estado SLA']],
    body: filasTabla,
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

  // --- 5. FIRMAS DE AUDITORÍA Y GERENCIA ---
  const yFirmas = 245;

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);

  doc.line(margin + 10, yFirmas, margin + 70, yFirmas);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Elaborado por: Dirección / Jefatura de TI', margin + 12, yFirmas + 4);

  doc.line(pageWidth - margin - 70, yFirmas, pageWidth - margin - 10, yFirmas);
  doc.text('Revisado por: Dirección General / Auditoría', pageWidth - margin - 68, yFirmas + 4);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Este informe es un documento oficial generado para la evaluación gerencial de ANS e indicadores HelpDesk.', pageWidth / 2, 285, { align: 'center' });

  doc.save(`Informe_SLA_${selectedMonth ? `Mes_${selectedMonth}_` : ''}${year}.pdf`);
};