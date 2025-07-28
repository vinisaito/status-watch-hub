import { Alert } from "@/components/AlertsTable";

// Configure your AWS API Gateway endpoint here
const API_BASE_URL = "https://7nu1y7qzs1.execute-api.us-east-1.amazonaws.com/prod";

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface AlertsResponse {
  alerts: Alert[];
  total: number;
  acionados: number;
  naoAcionados: number;
}

class ApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`, // Se necessário
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private getAuthToken(): string {
    // Implemente sua lógica de autenticação aqui
    return localStorage.getItem('authToken') || '';
  }

  async getAlerts(filters?: any): Promise<AlertsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/dados`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const alerts: Alert[] = JSON.parse(data.body).map((item: any) => ({
        id: item.num_chamado,
        alerta: item.num_chamado,
        grupoExecutor: item.equipe,
        status: item.soluc_aplicada ? 'fechado' : 'aberto',
        abertura: item.dat_abertura,
        sumario: item.titulo,
        severidade: item.impacto || 'media',
        acionado: !!item.causado_pela_rdm
      }));

      return {
        alerts,
        total: alerts.length,
        acionados: alerts.filter(a => a.acionado).length,
        naoAcionados: alerts.filter(a => !a.acionado).length
      };
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async exportData(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/alerts/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  // Método para configurar WebSocket para alertas em tempo real
  subscribeToAlerts(onNewAlert: (alert: Alert) => void): WebSocket {
    const wsUrl = API_BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    const ws = new WebSocket(`${wsUrl}/alerts/subscribe`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_alert') {
          onNewAlert(data.alert);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return ws;
  }
}

export const apiService = new ApiService();

// Dados de exemplo para desenvolvimento (remover em produção)
export const mockAlerts: Alert[] = [
  {
    id: "1",
    alerta: "SV199817",
    grupoExecutor: "Suporte Network",
    status: "aberto",
    abertura: "2024-01-28T15:40:05Z",
    sumario: "DNACENTER - IC: APM1TGRDSW Regra: AP APM1TGRD01WIF disconnected from WLC",
    severidade: "critica",
    acionado: false
  },
  {
    id: "2", 
    alerta: "SV199818",
    grupoExecutor: "Infraestrutura",
    status: "fechado",
    abertura: "2024-01-28T14:30:22Z",
    sumario: "Servidor de aplicação com alta utilização de CPU",
    severidade: "alta",
    acionado: true
  },
  {
    id: "3",
    alerta: "SV199819", 
    grupoExecutor: "Network",
    status: "pendente",
    abertura: "2024-01-28T13:15:10Z",
    sumario: "Perda de conectividade entre switches principais",
    severidade: "critica",
    acionado: true
  },
  {
    id: "4",
    alerta: "SV199820",
    grupoExecutor: "Suporte",
    status: "aberto", 
    abertura: "2024-01-28T12:45:30Z",
    sumario: "Falha no backup automático do banco de dados",
    severidade: "media",
    acionado: false
  }
];