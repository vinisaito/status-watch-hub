import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Alert {
  id: string;
  alerta: string;
  grupoExecutor: string;
  status: "aberto" | "fechado" | "pendente";
  abertura: string;
  sumario: string;
  severidade: "critica" | "alta" | "media" | "baixa";
  acionado: boolean;
}

interface AlertsTableProps {
  alerts: Alert[];
  loading?: boolean;
  webhookUrl?: string;
}

const AlertsTable = ({ alerts, loading, webhookUrl = "" }: AlertsTableProps) => {
  const [checkedAlerts, setCheckedAlerts] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const getStatusBadge = (status: Alert["status"]) => {
    const variants = {
      aberto: "bg-danger text-danger-foreground",
      fechado: "bg-success text-success-foreground",
      pendente: "bg-warning text-warning-foreground"
    };
    
    return <Badge className={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const getSeveridadeBadge = (severidade: Alert["severidade"]) => {
    const variants = {
      critica: "bg-danger text-danger-foreground",
      alta: "bg-warning text-warning-foreground",
      media: "bg-primary text-primary-foreground",
      baixa: "bg-success text-success-foreground"
    };
    
    return <Badge variant="outline" className={variants[severidade]}>{severidade.toUpperCase()}</Badge>;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const handleCheckboxChange = async (alertId: string, alert: Alert) => {
    if (checkedAlerts.has(alertId)) return; // Já foi marcado uma vez
    
    const newCheckedAlerts = new Set(checkedAlerts);
    newCheckedAlerts.add(alertId);
    setCheckedAlerts(newCheckedAlerts);

    // Enviar mensagem para Google Chat
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify({
            text: `🚨 Alerta Acionado!\n\n*Número:* ${alert.alerta}\n*Equipe:* ${alert.grupoExecutor}\n*Sumário:* ${alert.sumario}\n*Severidade:* ${alert.severidade.toUpperCase()}\n*Data:* ${formatDate(alert.abertura)}`
          }),
        });

        toast({
          title: "Sucesso!",
          description: "Alerta marcado e mensagem enviada para o Google Chat",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao enviar mensagem para o Google Chat",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Webhook não configurado",
        description: "Configure o webhook do Google Chat nas configurações",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Alerta</TableHead>
              <TableHead className="min-w-[200px]">Grupo Executor</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[150px]">Abertura</TableHead>
              <TableHead className="min-w-[250px]">Sumário</TableHead>
              <TableHead className="min-w-[120px]">Severidade</TableHead>
              <TableHead className="min-w-[100px]">Acionado</TableHead>
              <TableHead className="min-w-[100px]">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Nenhum alerta encontrado
                </TableCell>
              </TableRow>
            ) : (
              alerts.map((alert) => (
                <TableRow key={alert.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{alert.alerta}</TableCell>
                  <TableCell className="break-words">{alert.grupoExecutor}</TableCell>
                  <TableCell>{getStatusBadge(alert.status)}</TableCell>
                  <TableCell className="font-mono text-sm whitespace-nowrap">{formatDate(alert.abertura)}</TableCell>
                  <TableCell className="break-words max-w-xs" title={alert.sumario}>
                    {alert.sumario}
                  </TableCell>
                  <TableCell>{getSeveridadeBadge(alert.severidade)}</TableCell>
                  <TableCell>
                    <Badge variant={alert.acionado ? "default" : "secondary"}>
                      {alert.acionado ? "SIM" : "NÃO"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={checkedAlerts.has(alert.id)}
                      disabled={checkedAlerts.has(alert.id)}
                      onCheckedChange={() => handleCheckboxChange(alert.id, alert)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default AlertsTable;