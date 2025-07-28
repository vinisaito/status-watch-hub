import { useState, useEffect, useCallback, useRef } from "react";
import { Alert } from "@/components/AlertsTable";
import { apiService, mockAlerts, AlertsResponse } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";

interface UseAlertsReturn {
  alerts: Alert[];
  metrics: {
    total: number;
    acionados: number;
    naoAcionados: number;
  };
  loading: boolean;
  error: string | null;
  refetch: () => void;
  playAlertSound: () => void;
}

export const useAlerts = (filters: any) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    acionados: 0,
    naoAcionados: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const wsRef = useRef<WebSocket | null>(null);
  const playAlertSoundRef = useRef<(() => void) | null>(null);

  // Inicializar áudio para alertas
  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    playAlertSoundRef.current = () => {
      const duration = 0.5;
      const frequency = 800;
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };
  }, []);

  const playAlertSound = useCallback(() => {
    if (playAlertSoundRef.current) {
      try {
        playAlertSoundRef.current();
      } catch (error) {
        console.error('Erro ao reproduzir som de alerta:', error);
      }
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Em produção, use: const response = await apiService.getAlerts(filters);
      // Para desenvolvimento, usando dados mock:
      const response: AlertsResponse = {
        alerts: mockAlerts.filter(alert => {
          if (filters.alerta && !alert.alerta.toLowerCase().includes(filters.alerta.toLowerCase())) return false;
          if (filters.grupoExecutor && filters.grupoExecutor !== 'all' && !alert.grupoExecutor.toLowerCase().includes(filters.grupoExecutor.toLowerCase())) return false;
          if (filters.status && filters.status !== 'all' && alert.status !== filters.status) return false;
          if (filters.sumario && !alert.sumario.toLowerCase().includes(filters.sumario.toLowerCase())) return false;
          if (filters.severidade && filters.severidade !== 'all' && alert.severidade !== filters.severidade) return false;
          if (filters.acionado && filters.acionado !== 'all') {
            const acionadoFilter = filters.acionado === 'sim';
            if (alert.acionado !== acionadoFilter) return false;
          }
          return true;
        }),
        total: mockAlerts.length,
        acionados: mockAlerts.filter(a => a.acionado).length,
        naoAcionados: mockAlerts.filter(a => !a.acionado).length
      };

      setAlerts(response.alerts);
      setMetrics({
        total: response.total,
        acionados: response.acionados,
        naoAcionados: response.naoAcionados
      });
    } catch (err) {
      setError('Erro ao carregar alertas');
      console.error('Erro ao buscar alertas:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Configurar WebSocket para alertas em tempo real
  useEffect(() => {
    // Em produção, descomente a linha abaixo:
    // wsRef.current = apiService.subscribeToAlerts(handleNewAlert);

    const handleNewAlert = (newAlert: Alert) => {
      setAlerts(prev => [newAlert, ...prev]);
      setMetrics(prev => ({
        total: prev.total + 1,
        acionados: newAlert.acionado ? prev.acionados + 1 : prev.acionados,
        naoAcionados: newAlert.acionado ? prev.naoAcionados : prev.naoAcionados + 1
      }));
      
      playAlertSound();
      
      toast({
        title: "Novo Alerta!",
        description: `${newAlert.alerta}: ${newAlert.sumario}`,
        variant: "destructive",
      });
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [playAlertSound, toast]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    alerts,
    metrics,
    loading,
    error,
    refetch: fetchAlerts,
    playAlertSound
  };
};