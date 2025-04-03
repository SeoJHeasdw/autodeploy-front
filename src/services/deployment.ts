// src/services/deployment.ts
import api from './api';

// 웹소켓 타입 정의
interface WebSocketService {
  subscribeToDeployment: (deploymentId: string) => void;
  unsubscribeFromDeployment: (deploymentId: string) => void;
  closeConnection: () => void;
}

// 배포 관련 타입 정의
interface DeploymentResponse {
  id: string;
  requirementId: string;
  status: string;
  overallProgress: number;
  currentStep: string;
  startTime: string;
  completedAt?: string;
  failedAt?: string;
  steps: any[];
  logs: string[];
  [key: string]: any;
}

interface WorkflowStatusResponse {
  requirement: 'pending' | 'in-progress' | 'completed' | 'failed';
  sourceCode: 'pending' | 'in-progress' | 'completed' | 'failed';
  cicd: 'pending' | 'in-progress' | 'completed' | 'failed';
  deployment: 'pending' | 'in-progress' | 'completed' | 'failed';
}

interface DeploymentStore {
  currentDeploymentId: string | null;
  deployments: Record<string, any>;
  updateDeploymentStatus: (deploymentId: string, status: any) => void;
}

// 배포 관련 API 서비스
export const deploymentService = {
  /**
   * 최신 배포 정보 가져오기
   */
  async getLatestDeployment(): Promise<DeploymentResponse> {
    try {
      const response = await api.get('/deployments/latest');
      return response.data;
    } catch (error) {
      console.error('최신 배포 정보를 가져오는데 실패했습니다:', error);
      throw error;
    }
  },
  
  /**
   * 특정 ID의 배포 정보 가져오기
   * @param {string} deploymentId - 배포 ID
   */
  async getDeploymentById(deploymentId: string): Promise<DeploymentResponse> {
    try {
      const response = await api.get(`/deployments/${deploymentId}`);
      return response.data;
    } catch (error) {
      console.error(`배포 ID ${deploymentId}의 정보를 가져오는데 실패했습니다:`, error);
      throw error;
    }
  },
  
  /**
   * 새 요구사항에 대한 배포 시작
   * @param {string} requirementId - 요구사항 ID
   */
  async startDeployment(requirementId: string): Promise<DeploymentResponse> {
    try {
      const response = await api.post('/deployments', { requirementId });
      return response.data;
    } catch (error) {
      console.error('배포를 시작하는데 실패했습니다:', error);
      throw error;
    }
  },
  
  /**
   * 진행 중인 배포 취소
   * @param {string} deploymentId - 배포 ID
   */
  async cancelDeployment(deploymentId: string): Promise<any> {
    try {
      const response = await api.post(`/deployments/${deploymentId}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`배포 ID ${deploymentId}를 취소하는데 실패했습니다:`, error);
      throw error;
    }
  },
  
  /**
   * 배포 상태 수동 폴링 (WebSocket이 없는 경우)
   * @param {string} deploymentId - 배포 ID
   */
  async pollDeploymentStatus(deploymentId: string): Promise<any> {
    try {
      const response = await api.get(`/deployments/${deploymentId}/status`);
      return response.data;
    } catch (error) {
      console.error(`배포 ID ${deploymentId}의 상태를 폴링하는데 실패했습니다:`, error);
      throw error;
    }
  },

  /**
   * 현재 워크플로우 단계 상태 가져오기
   * @param {string} deploymentId - 배포 ID
   * @returns {Object} 워크플로우 단계별 상태 객체
   */
  async getWorkflowStatus(deploymentId: string): Promise<WorkflowStatusResponse> {
    try {
      const response = await api.get(`/deployments/${deploymentId}/workflow`);
      return response.data;
    } catch (error) {
      console.error(`배포 ID ${deploymentId}의 워크플로우 상태를 가져오는데 실패했습니다:`, error);
      
      // API가 없는 경우 목업 데이터 반환 (개발용)
      return {
        requirement: 'completed',
        sourceCode: 'in-progress', 
        cicd: 'pending',
        deployment: 'pending'
      };
    }
  },
};

// WebSocket 서비스 설정 예시
export const setupDeploymentWebSocket = (store: DeploymentStore): WebSocketService => {
  // WebSocket 연결 설정
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${wsProtocol}//${window.location.host}/api/ws/deployments`;
  
  const socket = new WebSocket(wsUrl);
  
  socket.onopen = () => {
    console.log('WebSocket 연결이 성공적으로 열렸습니다');
    
    // 현재 활성화된 배포 ID가 있으면 해당 배포의 업데이트 구독
    if (store.currentDeploymentId) {
      socket.send(JSON.stringify({
        type: 'subscribe',
        deploymentId: store.currentDeploymentId
      }));
    }
  };
  
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      // 메시지 타입에 따른 처리
      switch (data.type) {
        case 'deployment_update':
          // 배포 상태 업데이트 처리
          store.updateDeploymentStatus(data.deploymentId, data.payload);
          break;
          
        case 'deployment_completed':
          // 배포 완료 처리
          store.updateDeploymentStatus(data.deploymentId, {
            status: 'completed',
            overallProgress: 100,
            completedAt: new Date().toISOString()
          });
          break;
          
        case 'deployment_failed':
          // 배포 실패 처리
          store.updateDeploymentStatus(data.deploymentId, {
            status: 'failed',
            error: data.error,
            failedAt: new Date().toISOString()
          });
          break;
          
        case 'deployment_step_update':
          // 개별 단계 업데이트 처리
          const deployment = store.deployments[data.deploymentId];
          if (deployment && deployment.steps) {
            const stepIndex = deployment.steps.findIndex((step: any) => step.id === data.stepId);
            if (stepIndex !== -1) {
              const updatedSteps = [...deployment.steps];
              updatedSteps[stepIndex] = {
                ...updatedSteps[stepIndex],
                ...data.payload
              };
              
              store.updateDeploymentStatus(data.deploymentId, {
                steps: updatedSteps
              });
            }
          }
          break;
          
        case 'log_update':
          // 로그 업데이트 처리
          const currentDeployment = store.deployments[data.deploymentId];
          if (currentDeployment) {
            const logs = currentDeployment.logs || [];
            store.updateDeploymentStatus(data.deploymentId, {
              logs: [...logs, data.logMessage]
            });
          }
          break;
      }
    } catch (error) {
      console.error('WebSocket 메시지 처리 중 오류 발생:', error);
    }
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket 오류:', error);
  };
  
  socket.onclose = () => {
    console.log('WebSocket 연결이 닫혔습니다');
    // 연결이 끊어지면 일정 시간 후 재연결 시도
    setTimeout(() => setupDeploymentWebSocket(store), 5000);
  };
  
  // WebSocket 서비스 관련 함수들 반환
  return {
    // 특정 배포 업데이트 구독
    subscribeToDeployment: (deploymentId: string) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'subscribe',
          deploymentId
        }));
      }
    },
    
    // 배포 구독 취소
    unsubscribeFromDeployment: (deploymentId: string) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'unsubscribe',
          deploymentId
        }));
      }
    },
    
    // WebSocket 연결 종료
    closeConnection: () => {
      socket.close();
    }
  };
};