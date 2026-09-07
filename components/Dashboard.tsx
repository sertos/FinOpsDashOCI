import React from 'react';
import { FocusData } from '../types';
import KpiCard from './KpiCard';
import TimeSeriesChart from './TimeSeriesChart';
import StackedBarChart from './StackedBarChart';
import CostTreemap from './CostTreemap';
import HourlyHeatmap from './HourlyHeatmap';
import TopSpendersTable from './TopSpendersTable';
import RegionDonutChart from './RegionDonutChart';
import TagHygienePanel from './TagHygienePanel';
import ContractCredits from './ContractCredits';
import SavingsOpportunities from './SavingsOpportunities';
import { BookOpen, Sparkles, HelpCircle } from 'lucide-react';

interface DashboardProps {
  data: FocusData;
  onOpenGlossary?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onOpenGlossary }) => {
  const {
    kpis,
    dailySpend,
    spendByService,
    spendByApp,
    treemapData,
    hourlyHeatmapData,
    topSpenders,
    regionSpend,
    tagHygiene,
    contractCredits,
  } = data;

  const mtdVariation = kpis.lastMonthCost > 0 ? ((kpis.mtdCost - kpis.lastMonthCost) / kpis.lastMonthCost) * 100 : 0;
  const projectedVariation = kpis.previousMonthTotalCost > 0 ? ((kpis.projectedCost - kpis.previousMonthTotalCost) / kpis.previousMonthTotalCost) * 100 : 0;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Top Welcome / Glossary Quick Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-sky-700/50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs text-sky-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-white">
              Panel de Control FinOps para OCI (FOCUS v1.0)
            </h2>
            <p className="text-xs text-sky-100 font-normal">
              Visualización unificada de métricas de costo amortizado, proyecciones de gasto y compromisos contractuales Universal Credits.
            </p>
          </div>
        </div>

        {onOpenGlossary && (
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-sky-900 hover:bg-sky-50 text-xs font-bold transition-all shadow-md shrink-0 hover:scale-[1.02]"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Consultar Diccionario FinOps</span>
          </button>
        )}
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2">
          <KpiCard title="Costo Mes Actual (MTD)" value={kpis.mtdCost} format="currency" trend={mtdVariation} tooltip="Variación respecto al mismo periodo del mes anterior" />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2">
          <KpiCard title="Costo Mes Anterior" value={kpis.previousMonthTotalCost} format="currency" tooltip="Costo total de todo el mes calendario anterior" />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
          <KpiCard title="Proyección Fin de Mes" value={kpis.projectedCost} format="currency" trend={projectedVariation} tooltip="Proyección de costo frente al total del mes anterior" />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-6 xl:col-span-2">
          <KpiCard title="% Costo Sin Etiquetar" value={kpis.untaggedPercentage} format="percentage" tooltip="Porcentaje de costo de recursos sin la etiqueta 'OrgTags.app'" />
        </div>
        <div className="col-span-12 sm:col-span-12 lg:col-span-6 xl:col-span-3">
          <TagHygienePanel data={tagHygiene}/>
        </div>
      </div>

      {/* Contract Credits & Burn Simulator */}
      <ContractCredits data={contractCredits} />

      {/* Savings Opportunities Discovered in the Last Month */}
      <SavingsOpportunities opportunities={data.savingsOpportunities} />

      {/* Main Charts */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8">
          <TimeSeriesChart data={dailySpend} title="Gasto Diario (Mes Actual)" />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <RegionDonutChart data={regionSpend} title="Gasto por Región" />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <StackedBarChart data={spendByService} title="Top 5 Servicios por Costo" xAxisKey="name" barDataKey="value" />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <StackedBarChart data={spendByApp} title="Top 5 Aplicaciones por Costo" xAxisKey="name" barDataKey="value" />
        </div>
        
        <div className="col-span-12 xl:col-span-7">
          <CostTreemap data={treemapData} title="Desglose de Costos por Aplicación y Servicio" />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <HourlyHeatmap data={hourlyHeatmapData} title="Picos de Consumo por Hora (UTC)" />
        </div>

        <div className="col-span-12">
          <TopSpendersTable data={topSpenders} title="Top 20 Impulsores de Costo" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
