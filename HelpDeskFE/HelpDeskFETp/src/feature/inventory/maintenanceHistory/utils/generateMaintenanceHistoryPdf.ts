import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper para formatear tiempo de minutos a horas/minutos
const formatTimeLabel = (totalMinutes?: number) => {
  if (!totalMinutes) return '0 Minutos';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} Minutos`;
  if (minutes === 0) return `${hours} ${hours === 1 ? 'Hora' : 'Horas'}`;
  return `${hours} ${hours === 1 ? 'Hora' : 'Horas'} y ${minutes} Minutos`;
};

// Helper para fechas
const formatDateLabel = (fechaStr?: string) => {
  if (!fechaStr || fechaStr.startsWith('0001-01-01')) return 'No registrada';
  return new Date(fechaStr).toLocaleDateString('es-HN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const downloadMaintenanceHistoryPdf = (history: any) => {
  if (!history) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

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
  doc.text('Constancia Oficial de Servicio y Mantenimiento Técnico', margin, 23);

  const fechaHoy = new Date().toLocaleDateString('es-HN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`No. Historial: MANT-${history.id}`, pageWidth - margin, 17, { align: 'right' });

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
  doc.text('1. CONSTANCIA DE MANTENIMIENTO TÉCNICO', margin, yPos);

  yPos += 5;

  const tecnicoNombre = history.technicalName || 'No asignado';
  const codigoEquipo = history.deviceCode || 'N/A';
  const tipoEquipo = history.deviceType || 'Hardware';
  const marcaEquipo = history.deviceBrand || 'N/A';
  const tiempoTexto = formatTimeLabel(history.solutionTime);
  const fechaCreacionTexto = formatDateLabel(history.createdDate);

  const textoParrafo = `Por medio del presente documento se certifica la ejecución del mantenimiento técnico realizado al equipo con Código de Inventario "${codigoEquipo}" (${tipoEquipo} - ${marcaEquipo}). La intervención fue llevada a cabo por el especialista de TI ${tecnicoNombre} (${history.technicalEmail || 'Sin correo'}), empleando un tiempo total de ejecución de ${tiempoTexto}. El registro fue consolidado en el sistema el ${fechaCreacionTexto}.`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const lineasParrafo = doc.splitTextToSize(textoParrafo, pageWidth - (margin * 2));
  doc.text(lineasParrafo, margin, yPos);

  yPos += (lineasParrafo.length * 4.5) + 5;

  // --- 3. TABLA ESTRUCTURADA CON LOS CAMPOS EXACTOS ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('2. PARÁMETROS DEL SERVICIO EJECUTADO', margin, yPos);

  yPos += 4;

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Parámetro', 'Detalle Registrado', 'Parámetro', 'Detalle Registrado']],
    body: [
      ['ID Registro', `#${history.id || 'N/A'}`, 'Código Dispositivo', codigoEquipo],
      ['Técnico Responsable', tecnicoNombre, 'Marca / Modelo', marcaEquipo],
      ['Correo Técnico', history.technicalEmail || 'N/A', 'Tipo Dispositivo', tipoEquipo],
      ['Fecha de Registro', fechaCreacionTexto, 'Tiempo Demorado', tiempoTexto],
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

  // --- 4. DETALLES TÉCNICOS ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('3. DETALLE DE PROCEDIMIENTOS Y ACCIONES APLICADAS', margin, yPos);

  yPos += 4;

  const detallesTexto = history.maintenanceDetails || 'Sin observaciones o detalles técnicos registrados.';
  const lineasDetalles = doc.splitTextToSize(detallesTexto, pageWidth - (margin * 2) - 6);
  const altoCaja = (lineasDetalles.length * 4) + 5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, yPos - 2, pageWidth - (margin * 2), altoCaja, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(lineasDetalles, margin + 3, yPos + 2.5);

  // --- 5. SECCIÓN DE FIRMAS DE CONFORMIDAD ---
  const yFirmas = 245;

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);

  // Firma del Técnico
  doc.line(margin + 10, yFirmas, margin + 70, yFirmas);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Firma de Técnico Especialista TI', margin + 15, yFirmas + 4);

  // Firma del Usuario / Área
  doc.line(pageWidth - margin - 70, yFirmas, pageWidth - margin - 10, yFirmas);
  doc.text('Conformidad del Usuario / Área', pageWidth - margin - 65, yFirmas + 4);

  // Pie de página
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Documento formal generado por el Sistema HelpDesk para la hoja de vida técnica de activos.', pageWidth / 2, 285, { align: 'center' });

  doc.save(`Acta_Mantenimiento_${history.deviceCode || history.id}.pdf`);
};