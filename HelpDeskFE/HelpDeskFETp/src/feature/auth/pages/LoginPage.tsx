import React, { useState } from 'react';
import { FiHeadphones, FiMail, FiLock } from 'react-icons/fi';
import { InputField } from '../components/InputField';
import { useLoginForm } from '../hooks/useLoginForm';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';

export const LoginPage: React.FC = () => {
  const { formData, isLoading, errorMessage, handleInputChange, handleSubmit } = useLoginForm();
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Columna Izquierda (Azul) */}
      <div className="bg-[#1a558b] flex flex-col items-center justify-center p-8 lg:p-12 text-center text-white min-h-[40vh] lg:min-h-screen">
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

      {/* Columna Derecha (Blanca con el Formulario) */}
      <div className="bg-white flex flex-col items-center justify-center p-6 lg:p-12 min-h-[60vh] lg:min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 lg:p-10 rounded-[28px] shadow-xl border border-neutral-100 w-full max-w-115 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl lg:text-[28px] font-semibold text-neutral-900 leading-tight">
              Inicio de Sesión
            </h2>
            <p className="text-sm lg:text-[15px] font-normal text-neutral-500">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 text-sm text-red-800 bg-red-50 rounded-lg border border-red-100" role="alert">
              <span className="font-medium">Error:</span> {errorMessage}
            </div>
          )}

          <InputField
            id="email"
            label="Correo Electrónico"
            type="email"
            placeholder="Example@gmail.com"
            value={formData.email || ''}
            onChange={handleInputChange}
            icon={<FiMail className="w-5 h-5 text-gray-400" />}
          />

          <InputField
            id="password"
            label="Contraseña"
            type="password"
            placeholder="********"
            value={formData.password || ''}
            onChange={handleInputChange}
            icon={<FiLock className="w-5 h-5 text-gray-400" />}
          />

          <button 
            type="button"
            onClick={() => setIsForgotOpen(true)}
            className="text-sm font-medium text-[#004791] hover:underline self-start cursor-pointer transition-colors bg-transparent border-none p-0"
          >
            ¿Olvidaste tu contraseña?
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1a558b] text-white text-[16px] font-semibold py-3.5 rounded-lg hover:bg-[#154673] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 mt-4 cursor-pointer disabled:bg-neutral-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Autenticando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 lg:mt-12 text-center flex flex-col gap-2 select-none">
          <p className="text-sm font-normal text-neutral-600">
            ¿Aún no tienes cuenta?{' '}
            <a href="#" className="font-semibold text-[#004791] hover:underline">
              Contacta a tu administrador.
            </a>
          </p>
          <p className="text-xs font-normal text-neutral-400">
            © 2026 HELPDESK | EG. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Modal de recuperación */}
      <ForgotPasswordModal 
        isOpen={isForgotOpen} 
        onClose={() => setIsForgotOpen(false)} 
      />
    </div>
  );
};

export default LoginPage;