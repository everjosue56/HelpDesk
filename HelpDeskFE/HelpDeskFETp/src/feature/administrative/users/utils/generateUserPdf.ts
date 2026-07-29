import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const downloadUserPdf = (user: any) => {
  if (!user) return;

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
  doc.text('Ficha Oficial de Perfil y Registro de Usuario Institucional', margin, 23);

  const fechaHoy = new Date().toLocaleDateString('es-HN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`ID Usuario: USR-${user.id}`, pageWidth - margin, 17, { align: 'right' });

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
  doc.text('1. RESUMEN EJECUTIVO DE LA CUENTA', margin, yPos);

  yPos += 5;

  const nombreCompleto = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Sin Nombre Registrado';
  const estadoTexto = user.isActive ? 'ACTIVO / HABILITADO' : 'INACTIVO / DESHABILITADO';
  const fechaCreacionTexto = user.createdDate && user.createdDate !== 'N/A'
    ? new Date(user.createdDate).toLocaleDateString('es-HN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : 'N/A';

  const textoParrafo = `Por medio del presente documento se certifica el perfil oficial de la cuenta pertenenciente a ${nombreCompleto}, bajo el nombre de usuario "@${user.userName || 'N/A'}". La cuenta está asignada al rol institucional "${user.roleName || 'General'}" dentro de la agencia de ${user.agencyName || 'N/A'} (Área: ${user.areaName || 'N/A'}). Actualmente la cuenta mantiene un estado ${estadoTexto} y registra como fecha de alta el ${fechaCreacionTexto}.`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const lineasParrafo = doc.splitTextToSize(textoParrafo, pageWidth - (margin * 2));
  doc.text(lineasParrafo, margin, yPos);

  yPos += (lineasParrafo.length * 4.5) + 5;

  // --- 3. TABLA DE FICHA TÉCNICA ESTRUCTURADA ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('2. PARÁMETROS GENERALES DEL USUARIO', margin, yPos);

  yPos += 4;

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Parámetro', 'Detalle Registrado', 'Parámetro', 'Detalle Registrado']],
    body: [
      ['ID de Usuario', `#${user.id || 'N/A'}`, 'Nombre Completo', nombreCompleto],
      ['Nombre Usuario', `@${user.userName || 'N/A'}`, 'Rol Institucional', user.roleName || 'N/A'],
      ['Correo Electrónico', user.email || 'N/A', 'Teléfono / Contacto', user.phoneNumber || 'N/A'],
      ['Agencia Asignada', user.agencyName || 'N/A', 'Área Organizativa', user.areaName || 'N/A'],
      ['Estado de Cuenta', estadoTexto, 'Fecha Registro', fechaCreacionTexto],
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
  yPos = (doc as any).lastAutoTable.finalY + 8;

  // --- 4. POLÍTICAS DE USO Y SEGURIDAD ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('3. COMPROMISO DE ACCESO Y SEGURIDAD DE LA CUENTA', margin, yPos);

  yPos += 4;

  const textoPoliticas = '1. Las credenciales de acceso asignadas a esta cuenta son de uso estrictamente personal e intransferible.\n2. El titular de la cuenta es responsable de las operaciones y tickets registrados bajo su usuario.\n3. Cualquier irregularidad en el estado o uso de la cuenta debe ser notificada inmediatamente al Departamento de TI.';
  const lineasPoliticas = doc.splitTextToSize(textoPoliticas, pageWidth - (margin * 2) - 6);
  const altoCaja = (lineasPoliticas.length * 4) + 6;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, yPos - 2, pageWidth - (margin * 2), altoCaja, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(lineasPoliticas, margin + 3, yPos + 2.5);

  // --- 5. FIRMAS DE CONFORMIDAD ---
  const yFirmas = 245;

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);

  // Firma Administrador
  doc.line(margin + 10, yFirmas, margin + 70, yFirmas);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Administrador de Sistemas / TI', margin + 15, yFirmas + 4);

  // Firma Titular
  doc.line(pageWidth - margin - 70, yFirmas, pageWidth - margin - 10, yFirmas);
  doc.text('Conformidad del Usuario Titular', pageWidth - margin - 65, yFirmas + 4);

  // Pie de página
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Documento oficial generado por el Sistema HelpDesk para la gestión administrativa de usuarios.', pageWidth / 2, 285, { align: 'center' });

  doc.save(`Ficha_Usuario_${user.userName || user.id}.pdf`);
};