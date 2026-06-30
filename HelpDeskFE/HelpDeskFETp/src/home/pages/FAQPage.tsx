import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '../../../@/components/ui/button';
import { 
  FiHelpCircle, 
  FiSettings, 
  FiPackage, 
  FiSliders, 
  FiChevronDown, 
  FiArrowLeft 
} from 'react-icons/fi';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: "Gestión de Tickets y Soporte",
    icon: FiSettings,
    colorClass: "text-[#1a558b]",
    bgClass: "bg-blue-50/50",
    items: [
      {
        question: "¿Cuánto tiempo tarda en atenderse un ticket?",
        answer: "El tiempo estimado de respuesta depende de la prioridad asignada por el área técnica (Baja, Media, Alta o Crítica), según los acuerdos de nivel de servicio (SLA) establecidos para su área u organización."
      },
      {
        question: "¿Puedo reabrir un ticket que ya fue cerrado?",
        answer: "No, una vez que un ticket ha sido completado y cerrado, no se puede modificar. Si experimenta la misma falla, deberá registrar un nuevo ticket haciendo referencia al ID del reporte anterior."
      }
    ]
  },
  {
    title: "Control de Inventario y Hardware",
    icon: FiPackage,
    colorClass: "text-amber-600",
    bgClass: "bg-amber-50/50",
    items: [
      {
        question: "¿Cómo reporto una falla en un equipo que no está a mi nombre?",
        answer: "Al crear un ticket de soporte, puede buscar el equipo en el catálogo de inventario integrado por medio de su número de serie o código de activo, permitiendo asociarlo a la incidencia sin importar quién lo tenga asignado."
      },
      {
        question: "¿Qué hago si me asignaron un equipo incorrecto?",
        answer: "Deberá levantar un ticket dirigido al área de Gestión de Activos o Administrativa especificando el código del dispositivo erróneo para que el inventario sea actualizado de inmediato."
      }
    ]
  },
  {
    title: "Cuentas y Seguridad",
    icon: FiSliders,
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-50/50",
    items: [
      {
        question: "¿Cómo puedo restablecer mi contraseña de acceso?",
        answer: "Si olvidó sus credenciales, puede hacer clic en la opción '¿Olvidaste tu contraseña?' desde la pantalla de inicio de sesión. El sistema le enviará un código de verificación único a su correo electrónico institucional para autorizar el cambio."
      }
    ]
  }
];

export const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  // Almacenamos el índice de la pregunta abierta (ej. "0-1" para categoría 0, ítem 1)
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="w-full min-h-screen bg-neutral-100/60 flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 flex flex-col gap-8 text-left animate-fadeIn">
        
        {/* Historial y Encabezado */}
        <div className="flex flex-col gap-1 select-none">
          <div className="text-[13px] font-semibold text-neutral-400 flex items-center gap-1.5 tracking-wide">
            <span onClick={() => navigate('/dashboard')} className="hover:text-[#1a558b] hover:underline cursor-pointer transition-colors">Inicio</span>
            <span className="text-neutral-300 font-normal">&gt;</span>
            <span className="text-gray-400 font-semibold">Preguntas Frecuentes</span>
          </div>
          
          <div className="flex items-center gap-3.5 mt-2">
            <div className="p-3 bg-white border border-gray-200/80 rounded-2xl text-[#1a558b] shadow-sm">
              <FiHelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-neutral-800 tracking-tight">Centro de Ayuda Interno</h1>
              <p className="text-sm text-neutral-500">Encuentre respuestas rápidas a las consultas y procedimientos más comunes del sistema</p>
            </div>
          </div>
        </div>

        {/* ─── MAPEO DE CATEGORÍAS Y PREGUNTAS ─── */}
        <div className="space-y-6">
          {faqData.map((category, catIndex) => {
            const CatIcon = category.icon;
            
            return (
              <div key={catIndex} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                
                {/* Título de Categoría */}
                <div className={`flex items-center gap-3 px-6 py-4 border-b border-gray-100 ${category.bgClass} select-none`}>
                  <CatIcon className={`w-5 h-5 ${category.colorClass}`} />
                  <h2 className="font-bold text-slate-800 text-base">{category.title}</h2>
                </div>

                {/* Acordeones Internos */}
                <div className="divide-y divide-gray-100">
                  {category.items.map((item, itemIndex) => {
                    const itemId = `${catIndex}-${itemIndex}`;
                    const isOpen = openItem === itemId;

                    return (
                      <div key={itemIndex} className="w-full">
                        {/* Botón Disparador (Pregunta) */}
                        <button
                          type="button"
                          onClick={() => toggleAccordion(itemId)}
                          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors cursor-pointer text-left focus:outline-none"
                        >
                          <span className="text-[14px] font-bold text-slate-700 pr-4 leading-snug">
                            {item.question}
                          </span>
                          <FiChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#1a558b]' : ''}`} />
                        </button>

                        {/* Panel Desplegable (Respuesta con animación fluida) */}
                        <div 
                          className={`transition-all duration-200 ease-in-out overflow-hidden ${
                            isOpen ? 'max-h-40 opacity-100 border-t border-slate-50' : 'max-w-0 max-h-0 opacity-0'
                          }`}
                        >
                          <div className="px-6 py-4 bg-slate-50/40 text-sm text-neutral-500 font-medium leading-relaxed">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

        {/* Botón inferior de retorno */}
        <div className="flex justify-end pt-2 select-none">
          <Button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-xl h-11 px-5 font-semibold bg-[#1a558b] hover:bg-[#133f67] text-white transition-colors gap-2 cursor-pointer shadow-sm text-xs"
          >
            <FiArrowLeft className="h-4 w-4 stroke-[2.5]" />
            Volver al Inicio
          </Button>
        </div>

      </main>
    </div>
  );
};

export default FAQPage;