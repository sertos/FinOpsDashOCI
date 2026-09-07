import React, { useState } from 'react';
import { SavingsOpportunity } from '../types';
import {
  TrendingDown,
  DollarSign,
  Cpu,
  HardDrive,
  Database,
  SlidersHorizontal,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Zap,
  Filter
} from 'lucide-react';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);

interface Props {
  opportunities: SavingsOpportunity[];
}

export const SavingsOpportunities: React.FC<Props> = ({ opportunities }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  if (!opportunities || opportunities.length === 0) return null;

  const categories = ['Todas', 'Cómputo Inactivo', 'Almacenamiento Huérfano', 'Ajuste de Talla (Right-Sizing)', 'Base de Datos', 'Compromisos Flex'];

  const filtered = opportunities.filter(
    (o) => selectedCategory === 'Todas' || o.category === selectedCategory
  );

  const totalPotentialSavings = opportunities.reduce(
    (acc, o) => acc + o.estimatedMonthlySavings,
    0
  );

  const appliedSavings = opportunities
    .filter((o) => appliedIds.includes(o.id))
    .reduce((acc, o) => acc + o.estimatedMonthlySavings, 0);

  const toggleApplied = (id: string) => {
    setAppliedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cómputo Inactivo':
        return <Cpu className="w-4 h-4 text-sky-600" />;
      case 'Almacenamiento Huérfano':
        return <HardDrive className="w-4 h-4 text-amber-600" />;
      case 'Base de Datos':
        return <Database className="w-4 h-4 text-indigo-600" />;
      case 'Ajuste de Talla (Right-Sizing)':
        return <SlidersHorizontal className="w-4 h-4 text-emerald-600" />;
      default:
        return <Zap className="w-4 h-4 text-sky-600" />;
    }
  };

  const getImpactBadge = (impact: SavingsOpportunity['impactLevel']) => {
    switch (impact) {
      case 'Crítico':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Impacto Crítico</span>;
      case 'Alto':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Impacto Alto</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200">Impacto Medio</span>;
    }
  };

  const getEffortBadge = (effort: SavingsOpportunity['effort']) => {
    switch (effort) {
      case 'Bajo':
        return <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Esfuerzo Bajo (Rápido)</span>;
      case 'Medio':
        return <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Esfuerzo Medio</span>;
      default:
        return <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Esfuerzo Alto</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
      {/* Header & Total Summary Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <TrendingDown className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-display font-bold text-slate-900">
              Oportunidades de Ahorro Detectadas (Último Mes)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {opportunities.length} hallazgos
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Recomendaciones automatizadas de optimización de infraestructura y derechos de uso en OCI basadas en telemetría de consumo real.
          </p>
        </div>

        {/* Savings KPI Pill */}
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center gap-4 shrink-0">
          <div>
            <span className="text-[11px] text-emerald-800 font-semibold block uppercase tracking-wider">Ahorro Potencial Mensual</span>
            <span className="text-2xl font-display font-bold text-emerald-950 font-mono">
              {formatCurrency(totalPotentialSavings)}
              <span className="text-xs font-normal text-emerald-700"> / mes</span>
            </span>
          </div>
          <div className="pl-3 border-l border-emerald-200 text-right">
            <span className="text-[10px] text-slate-500 block">Simulado / Aplicado</span>
            <span className="text-sm font-bold text-emerald-900 font-mono">
              {formatCurrency(appliedSavings)}
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filtrar:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isApplied = appliedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                isApplied
                  ? 'bg-emerald-50/40 border-emerald-300'
                  : 'bg-slate-50/70 border-slate-200 hover:border-sky-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-white rounded-lg border border-slate-200/80 shadow-2xs">
                    {getCategoryIcon(item.category)}
                  </span>
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 font-medium">
                      {item.category} • {item.resourceCount} recurso(s)
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{item.title}</h4>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-display font-bold text-emerald-700 font-mono block">
                    +{formatCurrency(item.estimatedMonthlySavings)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">ahorro/mes</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                {item.description}
              </p>

              <div className="bg-sky-50/60 border border-sky-100 p-2.5 rounded-xl text-xs text-sky-950 flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-sky-900">Acción recomendada:</strong> {item.recommendation}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-2">
                  {getImpactBadge(item.impactLevel)}
                  {getEffortBadge(item.effort)}
                </div>

                <button
                  onClick={() => toggleApplied(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isApplied
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isApplied ? 'Ahorro Simulado' : 'Simular Ahorro'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsOpportunities;
