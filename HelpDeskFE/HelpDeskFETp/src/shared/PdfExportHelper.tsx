import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export const exportToPdf = async (elementId: string, filename: string) => {
    const exportTarget = document.getElementById(elementId);
    if (!exportTarget) return false;

    const pdfHeader = exportTarget.querySelector('.pdf-header');
    const pdfFooter = exportTarget.querySelector('.pdf-footer');

    try {
        if (pdfHeader) pdfHeader.classList.remove('hidden');
        if (pdfFooter) pdfFooter.classList.remove('hidden');

        const imgData = await toPng(exportTarget, {
            quality: 1,
            backgroundColor: '#ffffff',
            pixelRatio: 2,
            cacheBust: true,
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const elementWidth = exportTarget.offsetWidth;
        const elementHeight = exportTarget.offsetHeight;
        const pdfHeight = (elementHeight * pdfWidth) / elementWidth;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${filename}.pdf`);
        return true;
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        return false;
    } finally {
        if (pdfHeader) pdfHeader.classList.add('hidden');
        if (pdfFooter) pdfFooter.classList.add('hidden');
    }
};