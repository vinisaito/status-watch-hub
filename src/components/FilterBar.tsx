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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-3 bg-card rounded-lg border shadow-md">
      <div className="space-y-1">
        <Label htmlFor="alerta" className="text-xs">Alerta</Label>
        <Input
          id="alerta"
          placeholder="Filtrar..."
          className="h-8 text-sm"
          value={filters.alerta}
          onChange={(e) => onFilterChange("alerta", e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="grupoExecutor" className="text-xs">Grupo</Label>
        <Select value={filters.grupoExecutor} onValueChange={(value) => onFilterChange("grupoExecutor", value)}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="suporte">Suporte</SelectItem>
            <SelectItem value="network">Network</SelectItem>
            <SelectItem value="infra">Infraestrutura</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="status" className="text-xs">Status</Label>
        <Select value={filters.status} onValueChange={(value) => onFilterChange("status", value)}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="aberto">Aberto</SelectItem>
            <SelectItem value="fechado">Fechado</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="sumario" className="text-xs">Sumário</Label>
        <Input
          id="sumario"
          placeholder="Filtrar..."
          className="h-8 text-sm"
          value={filters.sumario}
          onChange={(e) => onFilterChange("sumario", e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="severidade" className="text-xs">Severidade</Label>
        <Select value={filters.severidade} onValueChange={(value) => onFilterChange("severidade", value)}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Todas" />
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

      <div className="space-y-1">
        <Label htmlFor="acionado" className="text-xs">Acionado</Label>
        <Select value={filters.acionado} onValueChange={(value) => onFilterChange("acionado", value)}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Todos" />
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