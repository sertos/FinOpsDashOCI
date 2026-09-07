import React, { useState } from 'react';
import { useFinOpsData } from './hooks/useFinOpsData';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Loader from './components/Loader';
import GlossaryModal from './components/GlossaryModal';

const App: React.FC = () => {
  const { data, loading, error, lastUpdated } = useFinOpsData();
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);

  const renderContent = () => {
    if (loading && !data) {
      return <Loader message="Analizando reportes de costos por primera vez... esto puede tomar un momento." />;
    }
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[60vh] text-rose-600">
          <div className="text-center p-6 bg-white border border-rose-200 rounded-2xl shadow-sm">
            <h2 className="text-xl font-display font-bold mb-2">Error obteniendo datos</h2>
            <p className="text-sm text-slate-600">{error}</p>
          </div>
        </div>
      );
    }
    if (data) {
      return <Dashboard data={data} onOpenGlossary={() => setIsGlossaryOpen(true)} />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-sky-500/20">
      <Header
        lastUpdated={lastUpdated}
        loading={loading}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-[1700px] mx-auto">
        {renderContent()}
      </main>

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
};

export default App;
