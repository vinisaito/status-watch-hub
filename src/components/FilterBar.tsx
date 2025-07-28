import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FilterBarProps {
  filters: {
    alerta: string;
    grupoExecutor: string;
    status: string;
    sumario: string;
    severidade: string;
    acionado: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 p-4 bg-card rounded-lg border">
      <div className="space-y-2">
        <Label htmlFor="alerta">Alerta</Label>
        <Input
          id="alerta"
          placeholder="Filtrar por alerta"
          value={filters.alerta}
          onChange={(e) => onFilterChange("alerta", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="grupoExecutor">Grupo Executor</Label>
        <Select value={filters.grupoExecutor} onValueChange={(value) => onFilterChange("grupoExecutor", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar grupo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="suporte">Suporte</SelectItem>
            <SelectItem value="network">Network</SelectItem>
            <SelectItem value="infra">Infraestrutura</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={filters.status} onValueChange={(value) => onFilterChange("status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="aberto">Aberto</SelectItem>
            <SelectItem value="fechado">Fechado</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sumario">Sumário</Label>
        <Input
          id="sumario"
          placeholder="Filtrar por sumário"
          value={filters.sumario}
          onChange={(e) => onFilterChange("sumario", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="severidade">Severidade</Label>
        <Select value={filters.severidade} onValueChange={(value) => onFilterChange("severidade", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar severidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="critica">Crítica</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="acionado">Acionado</Label>
        <Select value={filters.acionado} onValueChange={(value) => onFilterChange("acionado", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar acionamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="sim">Sim</SelectItem>
            <SelectItem value="nao">Não</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;