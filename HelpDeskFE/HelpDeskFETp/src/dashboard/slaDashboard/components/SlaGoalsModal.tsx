import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../@/components/ui/dialog";
import { Button } from "../../../../@/components/ui/button";
import { Input } from "../../../../@/components/ui/input";
import { FiCalendar, FiSave } from 'react-icons/fi';
import { useSlaGoals } from '../hooks/useSlaGoals';
import { toast } from 'sonner';

interface SlaGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentData: any[];
  onSuccess: () => void;
}

const MESES_NOMBRES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const SlaGoalsModal: React.FC<SlaGoalsModalProps> = ({
  isOpen,
  onClose,
  year,
  currentData,
  onSuccess
}) => {
  const [goals, setGoals] = useState<{ [key: number]: string }>(() => {
    const initialGoals: { [key: number]: string } = {};
    if (currentData && currentData.length > 0) {
      currentData.forEach((item) => {
        initialGoals[item.mesNumero] = String(item.meta);
      });
    }
    return initialGoals;
  });

  const [prevData, setPrevData] = useState(currentData);
  const [loadingMonth, setLoadingMonth] = useState<number | null>(null);

  if (currentData !== prevData) {
    const updatedGoals: { [key: number]: string } = {};
    if (currentData && currentData.length > 0) {
      currentData.forEach((item) => {
        updatedGoals[item.mesNumero] = String(item.meta);
      });
    }
    setGoals(updatedGoals);
    setPrevData(currentData);
  }


  const { saveMonthGoal } = useSlaGoals(onSuccess);

  const handleInputChange = (mesIndex: number, value: string) => {
    setGoals(prev => ({
      ...prev,
      [mesIndex]: value
    }));
  };

  const handleSaveClick = async (mesIndex: number) => {
    const valueStr = goals[mesIndex];
    if (!valueStr || isNaN(Number(valueStr))) {
      toast.error("Por favor ingrese un valor numérico válido.");
      return;
    }

    setLoadingMonth(mesIndex);

    const wasSaved = await saveMonthGoal({
      year: year,
      month: mesIndex,
      goalValue: Number(valueStr)
    });

    if (wasSaved) {
      toast.success(`Meta de ${MESES_NOMBRES[mesIndex - 1]} actualizada correctamente.`);
    }

    setLoadingMonth(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125 max-h-[85vh] overflow-y-auto bg-white rounded-2xl p-6 border border-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FiCalendar className="text-[#1a558b]" />
            Configurar Metas SLA — {year}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-400">
            Establezca el porcentaje mínimo de cumplimiento requerido para el cierre de tickets dentro de las 24 horas.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {MESES_NOMBRES.map((nombre, index) => {
            const mesNumero = index + 1;
            return (
              <div
                key={mesNumero}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-slate-50/50 transition-colors bg-white shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-700">{nombre}</span>
                  <span className="text-[10px] text-gray-400">Periodo {mesNumero}/{year}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex items-center">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="95.0"
                      value={goals[mesNumero] || ''}
                      onChange={(e) => handleInputChange(mesNumero, e.target.value)}
                      className="w-24 h-9 pr-6 rounded-lg text-right font-medium border-gray-200 focus:ring-[#1a558b]"
                    />
                    <span className="absolute right-2 text-xs font-semibold text-gray-400 pointer-events-none">%</span>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSaveClick(mesNumero)}
                    disabled={loadingMonth === mesNumero}
                    className="h-9 w-9 p-0 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-100"
                  >
                    {loadingMonth === mesNumero ? (
                      <span className="h-4 w-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiSave className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5"
          >
            Cerrar Ventana
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};