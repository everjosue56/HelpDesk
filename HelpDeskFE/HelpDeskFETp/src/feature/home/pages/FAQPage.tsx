import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../../shared/Navbar';
import { Button } from '../../../../@/components/ui/button';
import {
  FiHelpCircle,
  FiSettings,
  FiPackage,
  FiSliders,
  FiChevronDown,
  FiArrowLeft,
  FiFileText
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
      },
      {
        question: "¿Qué significa que mi ticket esté en estado 'En Espera' o 'Congelado'?",
        answer: "Este estado significa que el SLA (cronómetro de atención) se ha pausado temporalmente debido a que el equipo técnico requiere información adicional de su parte, la confirmación de un tercero o la llegada de un repuesto externo."
      },
      {
        question: "¿Los tiempos de SLA corren durante los fines de semana o días feriados?",
        answer: "No. Por defecto, los acuerdos de nivel de servicio (SLA) calculan el tiempo de resolución basándose exclusivamente en el calendario y horario operativo laboral de la institución, a menos que el ticket sea catalogado como una emergencia crítica global."
      },
      {
        question: "¿Puedo cancelar un ticket si la falla se solucionó sola?",
        answer: "Sí, siempre y cuando el ticket no haya sido tomado aún por un técnico. Puede ingresar al detalle de su solicitud desde su panel y presionar el botón 'Cancelar Ticket' especificando el motivo."
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
      },
      {
        question: "Si me transfieren físicamente a otra agencia o sede, ¿mi inventario se actualiza solo?",
        answer: "No de forma automática. El sistema requiere que el área administrativa o de TI procese un ticket de 'Traslado de Activo' para reflejar el cambio de ubicación física e impedir inconsistencias de auditoría."
      },
      {
        question: "¿Cómo sé cuál es el código de activo o número de serie de mi equipo?",
        answer: "Cada dispositivo cuenta con una etiqueta física institucional holográfica o de alta resistencia con un código de barra/QR único. En laptops o PC, también puede validarlo desde el panel de información del sistema en su perfil de usuario."
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
      },
      {
        question: "¿Mi cuenta se bloquea por intentos fallidos? ¿Cómo la desbloqueo?",
        answer: "Sí, por motivos de seguridad institucional, la cuenta se suspende temporalmente tras 5 intentos fallidos consecutivos. El bloqueo dura 15 minutos, o bien, puede solicitar un desbloqueo inmediato notificando al administrador de TI."
      },
      {
        question: "¿Puedo mantener mi sesión abierta en varios dispositivos a la vez?",
        answer: "El sistema permite la consulta simultánea, pero cerrará automáticamente las sesiones activas anteriores si detecta cambios de dirección IP drásticos o accesos desde ubicaciones geográficas concurrentes no autorizadas."
      }
    ]
  },
  {
    title: "Reportes y Auditoría",
    icon: FiFileText,
    colorClass: "text-purple-600",
    bgClass: "bg-purple-50/50",
    items: [
      {
        question: "¿Quiénes pueden visualizar los KPI y métricas de las agencias?",
        answer: "La visualización de las métricas de carga operativa y distribución de incidencias está restringida bajo roles de acceso. Solo los administradores, jefes de área y personal de auditoría tienen permisos para interactuar con los filtros dinámicos."
      },
      {
        question: "¿Por qué los reportes exportados en Excel/CSV a veces muestran variaciones con el gráfico interactivo?",
        answer: "Los gráficos del dashboard principal procesan datos en tiempo real (asincrónicos). Si descarga un reporte masivo mientras hay técnicos operando y cerrando tickets en caliente, es normal percibir ligeras discrepancias de minutos."
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

      <main className="p-6 space-y-6 bg-[#f8f9fa] min-h-screen font-sans animate-fadeIn text-left mr-4 ml-4">

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
                          className={`transition-all duration-200 ease-in-out overflow-hidden ${isOpen ? 'max-h-40 opacity-100 border-t border-slate-50' : 'max-w-0 max-h-0 opacity-0'
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