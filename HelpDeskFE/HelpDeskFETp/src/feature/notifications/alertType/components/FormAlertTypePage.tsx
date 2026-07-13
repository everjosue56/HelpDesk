import React from 'react';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import { Button } from '../../../../../@/components/ui/button';

export interface AlertTypeFormValues {
    name: string;
}

interface AlertTypeFormProps {
    initialData?: AlertTypeFormValues | null;
    onSubmit: (values: AlertTypeFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

export const AlertTypeForm: React.FC<AlertTypeFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AlertTypeFormValues>({
        values: initialData || { name: '' },
    });

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6 animate-fadeIn text-left select-none">
            <div>
                <h2 className="text-xl font-bold text-slate-800">
                    {initialData ? 'Modificar Registro' : 'Registrar Nuevo Tipo'}
                </h2>
                <p className="text-gray-400 mt-0.5 text-sm">
                    Defina el nombre del disparador que mapeará el motor de alertas globales
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Campo: Nombre del Tipo de Alerta */}
                <div className="space-y-2">
                    <label className="text-base font-bold text-slate-700 block">
                        Nombre del Tipo de Alerta <span className="text-red-500"></span>
                    </label>
                    <input
                        type="text"
                        placeholder="Ej. Notificación por Correo, Alerta Crítica..."
                        {...register('name', {
                            required: 'El nombre del tipo de alerta es obligatorio.',
                            minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres.' },
                            maxLength: { value: 100, message: 'El nombre no puede exceder los 100 caracteres.' },
                        })}
                        className={`w-full px-4 py-2 bg-white border rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.name
                                ? 'border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 focus:ring-[#1e5f8a]/20 focus:border-[#1e5f8a]'
                            }`}
                    />
                    {errors.name && (
                        <p className="text-xs font-semibold text-red-500 mt-1 animate-fadeIn">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                    <Button
                        type="button"
                        onClick={onCancel}
                        variant="outline"
                        className="rounded-xl h-11 px-6 font-semibold bg-gray-400 hover:bg-gray-500 text-white hover:text-white border-none transition-colors gap-2 cursor-pointer shadow-none"
                    >
                        <X className="h-4 w-4" />
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-xl h-11 px-6 font-semibold bg-[#1a558b] hover:bg-[#133f67] text-white transition-colors gap-2 shadow-none cursor-pointer"
                    >
                        <Save className="h-4 w-4" />
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </form>
        </div>
    );
};