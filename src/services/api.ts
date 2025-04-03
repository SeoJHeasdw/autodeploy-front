// src/services/api.ts
import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

// API 기본 설정
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000, // 30초
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// 요청 인터셉터
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // JWT 토큰이 있으면 헤더에 추가 (인증 기능 구현 시 주석 해제)
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: any) => {
    // 인증 오류 처리 (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // 로그인 페이지로 리다이렉트 또는 토큰 갱신 로직
      // localStorage.removeItem('auth_token');
      // window.location = '/login';
    }
    
    // 서버 오류 처리 (5xx)
    if (error.response && error.response.status >= 500) {
      console.error('서버 오류가 발생했습니다:', error.response.data);
      // 애플리케이션 전역 오류 알림 트리거 가능
    }
    
    return Promise.reject(error);
  }
);

export default api;