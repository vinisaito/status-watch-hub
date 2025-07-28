import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
}

const AlertsTable = ({ alerts, loading }: AlertsTableProps) => {
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
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