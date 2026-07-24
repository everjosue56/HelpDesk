import React from 'react';

interface PdfLayoutProps {
    id: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export const PdfReportLayout: React.FC<PdfLayoutProps> = ({ id, title, subtitle, children }) => {
    return (
        <div id={id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            
            {/* 🏢 ENCABEZADO EXCLUSIVO PARA EL PDF */}
            <div className="pdf-header hidden p-4 border-b border-gray-200 mb-2">
                <div className="flex items-start justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#1a558b] text-white font-black px-3 py-2 rounded-xl text-lg">HD</div>
                        <div>
                            <h2 className="text-xl font-black text-[#1a558b] uppercase tracking-wide">Sistema HelpDesk</h2>
                            <p className="text-xs text-slate-500 font-semibold">{subtitle}</p>
                        </div>
                    </div>
                    <div className="text-right text-xs text-slate-500 space-y-1">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-[#1a558b] font-black">{title}</p>
                        <p><span className="font-bold">Fecha de Emisión:</span> {new Date().toLocaleDateString('es-HN')}</p>
                        <p><span className="font-bold">Clasificación:</span> Confidencial / Uso Interno</p>
                    </div>
                </div>
            </div>

            {/* CONTENIDO DE LA VISTA */}
            <div className="w-full">
                {children}
            </div>

            {/* ✍️ PIE DE PÁGINA EXCLUSIVO PARA EL PDF */}
            <div className="pdf-footer hidden pt-8 border-t border-gray-200 mt-8 text-xs text-slate-500">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="font-bold text-slate-700">Generado por: Administrador del Sistema</p>
                        <p className="text-[10px]">Documento generado automáticamente para fines de auditoría técnica.</p>
                    </div>
                    <div className="text-center w-48 border-t border-slate-300 pt-1">
                        <p className="font-semibold text-slate-600">Firma de Conformidad</p>
                    </div>
                </div>
            </div>
        </div>
    );
};