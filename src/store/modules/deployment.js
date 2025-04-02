// src/store/modules/deployment.js
import { defineStore } from 'pinia';
import { deploymentService } from '@/services/deployment';

export const useDeploymentStore = defineStore('deployment', {
  state: () => ({
    currentDeploymentId: null,
    deployments: {},
    isLoading: false,
    error: null,
  }),

  getters: {
    currentDeployment: (state) => {
      return state.currentDeploymentId ? state.deployments[state.currentDeploymentId] : null;
    },
    
    deploymentProgress: (state) => {
      const deployment = state.currentDeployment;
      if (!deployment) return 0;
      
      return deployment.overallProgress || 0;
    },
    
    isDeploymentCompleted: (state) => {
      const deployment = state.currentDeployment;
      if (!deployment) return false;
      
      return deployment.status === 'completed';
    },
    
    isDeploymentFailed: (state) => {
      const deployment = state.currentDeployment;
      if (!deployment) return false;
      
      return deployment.status === 'failed';
    },
  },

  actions: {
    async fetchLatestDeployment() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const latestDeployment = await deploymentService.getLatestDeployment();
        
        if (latestDeployment) {
          this.currentDeploymentId = latestDeployment.id;
          this.deployments[latestDeployment.id] = latestDeployment;
        }
        
        return latestDeployment;
      } catch (error) {
        this.error = error.message || '배포 정보를 가져오는 중 오류가 발생했습니다.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async getDeploymentById(deploymentId) {
      if (this.deployments[deploymentId]) {
        this.currentDeploymentId = deploymentId;
        return this.deployments[deploymentId];
      }
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const deployment = await deploymentService.getDeploymentById(deploymentId);
        
        if (deployment) {
          this.currentDeploymentId = deployment.id;
          this.deployments[deployment.id] = deployment;
        }
        
        return deployment;
      } catch (error) {
        this.error = error.message || '배포 정보를 가져오는 중 오류가 발생했습니다.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async startDeployment(requirementId) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const newDeployment = await deploymentService.startDeployment(requirementId);
        
        if (newDeployment) {
          this.currentDeploymentId = newDeployment.id;
          this.deployments[newDeployment.id] = newDeployment;
        }
        
        return newDeployment;
      } catch (error) {
        this.error = error.message || '배포를 시작하는 중 오류가 발생했습니다.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // WebSocket 또는 폴링으로 배포 상태 업데이트
    updateDeploymentStatus(deploymentId, statusData) {
      if (this.deployments[deploymentId]) {
        this.deployments[deploymentId] = {
          ...this.deployments[deploymentId],
          ...statusData
        };
      }
    },
    
    // 배포 취소/중단
    async cancelDeployment(deploymentId) {
      try {
        await deploymentService.cancelDeployment(deploymentId);
        
        if (this.deployments[deploymentId]) {
          this.deployments[deploymentId].status = 'cancelled';
        }
        
        return true;
      } catch (error) {
        this.error = error.message || '배포를 취소하는 중 오류가 발생했습니다.';
        throw error;
      }
    },

    /**
     * 워크플로우 상태 가져오기
     * @param {string} deploymentId - 배포 ID
     */
    async getWorkflowStatus(deploymentId) {
      if (!deploymentId) return null;
      
      try {
        const workflowStatus = await deploymentService.getWorkflowStatus(deploymentId);
        return workflowStatus;
      } catch (error) {
        console.error('워크플로우 상태를 가져오는 중 오류 발생:', error);
        return null;
      }
    },
    
    clearCurrentDeployment() {
      this.currentDeploymentId = null;
    },
  },
});