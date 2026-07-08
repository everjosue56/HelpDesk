import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiHeadphones, FiMail, FiLock, FiSend } from 'react-icons/fi';
import { InputField } from '../components/InputField';
import { AXIOS_INSTANCE } from '../../api/axios-instance';
import { toast } from 'sonner';
import type { ResetPasswordDto } from '@/api/model';
import { getAuth } from '@/api/generated/auth/auth';

interface ResetPasswordFormValues {
    email: string;
    code: string;
    newPassword: string;
}

export const ResetPasswordPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const stateEmail = location.state?.email || '';

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        defaultValues: {
            email: stateEmail,
            code: '',
            newPassword: '',
        },
    });

    const emailValue = watch('email');
    const codeValue = watch('code');
    const passwordValue = watch('newPassword');
    const onSubmit = async (data: ResetPasswordFormValues) => {
        try {
            setIsLoading(true);
            setServerError(null);

            const { postApiAuthResetPassword } = getAuth(AXIOS_INSTANCE);

            const resetPasswordDto: ResetPasswordDto = {
                email: data.email.trim().toLowerCase(),
                code: data.code.trim(),          
                newPassword: data.newPassword, 
            }

            await postApiAuthResetPassword(resetPasswordDto);

            toast.success("Contraseña restablecida correctamente", {
                description: "Ya puede iniciar sesión con sus nuevas credenciales."
            });

            navigate('/auth/login'); 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error al restablecer contraseña:", error);
            const msg = error.response?.data?.message || "No se pudo actualizar la contraseña. Verifique el código.";
            setServerError(msg);
            toast.error("Error al procesar la solicitud");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 animate-fadeIn text-left">

            {/* Columna Izquierda (Azul) */}
            <div className="bg-[#1a558b] flex flex-col items-center justify-center p-8 lg:p-12 text-center text-white min-h-[40vh] lg:min-h-screen select-none">
                <div className="bg-white w-28 h-28 flex items-center justify-center rounded-3xl shadow-sm mb-8 lg:mb-12">
                    <FiHeadphones className="w-14 h-14 text-[#1a558b]" />
                </div>

                <h1 className="text-4xl lg:text-[64px] font-bold tracking-tight mb-4 leading-tight">
                    HELPDESK
                </h1>
                <p className="text-lg lg:text-[20px] font-normal leading-normal max-w-md px-4">
                    Sistema integral de gestión de soporte y atención al cliente
                </p>
            </div>

            {/* Columna Derecha (Blanca) */}
            <div className="bg-white flex flex-col items-center justify-center p-6 lg:p-12 min-h-[60vh] lg:min-h-screen">

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white p-8 lg:p-10 rounded-[28px] shadow-xl border border-neutral-100 w-full max-w-115 flex flex-col gap-5"
                >
                    <div className="flex flex-col gap-1.5 select-none">
                        <h2 className="text-2xl lg:text-[26px] font-bold text-neutral-800 leading-tight">
                            Restablecer Contraseña
                        </h2>
                        <p className="text-xs lg:text-[13px] font-normal text-neutral-400">
                            Ingresa el codigo enviado a tu correo electronico
                        </p>
                    </div>

                    {serverError && (
                        <div className="p-3 text-xs font-semibold text-red-800 bg-red-50 rounded-xl border border-red-100">
                            {serverError}
                        </div>
                    )}

                    {/* Campo: Correo Electrónico */}
                    <div className="flex flex-col gap-1">
                        <InputField
                            id="email"
                            label="Correo Electrónico"
                            type="email"
                            placeholder="Example@gmail.com"
                            value={emailValue}
                            onChange={(e) => setValue('email', e.target.value)}
                            icon={<FiMail className="w-5 h-5 text-gray-400" />}
                        />
                        <input type="hidden" {...register('email', { required: true })} />
                    </div>

                    {/* Campo: Código de Verificación */}
                    <div className="flex flex-col gap-1">
                        <InputField
                            id="code"
                            label="Codigo"
                            type="text"
                            placeholder="000000"
                            value={codeValue}
                            onChange={(e) => setValue('code', e.target.value)}
                            icon={<FiSend className="w-5 h-5 text-gray-400" />}
                        />
                        <input type="hidden" {...register('code', { required: 'El código es obligatorio.' })} />
                        {errors.code && <p className="text-xs font-bold text-red-500 pl-1">{errors.code.message}</p>}
                    </div>

                    {/* Campo: Nueva Contraseña */}
                    <div className="flex flex-col gap-1">
                        <InputField
                            id="newPassword"
                            label="Nueva Contraseña"
                            type="password"
                            placeholder="********"
                            value={passwordValue}
                            onChange={(e) => setValue('newPassword', e.target.value)}
                            icon={<FiLock className="w-5 h-5 text-gray-400" />}
                        />
                        <input
                            type="hidden"
                            {...register('newPassword', {
                                required: 'La nueva contraseña es obligatoria.',
                                minLength: { value: 6, message: 'Debe contener al menos 6 caracteres.' }
                            })}
                        />
                        {errors.newPassword && <p className="text-xs font-bold text-red-500 pl-1">{errors.newPassword.message}</p>}
                    </div>

                    {/* Botón Confirmar Contraseña */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#1a558b] text-white text-[15px] font-bold py-3.5 rounded-xl hover:bg-[#154673] transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 mt-2 cursor-pointer shadow-sm disabled:bg-neutral-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Verificando...' : 'Confirmar Contraseña'}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 lg:mt-12 text-center select-none">
                    <p className="text-xs font-normal text-neutral-400 tracking-wide">
                        © 2026 HELPDESK. Todos los derechos reservados.
                    </p>
                </div>

            </div>
        </div>
    );
};