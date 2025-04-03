// src/store/modules/requirement.store.ts
import { defineStore } from 'pinia';
import mockService from '@/services/mock/mockDataService';
import type { Requirement, QueryParams } from '@/services/mock/mockDataService';

interface RequirementState {
  requirements: Requirement[];
  currentRequirement: Requirement | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  filters: {
    status: string | null;
    priority: string | null;
    search: string;
  };
}

export const useRequirementStore = defineStore('requirement', {
  state: (): RequirementState => ({
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
    requirementsByPriority: (state) => (priority: string) => {
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
    async fetchRequirements(params: Partial<QueryParams> = {}) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // 기본 필터 및 페이지네이션 설정과 머지
        const queryParams = {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          ...params
        };
        
        // status가 null이 아닐 때만 추가
        if (this.filters.status !== null) {
          queryParams.status = this.filters.status;
        }

        // priority가 null이 아닐 때만 추가
        if (this.filters.priority !== null) {
          queryParams.priority = this.filters.priority;
        }

        // search 추가
        if (this.filters.search) {
          queryParams.search = this.filters.search;
        }
        // mockService 사용
        const data = await mockService.getRequirements(queryParams);
        
        this.requirements = data.items || [];
        this.pagination = {
          page: data.page || 1,
          pageSize: data.pageSize || 10,
          total: data.total || 0
        };
        
        return this.requirements;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '요구사항 목록을 가져오는데 실패했습니다.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * 특정 ID의 요구사항 상세 가져오기
     * @param {string} id - 요구사항 ID
     */
    async fetchRequirementById(id: string) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // mockService 사용
        const requirement = await mockService.getRequirementById(id);
        this.currentRequirement = requirement;
        return requirement;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '요구사항 상세 정보를 가져오는데 실패했습니다.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * 새 요구사항 제출
     * @param {Object} requirementData - 요구사항 데이터
     */
    async submitRequirement(requirementData: Partial<Requirement>) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // mockService 사용
        const newRequirement = await mockService.submitRequirement(requirementData);
        
        // 새 요구사항을 목록에 추가
        this.requirements.unshift(newRequirement);
        this.pagination.total += 1;
        
        return newRequirement;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '요구사항 제출에 실패했습니다.';
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
    async updateRequirement(id: string, requirementData: Partial<Requirement>) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // mockService 사용
        const updatedRequirement = await mockService.updateRequirement(id, requirementData);
        
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
        this.error = error instanceof Error ? error.message : '요구사항 수정에 실패했습니다.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * 요구사항 삭제
     * @param {string} id - 요구사항 ID
     */
    async deleteRequirement(id: string) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // mockService 사용
        await mockService.deleteRequirement(id);
        
        // 목록에서 해당 요구사항 제거
        this.requirements = this.requirements.filter(req => req.id !== id);
        this.pagination.total -= 1;
        
        // 현재 선택된 요구사항이 삭제한 요구사항이면 null로 설정
        if (this.currentRequirement && this.currentRequirement.id === id) {
          this.currentRequirement = null;
        }
        
        return true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '요구사항 삭제에 실패했습니다.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * 필터 설정
     * @param {Object} filters - 적용할 필터 객체
     */
    setFilters(filters: Partial<RequirementState['filters']>) {
      this.filters = { ...this.filters, ...filters };
    },
    
    /**
     * 페이지네이션 설정
     * @param {Object} pagination - 페이지네이션 객체
     */
    setPagination(pagination: Partial<RequirementState['pagination']>) {
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