import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileDown } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import FilterBar from "@/components/FilterBar";
import AlertsTable from "@/components/AlertsTable";
import ThemeToggle from "@/components/ThemeToggle";
import { useAlerts } from "@/hooks/useAlerts";

const Index = () => {
  const [filters, setFilters] = useState({
    alerta: "",
    grupoExecutor: "all",
    status: "all",
    sumario: "",
    severidade: "all",
    acionado: "all"
  });

  const { alerts, metrics, loading, refetch, playAlertSound } = useAlerts(filters);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = async () => {
    try {
      // Em produção, usar: await apiService.exportData('csv');
      console.log('Exportando dados...');
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel de acionamento - CIOps</h1>
            <p className="text-muted-foreground">Monitoramento de alertas em tempo real</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={playAlertSound} variant="outline">
              Testar Som
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard title="Total" value={metrics.total} variant="success" />
          <MetricCard title="Não acionados" value={metrics.naoAcionados} variant="danger" />
          <MetricCard title="Acionados" value={metrics.acionados} variant="warning" />
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {/* Export Section */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Período de abertura</h3>
              <p className="text-sm text-muted-foreground">30 jun/2025 - 30 jun/2025</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" className="gap-2">
                <FileDown className="h-4 w-4" />
                Exportar dados
              </Button>
              <Button onClick={refetch} variant="outline">
                Atualizar
              </Button>
            </div>
          </div>
        </Card>

        {/* Alerts Table */}
        <AlertsTable alerts={alerts} loading={loading} />
      </div>
    </div>
  );
};

export default Index;