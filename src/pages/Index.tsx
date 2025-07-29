import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileDown, Settings } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import FilterBar from "@/components/FilterBar";
import AlertsTable from "@/components/AlertsTable";
import ThemeToggle from "@/components/ThemeToggle";
import DateFilter from "@/components/DateFilter";
import GoogleChatConfig from "@/components/GoogleChatConfig";
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

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [webhookConfigs, setWebhookConfigs] = useState<{grupoExecutor: string; webhookUrl: string}[]>([]);

  const { alerts, metrics, loading, refetch, playAlertSound } = useAlerts(filters);

  // Extrair grupos únicos dos alertas para a configuração
  const availableGroups = Array.from(new Set(alerts.map(alert => alert.grupoExecutor).filter(Boolean)));

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCardClick = (type: 'total' | 'acionados' | 'naoAcionados') => {
    if (type === 'total') {
      setFilters(prev => ({ ...prev, acionado: 'all' }));
    } else if (type === 'acionados') {
      setFilters(prev => ({ ...prev, acionado: 'sim' }));
    } else if (type === 'naoAcionados') {
      setFilters(prev => ({ ...prev, acionado: 'nao' }));
    }
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
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-foreground">Painel de acionamento - CIOps</h1>
            <p className="text-muted-foreground">Monitoramento de alertas em tempo real</p>
          </div>
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Configurações
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Configurações do Google Chat</DialogTitle>
                </DialogHeader>
                <GoogleChatConfig 
                  webhookConfigs={webhookConfigs}
                  onWebhookConfigsChange={setWebhookConfigs}
                  availableGroups={availableGroups}
                />
              </DialogContent>
            </Dialog>
            <Button onClick={playAlertSound} variant="outline">
              Testar Som
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            title="Total" 
            value={metrics.total} 
            variant="success" 
            onClick={() => handleCardClick('total')}
          />
          <MetricCard 
            title="Não acionados" 
            value={metrics.naoAcionados} 
            variant="danger" 
            onClick={() => handleCardClick('naoAcionados')}
          />
          <MetricCard 
            title="Acionados" 
            value={metrics.acionados} 
            variant="warning" 
            onClick={() => handleCardClick('acionados')}
          />
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {/* Export Section */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between bg-muted/50 p-3 rounded-lg shadow-sm">
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
              <FileDown className="h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={refetch} variant="outline" size="sm">
              Atualizar
            </Button>
          </div>
        </div>

        {/* Alerts Table */}
        <AlertsTable alerts={alerts} loading={loading} webhookConfigs={webhookConfigs} />
      </div>
    </div>
  );
};

export default Index;