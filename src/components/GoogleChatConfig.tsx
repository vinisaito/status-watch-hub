import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

interface WebhookConfig {
  grupoExecutor: string;
  webhookUrl: string;
}

interface GoogleChatConfigProps {
  webhookConfigs: WebhookConfig[];
  onWebhookConfigsChange: (configs: WebhookConfig[]) => void;
  availableGroups: string[];
}

const GoogleChatConfig = ({ webhookConfigs, onWebhookConfigsChange, availableGroups }: GoogleChatConfigProps) => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const { toast } = useToast();

  const handleAddWebhook = () => {
    if (!selectedGroup || !webhookUrl) {
      toast({
        title: "Erro",
        description: "Selecione um grupo executor e insira a URL do webhook",
        variant: "destructive",
      });
      return;
    }

    const existingConfigIndex = webhookConfigs.findIndex(config => config.grupoExecutor === selectedGroup);
    
    if (existingConfigIndex >= 0) {
      // Atualizar configuração existente
      const updatedConfigs = [...webhookConfigs];
      updatedConfigs[existingConfigIndex] = { grupoExecutor: selectedGroup, webhookUrl };
      onWebhookConfigsChange(updatedConfigs);
    } else {
      // Adicionar nova configuração
      onWebhookConfigsChange([...webhookConfigs, { grupoExecutor: selectedGroup, webhookUrl }]);
    }

    setSelectedGroup("");
    setWebhookUrl("");
    toast({
      title: "Sucesso!",
      description: "Webhook configurado com sucesso",
    });
  };

  const handleRemoveWebhook = (grupoExecutor: string) => {
    const updatedConfigs = webhookConfigs.filter(config => config.grupoExecutor !== grupoExecutor);
    onWebhookConfigsChange(updatedConfigs);
    toast({
      title: "Removido",
      description: "Webhook removido com sucesso",
    });
  };

  const availableGroupsToAdd = availableGroups.filter(
    group => !webhookConfigs.some(config => config.grupoExecutor === group)
  );

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Configuração de Webhooks por Grupo Executor</h3>
      
      {/* Formulário para adicionar/editar webhook */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label>Grupo Executor</Label>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um grupo" />
            </SelectTrigger>
            <SelectContent>
              {availableGroupsToAdd.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
              {webhookConfigs.map((config) => (
                <SelectItem key={config.grupoExecutor} value={config.grupoExecutor}>
                  {config.grupoExecutor} (editar)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>URL do Webhook</Label>
          <Input
            placeholder="https://chat.googleapis.com/v1/spaces/..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>&nbsp;</Label>
          <Button onClick={handleAddWebhook} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            {webhookConfigs.some(config => config.grupoExecutor === selectedGroup) ? "Atualizar" : "Adicionar"}
          </Button>
        </div>
      </div>

      {/* Lista de webhooks configurados */}
      {webhookConfigs.length > 0 && (
        <div className="space-y-2">
          <Label>Webhooks Configurados:</Label>
          <div className="space-y-2">
            {webhookConfigs.map((config) => (
              <div key={config.grupoExecutor} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex-1">
                  <span className="font-medium">{config.grupoExecutor}</span>
                  <p className="text-xs text-muted-foreground truncate">{config.webhookUrl}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveWebhook(config.grupoExecutor)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="text-sm text-muted-foreground space-y-2">
        <p><strong>Como configurar:</strong></p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Acesse o Google Chat no navegador</li>
          <li>Vá para o espaço onde deseja receber as mensagens do grupo específico</li>
          <li>Clique nos três pontos (...) ao lado do nome do espaço</li>
          <li>Selecione "Configurações do aplicativo"</li>
          <li>Clique em "Webhook" e depois em "Adicionar webhook"</li>
          <li>Digite um nome para o webhook (ex: "Alertas [Nome do Grupo]")</li>
          <li>Cole a URL gerada no campo acima para o grupo correspondente</li>
        </ol>
        <p className="mt-2"><strong>Mensagem enviada:</strong> Quando um checkbox for marcado, a mensagem será enviada para o webhook específico do grupo executor do alerta.</p>
      </div>
    </Card>
  );
};

export default GoogleChatConfig;