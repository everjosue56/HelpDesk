import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../@/components/ui/dialog';
import { AXIOS_INSTANCE } from '../../api/axios-instance';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ForgotPasswordFormValues {
  email: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' }
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setIsSubmitting(true);

      // 1. Esperamos la respuesta limpia de .NET
      await AXIOS_INSTANCE.post('/api/auth/forgot-password', {
        email: data.email.trim().toLowerCase()
      });

      // 2. Notificamos éxito al usuario
      toast.success("Correo de recuperación enviado");

      // 3. Redireccion
      navigate('/auth/reset-password', {
        state: { email: data.email.trim().toLowerCase() },
        replace: true
      });

      reset();
      onClose();

    } catch (error) {
      console.error("Error en la petición:", error);
      toast.error("No se pudo procesar la solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-105 w-[90%] rounded-[24px] p-6 bg-white border-none shadow-2xl flex flex-col gap-5 select-none animate-in fade-in-50 zoom-in-95 duration-200">

        <DialogHeader className="text-left w-full">
          <DialogTitle className="text-lg font-bold text-slate-800 tracking-tight">
            Ingrese su correo electrónico
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">

          {/* Campo Input de Correo */}
          <div className="space-y-2 relative">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Example@gmail.com"
                disabled={isSubmitting}
                {...register('email', {
                  required: 'El correo electrónico es obligatorio.',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'El formato de correo no es válido.'
                  }
                })}
                className={`w-full h-11 pl-11 pr-4 bg-white border rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-gray-200 focus:ring-[#1a558b]/20 focus:border-[#1a558b]'
                  }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-semibold text-red-500 mt-1 pl-1 animate-fadeIn">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-row items-center gap-3 pt-2 w-full">

            {/* Confirmar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#1a558b] hover:bg-[#133f67] text-white flex items-center justify-center gap-2 font-bold h-11 rounded-xl text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar"
              )}
            </button>

            {/* Cancelar */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 bg-[#9ca3af] hover:bg-[#8b93a1] text-white flex items-center justify-center font-bold h-11 rounded-xl text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>

          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};