import React, { useState } from 'react';
import { Search, X, BookOpen, Tag, HelpCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface GlossaryTerm {
  id: string;
  term: string;
  category: 'FinOps & FOCUS' | 'OCI & Créditos' | 'Métricas y Costos' | 'Optimización';
  shortDesc: string;
  definition: string;
  businessImpact: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'focus',
    term: 'FOCUS (Open Cost & Usage Specification)',
    category: 'FinOps & FOCUS',
    shortDesc: 'Estándar global de especificación de datos de costo cloud.',
    definition: 'Especificación abierta desarrollada por la FinOps Foundation para estandarizar la taxonomía, formato y nomenclaturas de informes de facturación multicloud (OCI, AWS, Azure, GCP).',
    businessImpact: 'Permite comparar costos entre nubes sin sesgo de proveedores y acelera la automatización de la gobernanza de TI.',
  },
  {
    id: 'amortized-cost',
    term: 'Costo Amortizado (Amortized Cost)',
    category: 'Métricas y Costos',
    shortDesc: 'Distribución uniforme de pagos por adelantado.',
    definition: 'Forma de imputación de costos que distribuye proporcionalmente los pagos iniciales de compromisos de contrato o tarifas fijas a lo largo de cada hora/día de uso efectivo.',
    businessImpact: 'Evita picos falsos en la contabilidad mensual y refleja el costo real de operación diario.',
  },
  {
    id: 'mtd',
    term: 'Month-to-Date (MTD)',
    category: 'Métricas y Costos',
    shortDesc: 'Gasto acumulado en el mes en curso.',
    definition: 'Métrica financiera que suma la totalidad de cargos en la cuenta cloud transcurridos desde las 00:00 UTC del primer día del mes hasta el momento actual.',
    businessImpact: 'Facilita la detección temprana de desvíos presupuestarios antes del cierre mensual.',
  },
  {
    id: 'burn-rate',
    term: 'Burn Rate (Tasa de Quemado)',
    category: 'OCI & Créditos',
    shortDesc: 'Velocidad diaria o mensual de consumo de créditos.',
    definition: 'Tasa promedio de consumo financiero por unidad de tiempo. En esquemas de créditos comprometidos, determina qué tan rápido se agotan los fondos prepagados.',
    businessImpact: 'Permite calcular la fecha proyectada de agotamiento (Runout Date) de las bolsas de crédito contractuales.',
  },
  {
    id: 'ucc',
    term: 'Universal Credits (UCC)',
    category: 'OCI & Créditos',
    shortDesc: 'Modelo de crédito prepago flexible de Oracle Cloud.',
    definition: 'Esquema de contratación contractual de OCI que otorga flexibilidad para usar cualquier servicio elegible con precios descontados basados en un compromiso de gasto anual.',
    businessImpact: 'Maximiza los descuentos comerciales manteniendo la libertad de migrar o desplegar nuevas arquitecturas.',
  },
  {
    id: 'expiration-date',
    term: 'Fecha de Vencimiento de Créditos',
    category: 'OCI & Créditos',
    shortDesc: 'Cláusula contractual de caducidad de saldo.',
    definition: 'Fecha límite fijada en el contrato de crédito anual. Si los créditos no son consumidos antes de dicha fecha, expirarán sin reembolso ni prórroga.',
    businessImpact: 'Un seguimiento deficiente provoca la pérdida de créditos prepagados ("unclaimed value").',
  },
  {
    id: 'tag-hygiene',
    term: 'Higiene de Etiquetas (Tag Hygiene)',
    category: 'Optimización',
    shortDesc: 'Grado de cobertura y precisión en metaetiquetas de recursos.',
    definition: 'Métrica de calidad que mide el porcentaje de infraestructura asignada correctamente con etiquetas estandarizadas (ej. Centro de Costos, Aplicación, Entorno).',
    businessImpact: 'Una baja higiene impide atribuir costos a los dueños del negocio y genera facturación sin responsable ("Untagged Cost").',
  },
  {
    id: 'unit-economics',
    term: 'Economía Unitaria (Unit Economics)',
    category: 'FinOps & FOCUS',
    shortDesc: 'Relación del costo de nube con métricas del negocio.',
    definition: 'Metodología FinOps que evalúa el costo de la infraestructura cloud por unidad de valor de negocio (ej. Costo cloud por transacción procesada o por usuario activo).',
    businessImpact: 'Demuestra si el gasto cloud escala eficientemente con el crecimiento de la facturación de la empresa.',
  },
  {
    id: 'right-sizing',
    term: 'Ajuste de Capacidad (Right-Sizing)',
    category: 'Optimización',
    shortDesc: 'Dimensionamiento óptimo de CPUs y Memoria.',
    definition: 'Proceso de análisis de métricas de desempeño para reducir o adaptar la capacidad de cómputo y almacenamiento al nivel mínimo necesario garantizando SLA.',
    businessImpact: 'Reduce directamente la facturación sin perjudicar el rendimiento de las aplicaciones.',
  },
  {
    id: 'compartment',
    term: 'Compartimento (Compartment)',
    category: 'OCI & Créditos',
    shortDesc: 'Límite lógico de organización y presupuestos en OCI.',
    definition: 'Contenedor lógico en OCI para agrupar recursos relacionados, aplicar políticas de seguridad IAM e aislar reportes presupuestarios por departamento.',
    businessImpact: 'Estructura clave para la distribución presupuestaria y gobernanza en grandes corporativos.',
  },
];

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  if (!isOpen) return null;

  const categories = ['Todos', 'FinOps & FOCUS', 'OCI & Créditos', 'Métricas y Costos', 'Optimización'];

  const filteredTerms = GLOSSARY_TERMS.filter((t) => {
    const matchesSearch =
      t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.shortDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">Diccionario Técnico-Financiero FinOps</h2>
              <p className="text-xs text-slate-500 font-medium">Glosario de conceptos clave de costos en la nube, OCI y FOCUS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-6 border-b border-slate-100 bg-white space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar término, concepto o palabra clave (ej. FOCUS, Amortizado, UCC)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Terms List */}
        <div className="p-6 overflow-y-auto space-y-4 grow bg-slate-50/50">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">No se encontraron conceptos</p>
              <p className="text-xs text-slate-400">Intenta buscar con otros términos o cambia la categoría.</p>
            </div>
          ) : (
            filteredTerms.map((term) => (
              <div
                key={term.id}
                className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-sky-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
                    {term.term}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60 shrink-0">
                    {term.category}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-3">{term.shortDesc}</p>
                <div className="text-xs text-slate-700 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p><span className="font-semibold text-slate-900">Definición:</span> {term.definition}</p>
                  <p className="text-slate-600">
                    <span className="font-semibold text-sky-800">Impacto en Negocio:</span> {term.businessImpact}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basado en las mejores prácticas de FinOps Foundation y especificación OCI FOCUS v1.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlossaryModal;
