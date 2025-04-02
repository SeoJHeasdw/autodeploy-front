// src/store/modules/requirement.js
import { defineStore } from 'pinia';
import api from '@/services/api';

// 요구사항 관련 API 서비스
const requirementService = {
  /**
   * 요구사항 목록 가져오기
   * @param {Object} params - 페이지네이션 및 필터링 파라미터
   */
  async getRequirements(params) {
    try {
      const response = await api.get('/requirements', { params });
      return response.data;
    } catch (error) {
      console.error('요구사항 목록을 가져오는데 실패했습니다:', error);
      throw error;
    }
  },
  
  /**
   * 특정 ID의 요구사항 상세 가져오기
   * @param {string} id - 요구사항 ID
   */
  async getRequirementById(id) {
    try {
      const response = await api.get(`/requirements/${id}`);
      return response.data;
    } catch (error) {
      console.error(`요구사항 ID ${id}의 상세 정보를 가져오는데 실패했습니다:`, error);
      throw error;
    }
  },
  
  /**
   * 새 요구사항 제출
   * @param {Object} requirementData - 요구사항 데이터
   */
  async submitRequirement(requirementData) {
    try {
      const response = await api.post('/requirements', requirementData);
      return response.data;
    } catch (error) {
      console.error('요구사항 제출에 실패했습니다:', error);
      throw error;
    }
  },
  
  /**
   * 요구사항 수정
   * @param {string} id - 요구사항 ID
   * @param {Object} requirementData - 수정할 요구사항 데이터
   */
  async updateRequirement(id, requirementData) {
    try {
      const response = await api.put(`/requirements/${id}`, requirementData);
      return response.data;
    } catch (error) {
      console.error(`요구사항 ID ${id}를 수정하는데 실패했습니다:`, error);
      throw error;
    }
  },
  
  /**
   * 요구사항 삭제
   * @param {string} id - 요구사항 ID
   */
  async deleteRequirement(id) {
    try {
      const response = await api.delete(`/requirements/${id}`);
      return response.data;
    } catch (error) {
      console.error(`요구사항 ID ${id}를 삭제하는데 실패했습니다:`, error);
      throw error;
    }
  }
};

export const useRequirementStore = defineStore('requirement', {
  state: () => ({
    requirements: [],
    currentRequirement: null,
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    },
    filters: {
      status: null,
      priority: null,
      search: ''
    }
  }),
  
  getters: {
    // 우선순위별 요구사항 필터링
    requirementsByPriority: (state) => (priority) => {
      return state.requirements.filter(req => req.priority === priority);
    },
    
    // 완료되지 않은 요구사항
    pendingRequirements: (state) => {
      return state.requirements.filter(req => req.status !== 'completed');
    },
    
    // 모든 요구사항 총 개수
    totalRequirements: (state) => {
      return state.pagination.total;
    }
  },
  
  actions: {
    /**
     * 요구사항 목록 가져오기
     * @param {Object} params - 페이지네이션 및 필터링 파라미터
     */
    async fetchRequirements(params = {}) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // 기본 필터 및 페이지네이션 설정과 머지
        const queryParams = {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          ...this.filters,
          ...params
        };
        
        const data = await requirementService.getRequirements(queryParams);
        
        this.requirements = data.items || [];
        this.pagination = {
          page: data.page || 1,
          pageSize: data.pageSize || 10,
          total: data.total || 0
        };
        
        return this.requirements;
      } catch (error) {
        this.error = error.message || '요구사항 목록을 가져오는데 실패했습니다.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * 특정 ID의 요구사항 상세 가져오기
     * @param {string} id - 요구사항 ID
     */
    async fetchRequirementById(id) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const requirement = await requirementService.getRequirementById(id);
        this.currentRequirement = requirement;
        return requirement;
      } catch (error) {
        this.error = error.message || '요구사항 상세 정보를 가져오는데 실패했습니다.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * 새 요구사항 제출
     * @param {Object} requirementData - 요구사항 데이터
     */
    async submitRequirement(requirementData) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const newRequirement = await requirementService.submitRequirement(requirementData);
        
        // 새 요구사항을 목록에 추가
        this.requirements.unshift(newRequirement);
        this.pagination.total += 1;
        
        return newRequirement;
      } catch (error) {
        this.error = error.message || '요구사항 제출에 실패했습니다.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * 요구사항 수정
     * @param {string} id - 요구사항 ID
     * @param {Object} requirementData - 수정할 요구사항 데이터
     */
    async updateRequirement(id, requirementData) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const updatedRequirement = await requirementService.updateRequirement(id, requirementData);
        
        // 목록에서 해당 요구사항 업데이트
        const index = this.requirements.findIndex(req => req.id === id);
        if (index !== -1) {
          this.requirements[index] = updatedRequirement;
        }
        
        // 현재 선택된 요구사항이 수정한 요구사항이면 업데이트
        if (this.currentRequirement && this.currentRequirement.id === id) {
          this.currentRequirement = updatedRequirement;
        }
        
        return updatedRequirement;
      } catch (error) {
        this.error = error.message || '요구사항 수정에 실패했습니다.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * 요구사항 삭제
     * @param {string} id - 요구사항 ID
     */
    async deleteRequirement(id) {
      this.isLoading = true;
      this.error = null;
      
      try {
        await requirementService.deleteRequirement(id);
        
        // 목록에서 해당 요구사항 제거
        this.requirements = this.requirements.filter(req => req.id !== id);
        this.pagination.total -= 1;
        
        // 현재 선택된 요구사항이 삭제한 요구사항이면 null로 설정
        if (this.currentRequirement && this.currentRequirement.id === id) {
          this.currentRequirement = null;
        }
        
        return true;
      } catch (error) {
        this.error = error.message || '요구사항 삭제에 실패했습니다.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * 필터 설정
     * @param {Object} filters - 적용할 필터 객체
     */
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },
    
    /**
     * 페이지네이션 설정
     * @param {Object} pagination - 페이지네이션 객체
     */
    setPagination(pagination) {
      this.pagination = { ...this.pagination, ...pagination };
    },
    
    /**
     * 현재 상태 초기화
     */
    resetState() {
      this.requirements = [];
      this.currentRequirement = null;
      this.isLoading = false;
      this.error = null;
      this.pagination = {
        page: 1,
        pageSize: 10,
        total: 0
      };
      this.filters = {
        status: null,
        priority: null,
        search: ''
      };
    }
  }
});