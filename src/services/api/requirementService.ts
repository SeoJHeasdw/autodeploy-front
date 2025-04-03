// src/services/requirements.ts
import api from './apiClient';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
  deadline?: string;
  createdAt: string;
  assignee?: string;
}

export interface RequirementQueryParams {
  page?: number;
  pageSize?: number;
  status?: string;
  priority?: string;
  search?: string;
}

export interface RequirementListResponse {
  items: Requirement[];
  page: number;
  pageSize: number;
  total: number;
}

export const requirementService = {
  /**
   * 요구사항 목록 가져오기
   */
  async getRequirements(params: RequirementQueryParams = {}): Promise<RequirementListResponse> {
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
   */
  async getRequirementById(id: string): Promise<Requirement> {
    try {
      const response = await api.get(`/requirements/${id}`);
      return response.data;
    } catch (error) {
      console.error(`요구사항 ID ${id}의 정보를 가져오는데 실패했습니다:`, error);
      throw error;
    }
  },
  
  /**
   * 새 요구사항 제출
   */
  async submitRequirement(data: Partial<Requirement>): Promise<Requirement> {
    try {
      const response = await api.post('/requirements', data);
      return response.data;
    } catch (error) {
      console.error('요구사항 제출에 실패했습니다:', error);
      throw error;
    }
  },
  
  /**
   * 요구사항 수정
   */
  async updateRequirement(id: string, data: Partial<Requirement>): Promise<Requirement> {
    try {
      const response = await api.put(`/requirements/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`요구사항 ID ${id} 수정에 실패했습니다:`, error);
      throw error;
    }
  },
  
  /**
   * 요구사항 삭제
   */
  async deleteRequirement(id: string): Promise<{ success: boolean }> {
    try {
      const response = await api.delete(`/requirements/${id}`);
      return response.data;
    } catch (error) {
      console.error(`요구사항 ID ${id} 삭제에 실패했습니다:`, error);
      throw error;
    }
  }
};