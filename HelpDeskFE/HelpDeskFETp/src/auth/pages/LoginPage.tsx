import React from 'react';
import { FiHeadphones } from 'react-icons/fi';
import { InputField } from '../components/InputField';
import { useLoginForm } from '../hooks/useLoginForm';

export const LoginPage: React.FC = () => {
  const { formData, isLoading, errorMessage, handleInputChange, handleSubmit } = useLoginForm();

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
            icon={
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
              </svg>
            }
          />

          <InputField
            id="password"
            label="Contraseña"
            type="password"
            placeholder="********"
            value={formData.password || ''}
            onChange={handleInputChange}
            icon={
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />
              </svg>
            }
          />

          <a href="#" className="text-sm font-medium text-[#004791] hover:underline self-start">
            ¿Olvidaste tu contraseña?
          </a>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1a558b] text-white text-[16px] font-semibold py-3.5 rounded-lg hover:bg-[#154673] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 mt-4 cursor-pointer disabled:bg-neutral-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Autenticando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 lg:mt-12 text-center flex flex-col gap-2">
          <p className="text-sm font-normal text-neutral-600">
            ¿Aún no tienes cuenta?{' '}
            <a href="#" className="font-semibold text-[#004791] hover:underline">
              Contacta a tu administrador.
            </a>
          </p>
          <p className="text-xs font-normal text-neutral-400">
            © 2026 HELPDESK. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;