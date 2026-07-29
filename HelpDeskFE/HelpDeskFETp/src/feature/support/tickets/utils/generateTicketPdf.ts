import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const downloadTicketPdf = (ticket: any) => {
  if (!ticket) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // --- ENCABEZADO INSTITUCIONAL ---
  // Barra superior de acento 
  doc.setFillColor(26, 85, 139); // #1a558b
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Título Principal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(26, 85, 139);
  doc.text('SISTEMA DE GESTIÓN DE SOPORTE Y HELPDESK', margin, 18);

  // Subtítulo y Datos Generales de Emisión
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); 
  doc.text('Ficha Oficial de Registro de Incidencia Técnica', margin, 23);

  // Fecha de emisión al lado derecho
  const fechaHoy = new Date().toLocaleDateString('es-HN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59); // Color de contraste para el correlativo
  doc.text(`No. Correlativo: #${ticket.id}`, pageWidth - margin, 17, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Fecha de Emisión: ${fechaHoy}`, pageWidth - margin, 22, { align: 'right' });

  // Línea divisora horizontal
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, 27, pageWidth - margin, 27);

  // --- RESUMEN EN PÁRRAFO FORMAL ---
  let yPos = 35;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('1. RESUMEN EJECUTIVO DE LA INCIDENCIA', margin, yPos);

  yPos += 6;

  // Formato de fecha de reporte
  const fechaReporte = ticket.reportDate && !ticket.reportDate.startsWith('0001')
    ? new Date(ticket.reportDate).toLocaleDateString('es-HN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : 'no registrada';

  const estadoTexto = ticket.isActive ? 'ABIERTO / EN ATENCIÓN' : 'CERRADO / RESUELTO';

  // Redacción del párrafo formal
  const textoParrafo = `El presente documento certifica la apertura y registro del Ticket N° #${ticket.id}, ingresado formalmente al sistema de soporte el día ${fechaReporte}. La incidencia fue reportada para el usuario ${ticket.userName || 'No Asignado'}, perteneciente al área de ${ticket.areaName || 'General'}, clasificándose bajo el tipo de error "${ticket.typeErrorName || 'No Tipificado'}" y afectando el sistema "${ticket.softwareSystemName || 'General'}". Actualmente la incidencia se encuentra en estado ${estadoTexto} con un nivel de prioridad ${ticket.priorityName || 'Media'} y un impacto clasificado como ${ticket.impactName || 'Bajo'}.`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  // Dividir el texto en renglones ajustados al ancho del PDF A4
  const lineasParrafo = doc.splitTextToSize(textoParrafo, pageWidth - (margin * 2));
  doc.text(lineasParrafo, margin, yPos);

  yPos += (lineasParrafo.length * 5) + 6;

  // --- TABLA FICHA TÉCNICA ESTRUCTURADA ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('2. FICHA TÉCNICA Y PARÁMETROS OPERATIVOS', margin, yPos);

  yPos += 4;

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Parámetro', 'Detalle Registrado', 'Parámetro', 'Detalle Registrado']],
    body: [
      ['Número de Ticket', `#${ticket.id}`, 'Usuario Asignado', ticket.userName || 'N/A'],
      ['Área Solicitante', ticket.areaName || 'N/A', 'Clasificación Error', ticket.typeErrorName || 'N/A'],
      ['Sistema Afectado', ticket.softwareSystemName || 'N/A', 'Nivel Prioridad', ticket.priorityName || 'N/A'],
      ['Grado de Impacto', ticket.impactName || 'N/A', 'Estado Actual', estadoTexto],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [26, 85, 139],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // --- SECCIÓN DE DESCRIPCIÓN DETALLADA ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('3. DESCRIPCIÓN DETALLADA DEL PROBLEMA', margin, yPos);

  yPos += 6;

  const descripcionTexto = ticket.description || 'Sin descripción detallada disponible para esta incidencia.';
  const lineasDescripcion = doc.splitTextToSize(descripcionTexto, pageWidth - (margin * 2));

  // Fondo tenue para la descripción
  const altoCaja = (lineasDescripcion.length * 4.5) + 6;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, yPos - 3, pageWidth - (margin * 2), altoCaja, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(lineasDescripcion, margin + 3, yPos + 2);

  yPos += altoCaja + 20;

  // --- SECCIÓN DE FIRMAS DE CONFORMIDAD ---
  // Nos aseguramos de situar las firmas cerca del pie de página
  const yFirmas = Math.max(yPos, 240);

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);

  // Firma 1: Técnico / Administrador
  doc.line(margin + 10, yFirmas, margin + 70, yFirmas);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Firma de Técnico Atendente', margin + 18, yFirmas + 4);

  // Firma 2: Usuario Solicitante
  doc.line(pageWidth - margin - 70, yFirmas, pageWidth - margin - 10, yFirmas);
  doc.text('Firma de Conformidad Usuario', pageWidth - margin - 62, yFirmas + 4);

  // --- PIE DE PÁGINA FIXTURE ---
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Este reporte es un documento oficial generado automáticamente por el Sistema HelpDesk para auditorías internas.', pageWidth / 2, 285, { align: 'center' });

  // Disparar descarga del PDF
  doc.save(`Ficha_Oficial_Ticket_${ticket.id}.pdf`);
};