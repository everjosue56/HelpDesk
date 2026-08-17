import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2, } from 'lucide-react';
import { useMaintenances, type MaintenanceCalendarEvent } from '../hooks/useMaintenances';

interface MaintenanceCalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MaintenanceCalendarModal: React.FC<MaintenanceCalendarModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { getMaintenanceCalendar } = useMaintenances('', 1, 5);
    const [events, setEvents] = useState<MaintenanceCalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (!isOpen) return;

        const loadCalendarData = async () => {
            setIsLoading(true);
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const data = await getMaintenanceCalendar(year, month);
            setEvents(data);
            setIsLoading(false);
        };

        loadCalendarData();
    }, [isOpen, currentDate, getMaintenanceCalendar]);

    if (!isOpen) return null;

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const getEventsForDay = (day: number) => {
        return events.filter(evt => {
            if (!evt.start) return false;
            const eventDate = new Date(evt.start);
            return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
        });
    };

    const handleEventClick = (id: number) => {
        onClose();
        navigate(`details/${id}`);
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn select-none">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* CABECERA */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#1e5f8a]/10 text-[#1e5f8a] rounded-xl">
                            <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Calendario de Mantenimientos</h3>
                            <p className="text-xs text-gray-500">Programación mensual de mantenimientos para equipos de TI</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* NAVEGACIÓN */}
                <div className="flex items-center justify-between px-6 py-3 bg-[#f8f9fa] border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={prevMonth}
                            className="p-1.5 border border-gray-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-black text-slate-800 min-w-36 text-center">
                            {monthNames[month]} {year}
                        </span>
                        <button
                            onClick={nextMonth}
                            className="p-1.5 border border-gray-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg transition-colors cursor-pointer"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex items-center gap-2 text-xs text-[#1e5f8a] font-semibold">
                            <Loader2 className="h-4 w-4 animate-spin" /> Cargando agenda...
                        </div>
                    )}
                </div>

                {/* DÍAS Y EVENTOS */}
                <div className="p-6 overflow-y-auto">
                    <div translate="no" className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 auto-rows-fr">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="min-h-24 bg-slate-50/50 rounded-xl border border-transparent" />
                        ))}

                        {/* Días con fecha */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dayEvents = getEventsForDay(day);
                            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

                            return (
                                <div
                                    key={`day-${day}`}
                                    className={`min-h-24 p-1.5 rounded-xl border transition-all flex flex-col justify-between overflow-x-hidden w-full box-border ${isToday ? 'border-[#1e5f8a] bg-[#1e5f8a]/5' : 'border-gray-100 bg-white hover:border-gray-200'
                                        }`}
                                >
                                    {/* Número del día */}
                                    <div className="flex justify-between items-center mb-1 shrink-0">
                                        <span className={`text-xs font-bold ${isToday ? 'bg-[#1e5f8a] text-white w-5 h-5 flex items-center justify-center rounded-full' : 'text-slate-700'}`}>
                                            {day}
                                        </span>
                                    </div>

                                    {/* Contenedor de eventos (Scroll solo VERTICAL, prohibido el horizontal) */}
                                    <div className="space-y-1 overflow-y-auto overflow-x-hidden max-h-16 w-full text-left pr-0.5">
                                        {dayEvents.map((evt: any) => {
                                            const isGreen = evt.color === 'green' || evt.status === 'Realizado';
                                            const isYellow = evt.color === 'yellow' || evt.status === 'Proximo';
                                            const isRed = evt.color === 'red' || evt.status === 'Vencido';

                                            const bgClass = isGreen
                                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                : isRed
                                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                                    : isYellow
                                                        ? 'bg-amber-400 text-slate-900 font-bold border border-amber-500 hover:bg-amber-500'
                                                        : 'bg-[#1e5f8a] text-white hover:bg-[#154666]';

                                            return (
                                                <div
                                                    key={evt.id}
                                                    onClick={() => handleEventClick(evt.id)}
                                                    className={`${bgClass} p-1 rounded-md text-[10px] leading-tight font-medium shadow-xs transition-all cursor-pointer w-full box-border overflow-hidden`}
                                                    title={`Haz clic para ver el detalle de ${evt.deviceName || evt.title}`}
                                                >
                                                    <p className="font-bold truncate w-full block">{evt.deviceName || evt.title}</p>
                                                    {evt.frequencyName && <p className="opacity-80 text-[9px] truncate w-full block">{evt.frequencyName}</p>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* PIE DE MODAL CON LEYENDA ACTUALIZADA */}
                <div className="p-4 bg-slate-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                            <span>Realizado</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#1e5f8a]" />
                            <span>Programado</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <span>Próximo (≤ 7 días)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <span>Vencido</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer self-end sm:self-auto"
                    >
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    );
};