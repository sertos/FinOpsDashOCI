import { useState, useEffect, useCallback } from 'react';
import { fetchOciCostData } from '../services/mockOciService';
import { FocusDataRow, FocusData, KpiMetrics, ChartDataPoint, ContractCreditsData, CostCenterContract } from '../types';
import {
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  getDate,
  subMonths,
  isSameDay,
  getYear,
  startOfYear,
} from 'date-fns';

const REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

export const useFinOpsData = () => {
  const [data, setData] = useState<FocusData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const processData = useCallback((rows: FocusDataRow[]): FocusData => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));
    const dayOfMonth = getDate(now);
    const daysInCurrentMonth = getDaysInMonth(now);

    const currentMonthRows = rows.filter(
      (r) => r.timestamp >= currentMonthStart && r.timestamp <= currentMonthEnd
    );
    const lastMonthRows = rows.filter(
      (r) => r.timestamp >= lastMonthStart && r.timestamp <= lastMonthEnd
    );
    
    // --- KPIs ---
    const mtdCost = currentMonthRows.reduce((acc, row) => acc + row.cost, 0);
    const costUntilSameDayLastMonth = lastMonthRows
      .filter(r => getDate(r.timestamp) <= dayOfMonth)
      .reduce((acc, row) => acc + row.cost, 0);

    const previousMonthTotalCost = lastMonthRows.reduce((acc, row) => acc + row.cost, 0);

    const projectedCost = (mtdCost / dayOfMonth) * daysInCurrentMonth;
    
    const untaggedCost = currentMonthRows
        .filter(r => !r.appTag || r.appTag === 'untagged')
        .reduce((acc, r) => acc + r.cost, 0);
    const untaggedPercentage = mtdCost > 0 ? (untaggedCost / mtdCost) * 100 : 0;

    const kpis: KpiMetrics = {
        mtdCost,
        projectedCost,
        lastMonthCost: costUntilSameDayLastMonth,
        previousMonthTotalCost,
        untaggedPercentage,
    };

    // --- Daily Spend ---
    const dailySpendMap = new Map<string, number>();
    for (const row of currentMonthRows) {
        const day = row.timestamp.toISOString().split('T')[0];
        dailySpendMap.set(day, (dailySpendMap.get(day) || 0) + row.cost);
    }
    const dailySpend: ChartDataPoint[] = Array.from(dailySpendMap.entries())
        .map(([name, value]) => ({ name: name.substring(5), value }))
        .sort((a,b) => a.name.localeCompare(b.name));

    // --- Spend by Service / App ---
    const createTop5SpendChart = (key: 'service' | 'appTag'): ChartDataPoint[] => {
      const spendMap = new Map<string, number>();
      currentMonthRows.forEach(row => {
        const name = (key === 'appTag' ? row.appTag : row.service) || 'untagged';
        spendMap.set(name, (spendMap.get(name) || 0) + row.cost);
      });
      return Array.from(spendMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));
    };
    const spendByService = createTop5SpendChart('service');
    const spendByApp = createTop5SpendChart('appTag');

    // --- Treemap Data ---
    const appServiceMap = new Map<string, { total: number; children: Map<string, number> }>();
    currentMonthRows.forEach(row => {
      const app = row.appTag || 'untagged';
      const service = row.service;
      if (!appServiceMap.has(app)) {
        appServiceMap.set(app, { total: 0, children: new Map() });
      }
      const appData = appServiceMap.get(app)!;
      appData.total += row.cost;
      appData.children.set(service, (appData.children.get(service) || 0) + row.cost);
    });
    const treemapData = Array.from(appServiceMap.entries()).map(([name, data]) => ({
      name,
      size: data.total,
      children: Array.from(data.children.entries()).map(([childName, childSize]) => ({
        name: childName,
        size: childSize,
      })),
    }));

    // --- Hourly Heatmap ---
    const hourlySpendMap = new Map<string, number[]>(); // Key: YYYY-MM-DD, Value: array of 24 hours
    currentMonthRows.forEach(row => {
        const dayKey = row.timestamp.toISOString().split('T')[0];
        const hour = row.timestamp.getUTCHours();
        if(!hourlySpendMap.has(dayKey)) hourlySpendMap.set(dayKey, Array(24).fill(0));
        hourlySpendMap.get(dayKey)![hour] += row.cost;
    });

    const heatmapDays = Array.from(hourlySpendMap.keys()).sort().slice(-7); // Last 7 days
    const hourlyHeatmapData = Array.from({length: 24}, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return {
            hour: `${hour}:00`,
            days: heatmapDays.map(day => ({
                day: day.substring(5),
                value: hourlySpendMap.get(day)![i]
            }))
        }
    });

    // --- Top Spenders ---
    const topSpenders = [...spendByApp, ...spendByService]
        .map(item => ({...item, type: spendByApp.includes(item) ? 'App' : 'Service'}))
        .sort((a,b) => b.value - a.value)
        .slice(0, 20)
        .map(item => ({ name: item.name, cost: item.value, type: item.type as 'App' | 'Service' }));

    // --- Region Spend ---
    const regionMap = new Map<string, number>();
    currentMonthRows.forEach(row => {
        regionMap.set(row.region, (regionMap.get(row.region) || 0) + row.cost);
    });
    const regionSpend: ChartDataPoint[] = Array.from(regionMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a,b) => b.value - a.value);

    // --- Tag Hygiene ---
    const taggedCost = currentMonthRows
        .filter(r => r.appTag && r.appTag !== 'untagged')
        .reduce((acc, r) => acc + r.cost, 0);
    const tagHygiene = { tagged: taggedCost, untagged: untaggedCost };

    // --- Contract Credits & Simulation ---
    const currentYear = getYear(now);
    const currentYearStart = startOfYear(now);
    const contractYears = [currentYear, currentYear + 1, currentYear + 2];
    const allocations = {
        'Acme Corp': [1200000, 1300000, 1400000],
        'Globex': [800000, 900000, 1000000]
    };

    const currentYearRows = rows.filter(r => r.timestamp >= currentYearStart);
    const consumptionByCostCenter = new Map<string, number>();
    currentYearRows.forEach(row => {
        const cc = row.costCenterTag;
        if (cc) {
            consumptionByCostCenter.set(cc, (consumptionByCostCenter.get(cc) || 0) + row.cost);
        }
    });
    
    const costCenters: CostCenterContract[] = [
        { name: 'Acme Corp', displayName: 'Acme Corp (Enterprise)' },
        { name: 'Globex', displayName: 'Globex (Subsidiary)' }
    ].map(cc => ({
        ...cc,
        years: contractYears.map((year, index) => ({
            year: year,
            allocated: allocations[cc.name as keyof typeof allocations][index],
            consumed: year === currentYear ? (consumptionByCostCenter.get(cc.name) || 0) : 0,
        }))
    }));

    const acmeConsumed = consumptionByCostCenter.get('Acme Corp') || 385000;
    const globexConsumed = consumptionByCostCenter.get('Globex') || 240000;
    const totalConsumed = acmeConsumed + globexConsumed;
    const totalCommitment = 2000000; // $2M Annual Commitment
    const dailyBurnRate = dayOfMonth > 0 ? mtdCost / dayOfMonth : 4500;

    const tranches = [
      {
        id: 'TR-01',
        name: 'Tranche Cómputo e Infraestructura Principal',
        entity: 'Acme Corp',
        allocated: 1200000,
        consumed: Math.round(acmeConsumed * 1.8),
        expirationDate: '2026-12-31',
        daysToExpiration: 152,
        status: 'optimal' as const,
        discountPercentage: 32,
      },
      {
        id: 'TR-02',
        name: 'Tranche Base de Datos & Analytics',
        entity: 'Globex',
        allocated: 800000,
        consumed: Math.round(globexConsumed * 1.2),
        expirationDate: '2026-10-31',
        daysToExpiration: 91,
        status: 'warning_underuse' as const,
        discountPercentage: 28,
      },
      {
        id: 'TR-03',
        name: 'Bolsa Promocional Innovación AI/ML',
        entity: 'Acme Corp',
        allocated: 150000,
        consumed: 142500,
        expirationDate: '2026-08-31',
        daysToExpiration: 30,
        status: 'warning_expiring' as const,
        discountPercentage: 45,
      }
    ];
    
    const contractCredits: ContractCreditsData = {
        contractId: 'OCI-UCC-2025-99842',
        startDate: '2025-01-01',
        endDate: '2027-12-31',
        totalCommitment,
        totalConsumed,
        dailyBurnRate,
        costCenters,
        currentYear,
        tranches,
    };


    const savingsOpportunities: SavingsOpportunity[] = [
      {
        id: 'SAV-01',
        title: 'Instancias de Cómputo OCI Inactivas (<2% CPU)',
        category: 'Cómputo Inactivo',
        estimatedMonthlySavings: 4200,
        resourceCount: 7,
        effort: 'Bajo',
        description: '7 instancias VM.Standard2.4 en compartimentos de pruebas sin actividad significativa en los últimos 14 días.',
        recommendation: 'Detener o programar auto-shutdown fuera de horario laboral mediante OCI CLI/Terraform.',
        impactLevel: 'Alto',
      },
      {
        id: 'SAV-02',
        title: 'Volúmenes de Bloque Huérfanos (Desasociados)',
        category: 'Almacenamiento Huérfano',
        estimatedMonthlySavings: 1850,
        resourceCount: 14,
        effort: 'Bajo',
        description: 'Volúmenes OCI Block Storage (VPUs ultra) que no están conectados a ninguna máquina virtual activa.',
        recommendation: 'Crear respaldos finales en OCI Object Storage de bajo costo y eliminar los volúmenes de bloque no utilizados.',
        impactLevel: 'Medio',
      },
      {
        id: 'SAV-03',
        title: 'Ajuste de Forma OCI VM.Standard.Flex (Right-Sizing)',
        category: 'Ajuste de Talla (Right-Sizing)',
        estimatedMonthlySavings: 6400,
        resourceCount: 12,
        effort: 'Medio',
        description: 'Servidores de producción con consumo promedio de RAM y OCPU menor al 25% de la capacidad asignada.',
        recommendation: 'Reducir de 16 OCPUs a 8 OCPUs aprovechando la flexibilidad dinámica sin interrupción de VM.Standard.Flex.',
        impactLevel: 'Crítico',
      },
      {
        id: 'SAV-04',
        title: 'Optimización de OCPU Auto-scaling en Autonomous DB',
        category: 'Base de Datos',
        estimatedMonthlySavings: 3900,
        resourceCount: 3,
        effort: 'Bajo',
        description: 'Bases de datos Autonomous Data Warehouse con límites fijos de OCPU durante fines de semana de baja carga.',
        recommendation: 'Habilitar el autoescalado de OCPU para pagar solo por los núcleos consumidos durante horas pico.',
        impactLevel: 'Alto',
      },
      {
        id: 'SAV-05',
        title: 'Migración a OCI Object Storage Infrequent Access',
        category: 'Almacenamiento Huérfano',
        estimatedMonthlySavings: 1100,
        resourceCount: 45,
        effort: 'Bajo',
        description: 'Archivos de logs e imágenes que no han sido leídos en más de 60 días permanecen en la clase Standard.',
        recommendation: 'Configurar Reglas de Ciclo de Vida (Lifecycle Rules) para transicionar objetos a la clase Archive/Infrequent.',
        impactLevel: 'Medio',
      },
    ];

    return {
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
      savingsOpportunities,
    };
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rawData = await fetchOciCostData();
      const processed = processData(rawData);
      setData(processed);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch or process OCI cost data. Please check the mock service.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [processData]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  return { data, loading, error, lastUpdated };
};
