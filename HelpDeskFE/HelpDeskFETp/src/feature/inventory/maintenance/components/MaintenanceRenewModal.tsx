import React, { useState } from 'react';
import { X, RotateCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { MaintenanceItem } from '../hooks/useMaintenances';

interface MaintenanceRenewModalProps {
    isOpen: boolean;
    onClose: () => void;
    maintenance: MaintenanceItem | null;
    onConfirmRenew: (id: number, dto: any) => Promise<void>;
}

const getInitialFormData = () => {
    return {
        details: '',
        executionTime: '60'
    };
};

export const MaintenanceRenewModal: React.FC<MaintenanceRenewModalProps> = ({
    isOpen,
    onClose,
    maintenance,
    onConfirmRenew
}) => {
    const [formData, setFormData] = useState(getInitialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reiniciar formulario al abrir con un nuevo mantenimiento
    React.useEffect(() => {
        if (isOpen) {
            setFormData(getInitialFormData());
        }
    }, [isOpen, maintenance]);

    if (!isOpen || !maintenance) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);

            const payload = {
                details: formData.details,
                executionTime: parseFloat(formData.executionTime) || 1.0
            };

            await onConfirmRenew(maintenance.id, payload);
            toast.success("Mantenimiento renovado con éxito");
            onClose();
        } catch (error) {
            toast.error("Error al renovar el mantenimiento");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn select-none">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                
                {/* CABECERA */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <RotateCw className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Renovar Mantenimiento</h3>
                            <p className="text-xs text-gray-500">
                                {maintenance.deviceFullDescription || "Equipo de TI"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* FORMULARIO */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Tiempo Invertido (Minutos) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            name="executionTime"
                            value={formData.executionTime}
                            onChange={handleChange}
                            required
                            placeholder="Ej. 60"
                            className="w-full h-9.5 px-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Detalles de la Intervención <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            required
                            minLength={5}
                            rows={4}
                            placeholder="Escriba los detalles específicos del mantenimiento realizado..."
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a] transition-all resize-none"
                        />
                    </div>

                    {/* BOTONES */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Renovando...
                                </>
                            ) : (
                                "Guardar Renovación"
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};