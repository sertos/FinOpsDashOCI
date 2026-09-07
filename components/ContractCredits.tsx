import React, { useState } from 'react';
import { ContractCreditsData, ContractYear, CreditTranche } from '../types';
import {
  FileText,
  Calendar,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Percent,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { format, addDays } from 'date-fns';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

const StatusBadge: React.FC<{ status: CreditTranche['status'] }> = ({ status }) => {
  switch (status) {
    case 'optimal':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Consumo Saludable
        </span>
      );
    case 'warning_underuse':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5" /> Riesgo de Subconsumo / Vencimiento
        </span>
      );
    case 'warning_expiring':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
          <Clock className="w-3.5 h-3.5" /> Próximo a Vencer
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
          Agotado
        </span>
      );
  }
};

const CreditYearBar: React.FC<{ yearData: ContractYear; isCurrentYear: boolean }> = ({ yearData, isCurrentYear }) => {
  const { year, allocated, consumed } = yearData;
  const percentage = allocated > 0 ? (consumed / allocated) * 100 : 0;

  const getBarGradient = () => {
    if (percentage > 85) return 'bg-sky-600';
    if (percentage > 50) return 'bg-sky-500';
    return 'bg-sky-400';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className={`font-semibold ${isCurrentYear ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
          Año {year} {isCurrentYear && <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded ml-1 font-mono">Actual</span>}
        </span>
        <span className="text-slate-600 font-mono">
          <span className="font-semibold text-slate-900">{formatCurrency(consumed)}</span> / {formatCurrency(allocated)} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getBarGradient()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export const ContractCredits: React.FC<{ data: ContractCreditsData }> = ({ data }) => {
  const [simulationMultiplier, setSimulationMultiplier] = useState<number>(1.0);
  const [showSimDetails, setShowSimDetails] = useState<boolean>(false);

  if (!data || !data.costCenters) {
    return null;
  }

  const baseDailyBurn = data.dailyBurnRate || 5200;
  const simulatedDailyBurn = baseDailyBurn * simulationMultiplier;
  
  const totalAllocated = data.costCenters.reduce(
    (acc, cc) => acc + cc.years.reduce((yAcc, y) => yAcc + y.allocated, 0),
    0
  );
  const totalConsumed = data.costCenters.reduce(
    (acc, cc) => acc + cc.years.reduce((yAcc, y) => yAcc + y.consumed, 0),
    0
  );
  const remainingCredits = Math.max(0, totalAllocated - totalConsumed);

  const estimatedDaysRemaining = simulatedDailyBurn > 0 ? Math.round(remainingCredits / simulatedDailyBurn) : 999;
  const projectedRunoutDate = addDays(new Date(), estimatedDaysRemaining);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-display font-bold text-slate-900">
              Gestión Contractual y Créditos Universal (UCC)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Contrato #{data.contractId || 'OCI-UCC-2025-99842'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Monitoreo en tiempo real de consumo de créditos de compromiso, simulador de agotamiento y vencimientos por tranches.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-600">
          <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
          <span>Periodo: <strong className="text-slate-900">01/01/2025 - 31/12/2027</strong></span>
        </div>
      </div>

      {/* KPI Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Committed */}
        <div className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Compromiso Total 3 Años</span>
            <Percent className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-display font-bold text-slate-900">{formatCurrency(totalAllocated)}</p>
          <p className="text-[11px] text-slate-500 font-medium">32% Descuento Ponderado Universal Credit</p>
        </div>

        {/* Consumed */}
        <div className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Créditos Ejecutados a la Fecha</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-display font-bold text-slate-900">
            {formatCurrency(totalConsumed)}
          </p>
          <p className="text-[11px] text-slate-600 font-semibold">
            {((totalConsumed / totalAllocated) * 100).toFixed(1)}% del presupuesto ejecutado
          </p>
        </div>

        {/* Remaining */}
        <div className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Saldo de Crédito Disponible</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-display font-bold text-slate-900">{formatCurrency(remainingCredits)}</p>
          <p className="text-[11px] text-emerald-700 font-medium">Libre para asignación multirregión</p>
        </div>

        {/* Projected Runout */}
        <div className="bg-sky-50/60 border border-sky-200/70 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-sky-800 font-medium">
            <span>Agotamiento Estimado</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-xl font-display font-bold text-sky-950 font-mono">
            {format(projectedRunoutDate, 'dd MMM yyyy')}
          </p>
          <p className="text-[11px] text-sky-700 font-medium">
            ~{estimatedDaysRemaining} días restantes al ritmo sim.
          </p>
        </div>
      </div>

      {/* Simulator Section */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            <div>
              <h4 className="text-base font-display font-bold text-white flex items-center gap-2">
                Simulador Interactivo de Tasa de Consumo (Burn-Rate)
              </h4>
              <p className="text-xs text-slate-300">
                Ajusta el ritmo proyectado de consumo para evaluar riesgos de desborde o vencimiento de créditos.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700 shrink-0">
            <button
              onClick={() => setSimulationMultiplier(0.85)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                simulationMultiplier === 0.85
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              🛡️ Optimizado (-15%)
            </button>
            <button
              onClick={() => setSimulationMultiplier(1.0)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                simulationMultiplier === 1.0
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              🟢 Ritmo Actual (1.0x)
            </button>
            <button
              onClick={() => setSimulationMultiplier(1.25)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                simulationMultiplier === 1.25
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              ⚡ Acelerado (+25%)
            </button>
          </div>
        </div>

        {/* Simulation Output Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block mb-1">Gasto Diario Simulado</span>
            <span className="text-lg font-mono font-bold text-sky-300">{formatCurrency(simulatedDailyBurn)} / día</span>
            <span className="text-[10px] text-slate-400 block mt-1">Base actual: {formatCurrency(baseDailyBurn)}/día</span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block mb-1">Duración Estimada de Saldo</span>
            <span className="text-lg font-mono font-bold text-white">{estimatedDaysRemaining} días de operación</span>
            <span className="text-[10px] text-slate-400 block mt-1">Proyección para {format(projectedRunoutDate, 'MMMM yyyy')}</span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <span className="text-slate-300 font-semibold block">Diagnóstico de Salud Contractual:</span>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                {simulationMultiplier > 1.0 ? (
                  <span className="text-amber-300 font-medium">⚠️ Mayor consumo: Agotamiento anticipado en ~{estimatedDaysRemaining} días. Evaluar addendum de créditos.</span>
                ) : simulationMultiplier < 1.0 ? (
                  <span className="text-emerald-300 font-medium">🛡️ Alta eficiencia: Extiende la cobertura de tus créditos hasta {format(projectedRunoutDate, 'MMM yyyy')}.</span>
                ) : (
                  <span className="text-sky-200">Alineado al plan financiero. Los créditos cubren el periodo proyectado dentro del margen.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Multiannual Breakdown by Entity */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-sm font-display font-bold text-slate-900 mb-4">
          Distribución de Créditos por Entidad Corporativa (Visión Multianual)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.costCenters.map((cc) => (
            <div key={cc.name} className="bg-slate-50/60 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-bold text-slate-900">{cc.displayName}</h5>
                <span className="text-xs font-mono font-medium text-slate-500">Asignación 3 Años</span>
              </div>
              <div className="space-y-3">
                {cc.years.map((yearData) => (
                  <CreditYearBar
                    key={yearData.year}
                    yearData={yearData}
                    isCurrentYear={yearData.year === data.currentYear}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractCredits;
