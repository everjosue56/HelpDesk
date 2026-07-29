import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const downloadDevicePdf = (device: any) => {
  if (!device) return;

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
  doc.text('Ficha Oficial de Asignación y Control Patrimonial de Hardware', margin, 23);

  const fechaHoy = new Date().toLocaleDateString('es-HN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Cod. Inventario: ${device.code || 'N/A'}`, pageWidth - margin, 17, { align: 'right' });

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
  doc.text('1. CONSTANCIA DE ASIGNACIÓN PATRIMONIAL', margin, yPos);

  yPos += 5;

  const estadoTexto = device.isActive ? 'OPERATIVO / ACTIVO' : 'INACTIVO / BAJA';

  const textoParrafo = `Por medio de la presente se hace constar el registro y asignación del activo tecnológico identificado con el Código de Inventario "${device.code || 'N/A'}". El equipo correspondiente a ${device.brandName || 'N/A'} (Tipo: ${device.deviceTypeName || 'N/A'}) se encuentra bajo la responsabilidad directa del usuario ${device.userName || 'Sin asignación'}, adscrito al área operativa de ${device.areaName || 'General'}. El activo registra un estado actual ${estadoTexto} y una cantidad asignada de ${device.quantity ?? 1} unidad(es).`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const lineasParrafo = doc.splitTextToSize(textoParrafo, pageWidth - (margin * 2));
  doc.text(lineasParrafo, margin, yPos);

  yPos += (lineasParrafo.length * 4.5) + 5;

  // --- 3. TABLA DE ESPECIFICACIONES TÉCNICAS Y CONTROL ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('2. ESPECIFICACIONES TÉCNICAS DEL ACTIVO', margin, yPos);

  yPos += 4;

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Parámetro', 'Detalle Registrado', 'Parámetro', 'Detalle Registrado']],
    body: [
      ['Código Inventario', device.code || 'N/A', 'Marca / Modelo', device.brandName || 'N/A'],
      ['Tipo Dispositivo', device.deviceTypeName || 'N/A', 'Cantidad Registrada', `${device.quantity ?? 1} ud.`],
      ['Usuario Asignado', device.userName || 'N/A', 'Área Operativa', device.areaName || 'N/A'],
      ['Estado Operativo', estadoTexto, 'ID Interno Sistema', `#${device.id}`],
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

  // --- 4. OBSERVACIONES TÉCNICAS ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('3. OBSERVACIONES Y NOTAS DE MANTENIMIENTO', margin, yPos);

  yPos += 4;

  const obsTexto = device.observation || 'Sin observaciones registradas para este hardware.';
  const lineasObs = doc.splitTextToSize(obsTexto, pageWidth - (margin * 2) - 6);
  const altoCaja = (lineasObs.length * 4) + 5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, yPos - 2, pageWidth - (margin * 2), altoCaja, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(lineasObs, margin + 3, yPos + 2.5);

  // --- 5. COMPROMISO Y FIRMAS DE ENTREGA/RECEPCIÓN ---
  const yFirmas = 242;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const textoCompromiso = 'El usuario custodio declara haber recibido el equipo descrito en condiciones operativas óptimas y se compromete al uso adecuado del mismo según las políticas institucionales de TI.';
  const lineasCompromiso = doc.splitTextToSize(textoCompromiso, pageWidth - (margin * 2));
  doc.text(lineasCompromiso, margin, yFirmas - 12);

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);

  // Firma 1: Administrador de TI / Inventario
  doc.line(margin + 10, yFirmas, margin + 70, yFirmas);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Entrega: Administrador de TI', margin + 18, yFirmas + 4);

  // Firma 2: Usuario Custodio
  doc.line(pageWidth - margin - 70, yFirmas, pageWidth - margin - 10, yFirmas);
  doc.text('Recibe: Usuario Custodio', pageWidth - margin - 58, yFirmas + 4);

  // Pie de página
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Documento oficial generado por el Sistema HelpDesk para el control físico de activos informáticos.', pageWidth / 2, 285, { align: 'center' });

  doc.save(`Ficha_Patrimonial_Hardware_${device.code || device.id}.pdf`);
};