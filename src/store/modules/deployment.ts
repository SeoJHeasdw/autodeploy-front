// src/store/modules/deployment.ts
import { defineStore } from 'pinia';
import mockService, { Deployment, WorkflowStatus } from '@/services/mockService';

interface DeploymentState {
  currentDeploymentId: string | null;
  deployments: Record<string, Deployment>;
  isLoading: boolean;
  error: string | null;
}

export const useDeploymentStore = defineStore('deployment', {
  state: (): DeploymentState => ({
    currentDeploymentId: null,
    deployments: {},
    isLoading: false,
    error: null,
  }),

  getters: {
    currentDeployment: (state): Deployment | null => {
      return state.currentDeploymentId ? state.deployments[state.currentDeploymentId] : null;
    },
    
    deploymentProgress: (state): number => {
      const deployment = state.currentDeploymentId ? state.deployments[state.currentDeploymentId] : null;
      if (!deployment) return 0;
      
      return deployment.overallProgress || 0;
    },
    
    isDeploymentCompleted: (state): boolean => {
      const deployment = state.currentDeploymentId ? state.deployments[state.currentDeploymentId] : null;
      if (!deployment) return false;
      
      return deployment.status === 'completed';
    },
    
    isDeploymentFailed: (state): boolean => {
      const deployment = state.currentDeploymentId ? state.deployments[state.currentDeploymentId] : null;
      if (!deployment) return false;
      
      return deployment.status === 'failed';
    },

    // 최근 배포 목록
    recentDeployments: (state): Deployment[] => {
      return Object.values(state.deployments)
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    },

    // 활성화된 배포 목록
    activeDeployments: (state): Deployment[] => {
      return Object.values(state.deployments)
        .filter(d => d.status === 'in-progress')
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    },

    // 완료된 배포 목록
    completedDeployments: (state): Deployment[] => {
      return Object.values(state.deployments)
        .filter(d => d.status === 'completed')
        .sort((a, b) => {
          const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
          const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
          return dateB - dateA;
        });
    },

    // 실패한 배포 목록
    failedDeployments: (state): Deployment[] => {
      return Object.values(state.deployments)
        .filter(d => d.status === 'failed')
        .sort((a, b) => {
          const dateA = a.failedAt ? new Date(a.failedAt).getTime() : 0;
          const dateB = b.failedAt ? new Date(b.failedAt).getTime() : 0;
          return dateB - dateA;
        });
    },
  },

  actions: {
    async fetchLatestDeployment() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const latestDeployment = await mockService.getLatestDeployment();
        
        if (latestDeployment) {
          this.currentDeploymentId = latestDeployment.id;
          this.deployments[latestDeployment.id] = latestDeployment;
        }
        
        return latestDeployment;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '배포 정보를 가져오는 중 오류가 발생했습니다.';
        console.error(this.error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async getDeploymentById(deploymentId: string) {
      if (this.deployments[deploymentId]) {
        this.currentDeploymentId = deploymentId;
        return this.deployments[deploymentId];
      }
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const deployment = await mockService.getDeploymentById(deploymentId);
        
        if (deployment) {
          this.currentDeploymentId = deployment.id;
          this.deployments[deployment.id] = deployment;
        }
        
        return deployment;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '배포 정보를 가져오는 중 오류가 발생했습니다.';
        console.error(this.error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async startDeployment(requirementId: string) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const newDeployment = await mockService.startDeployment(requirementId);
        
        if (newDeployment) {
          this.currentDeploymentId = newDeployment.id;
          this.deployments[newDeployment.id] = newDeployment;
        }
        
        return newDeployment;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '배포를 시작하는 중 오류가 발생했습니다.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // 배포 상태 업데이트
    updateDeploymentStatus(deploymentId: string, statusData: Partial<Deployment>) {
      if (this.deployments[deploymentId]) {
        this.deployments[deploymentId] = {
          ...this.deployments[deploymentId],
          ...statusData
        };
      }
    },
    
    // 배포 취소/중단
    async cancelDeployment(deploymentId: string) {
      try {
        await mockService.cancelDeployment(deploymentId);
        
        if (this.deployments[deploymentId]) {
          this.deployments[deploymentId].status = 'cancelled';
        }
        
        return true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '배포를 취소하는 중 오류가 발생했습니다.';
        throw error;
      }
    },

    /**
     * 워크플로우 상태 가져오기
     * @param {string} deploymentId - 배포 ID
     */
    async getWorkflowStatus(deploymentId: string): Promise<WorkflowStatus | null> {
      if (!deploymentId) return null;
      
      try {
        const workflowStatus = await mockService.getWorkflowStatus(deploymentId);
        return workflowStatus;
      } catch (error) {
        console.error('워크플로우 상태를 가져오는 중 오류 발생:', error);
        // 오류가 발생해도 기본 상태 반환
        return {
          requirement: 'completed',
          sourceCode: 'in-progress',
          cicd: 'pending',
          deployment: 'pending'
        };
      }
    },
    
    clearCurrentDeployment() {
      this.currentDeploymentId = null;
    },

    // 모의 데이터로 스토어 초기화 (데모용)
    async initWithMockData() {
      try {
        // 최신 배포 가져오기
        const latestDeployment = await this.fetchLatestDeployment();
        
        // 다른 배포 데이터도 미리 로드 (최소 3개)
        if (latestDeployment) {
          // ID를 순서대로 추정하여 몇 개 더 로드
          const baseName = latestDeployment.id.charAt(0);
          const baseNum = parseInt(latestDeployment.id.substring(1));
          
          // 이미 로드된 것 이외에 2개 더 로드
          for (let i = 1; i <= 2; i++) {
            const depId = `${baseName}${baseNum - i}`;
            if (!this.deployments[depId]) {
              try {
                await this.getDeploymentById(depId);
              } catch (e) {
                // 없는 ID면 무시
                console.log(`배포 ID ${depId}를 찾을 수 없습니다.`);
              }
            }
          }
        }
        
        return true;
      } catch (error) {
        console.error('모의 데이터 초기화 중 오류:', error);
        return false;
      }
    }
  }
});