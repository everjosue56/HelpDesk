import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const downloadResolutionPdf = (resolution: any) => {
  if (!resolution) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;    

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
  doc.text('Acta Oficial de Cierre y Solución Técnica de Incidencia', margin, 23);

  const fechaHoy = new Date().toLocaleDateString('es-HN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`No. de Reso-${resolution.id}`, pageWidth - margin, 17, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Fecha de Emisión: ${fechaHoy}`, pageWidth - margin, 22, { align: 'right' });

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, 27, pageWidth - margin, 27);

  // --- 2. RESUMEN NARRATIVO FORMAL ---
  let yPos = 34;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('1. RESUMEN EJECUTIVO DE CIERRE', margin, yPos);

  yPos += 5;

  const fechaResolucionStr = resolution.resolutionDate && !resolution.resolutionDate.startsWith('0001')
    ? new Date(resolution.resolutionDate).toLocaleDateString('es-HN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'no registrada';

  const textoParrafo = `El presente documento da fe del cierre y atención técnica brindada al Ticket de Soporte #${resolution.idTicket}, solicitado por ${resolution.ticketCreatorName || 'N/A'}. La intervención fue realizada por el especialista en TI ${resolution.userName || 'N/A'}, registrando un tiempo total de solución de ${resolution.solutionTime ?? 0} hora(s) bajo el estado de solución "${resolution.solutionStatusName || 'Completado'}". El procedimiento técnico concluyó formalmente el ${fechaResolucionStr}.`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const lineasParrafo = doc.splitTextToSize(textoParrafo, pageWidth - (margin * 2));
  doc.text(lineasParrafo, margin, yPos);

  yPos += (lineasParrafo.length * 4.5) + 5;

  // --- 3. TABLA DE FICHA TÉCNICA Y PARÁMETROS ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('2. PARÁMETROS DEL SERVICIO Y EQUIPO', margin, yPos);

  yPos += 4;

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Parámetro', 'Detalle Registrado', 'Parámetro', 'Detalle Registrado']],
    body: [
      ['ID Resolución', `#${resolution.id}`, 'Ticket Asociado', `#${resolution.idTicket}`],
      ['Especialista TI', resolution.userName || 'N/A', 'Solicitante Ticket', resolution.ticketCreatorName || 'N/A'],
      ['Equipo / Dispositivo', resolution.deviceName || 'No especificado', 'Nivel Prioridad', resolution.priorityName || 'N/A'],
      ['Tiempo Invertido', `${resolution.solutionTime ?? 0} Horas`, 'Estado Solución', resolution.solutionStatusName || 'N/A'],
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

  // --- 4. DETALLES DE INTERVENCIÓN TÉCNICA ---

  // Helper para renderizar cajas de texto
  const agregarSeccionTexto = (titulo: string, contenido: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(titulo, margin, yPos);

    yPos += 4;

    const lineas = doc.splitTextToSize(contenido || 'Ninguna registrada.', pageWidth - (margin * 2) - 6);
    const altoCaja = (lineas.length * 4) + 5;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, yPos - 2, pageWidth - (margin * 2), altoCaja, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(lineas, margin + 3, yPos + 2.5);

    yPos += altoCaja + 4;
  };

  agregarSeccionTexto('3. ACCIÓN TOMADA (PROCEDIMIENTO APLICADO)', resolution.actionTaken);
  agregarSeccionTexto('4. CAUSA RAÍZ DEL PROBLEMA', resolution.rootCause);

  if (resolution.preventiveMeasures) {
    agregarSeccionTexto('5. MEDIDAS PREVENTIVAS RECOMENDADAS', resolution.preventiveMeasures);
  }

  if (resolution.observation) {
    agregarSeccionTexto('6. OBSERVACIONES DE SEGUIMIENTO', resolution.observation);
  }

  // --- 5. FIRMAS DE CONFORMIDAD ---
  const yFirmas = 245;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);

  doc.line(margin + 10, yFirmas, margin + 70, yFirmas);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Firma de Especialista TI', margin + 20, yFirmas + 4);

  doc.line(pageWidth - margin - 70, yFirmas, pageWidth - margin - 10, yFirmas);
  doc.text('Firma de Conformidad del Cliente', pageWidth - margin - 65, yFirmas + 4);

  // Pie de página
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Este documento sirve como constancia oficial de solución de incidencias para auditoría operativa HelpDesk.', pageWidth / 2, 285, { align: 'center' });

  doc.save(`Acta_Resolucion_Ticket_${resolution.idTicket}.pdf`);
};