import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface GoogleChatConfigProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
}

const GoogleChatConfig = ({ webhookUrl, onWebhookUrlChange }: GoogleChatConfigProps) => {
  const [localUrl, setLocalUrl] = useState(webhookUrl);
  const { toast } = useToast();

  const handleSave = () => {
    onWebhookUrlChange(localUrl);
    toast({
      title: "Configuração salva!",
      description: "Webhook do Google Chat configurado com sucesso",
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="webhook-url">URL do Webhook do Google Chat</Label>
        <Input
          id="webhook-url"
          placeholder="https://chat.googleapis.com/v1/spaces/..."
          value={localUrl}
          onChange={(e) => setLocalUrl(e.target.value)}
        />
      </div>
      <Button onClick={handleSave} className="w-full">
        Salvar Configuração
      </Button>
      
      <div className="text-sm text-muted-foreground space-y-2">
        <p><strong>Como configurar:</strong></p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Acesse o Google Chat no navegador</li>
          <li>Vá para o espaço onde deseja receber as mensagens</li>
          <li>Clique nos três pontos (...) ao lado do nome do espaço</li>
          <li>Selecione "Configurações do aplicativo"</li>
          <li>Clique em "Webhook" e depois em "Adicionar webhook"</li>
          <li>Digite um nome para o webhook (ex: "Alertas CIOps")</li>
          <li>Cole a URL gerada aqui neste campo</li>
        </ol>
        <p className="mt-2"><strong>Mensagem enviada:</strong> Quando um checkbox for marcado, será enviada uma mensagem formatada com os detalhes do alerta.</p>
      </div>
    </Card>
  );
};

export default GoogleChatConfig;