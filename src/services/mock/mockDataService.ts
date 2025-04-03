// src/services/mockService.ts
import { v4 as uuidv4 } from 'uuid';

// 타입 정의
export interface Requirement {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'review' | 'failed';
  deadline?: string;
  createdAt: string;
  updatedAt?: string;
  assignee?: string;
}

export interface DeploymentStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  details?: string;
}

export interface Deployment {
  id: string;
  requirementId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';
  overallProgress: number;
  startTime: string;
  completedAt?: string;
  failedAt?: string;
  currentStep: string;
  steps: DeploymentStep[];
  logs: string[];
}

export interface SystemStatusItem {
  status: 'online' | 'warning' | 'offline';
  responseTime: number;
  availability: number;
}

export interface SystemStatus {
  gitlab: SystemStatusItem;
  jenkins: SystemStatusItem;
  argocd: SystemStatusItem;
  kubernetes: SystemStatusItem;
}

export interface WorkflowStatus {
  requirement: 'pending' | 'in-progress' | 'completed' | 'failed';
  sourceCode: 'pending' | 'in-progress' | 'completed' | 'failed';
  cicd: 'pending' | 'in-progress' | 'completed' | 'failed';
  deployment: 'pending' | 'in-progress' | 'completed' | 'failed';
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  status?: string;
  priority?: string;
  search?: string;
}

// 모의 요구사항 데이터
const mockRequirements: Requirement[] = [
  {
    id: '1001',
    title: '사용자 인증 시스템 개선',
    description: '기존 로그인 시스템을 개선하여 OAuth 2.0을 지원하도록 업데이트합니다.',
    priority: 'high',
    status: 'in-progress',
    deadline: '2025-05-15',
    createdAt: '2025-04-01T09:00:00Z',
    assignee: '홍길동'
  },
  {
    id: '1002',
    title: '대시보드 UI 리뉴얼',
    description: '사용자 경험 향상을 위한 대시보드 UI 개선 및 최신 트렌드 반영',
    priority: 'medium',
    status: 'pending',
    deadline: '2025-05-20',
    createdAt: '2025-04-02T10:30:00Z',
    assignee: '김철수'
  },
  {
    id: '1003',
    title: '실시간 알림 기능 구현',
    description: 'WebSocket을 활용한 실시간 알림 시스템 구축 및 푸시 알림 연동',
    priority: 'medium',
    status: 'completed',
    deadline: '2025-04-30',
    createdAt: '2025-04-03T14:15:00Z',
    assignee: '이영희'
  },
  {
    id: '1004',
    title: '성능 최적화',
    description: '페이지 로딩 시간 및 API 응답 시간 개선을 위한 성능 최적화 작업',
    priority: 'low',
    status: 'review',
    deadline: '2025-05-10',
    createdAt: '2025-04-04T16:45:00Z',
    assignee: '박지민'
  },
  {
    id: '1005',
    title: '모바일 대응 강화',
    description: '모바일 환경에서의 사용성 개선 및 반응형 디자인 적용',
    priority: 'high',
    status: 'pending',
    deadline: '2025-05-25',
    createdAt: '2025-04-05T11:20:00Z',
    assignee: '최수진'
  }
];

// 모의 배포 데이터
const mockDeployments: Deployment[] = [
  {
    id: 'd1001',
    requirementId: '1001',
    status: 'in-progress',
    overallProgress: 65,
    startTime: '2025-04-05T13:45:00Z',
    currentStep: '이미지 빌드',
    steps: [
      { id: 's1', name: '코드 체크아웃', status: 'completed', completedAt: '2025-04-05T13:46:00Z' },
      { id: 's2', name: '의존성 설치', status: 'completed', completedAt: '2025-04-05T13:48:00Z' },
      { id: 's3', name: '테스트 실행', status: 'completed', completedAt: '2025-04-05T13:50:00Z' },
      { id: 's4', name: '이미지 빌드', status: 'in-progress', startedAt: '2025-04-05T13:51:00Z' },
      { id: 's5', name: '이미지 배포', status: 'pending' },
      { id: 's6', name: 'ArgoCD 배포', status: 'pending' }
    ],
    logs: [
      '[INFO] 2025-04-05 13:45:00 - 배포 시작',
      '[INFO] 2025-04-05 13:45:30 - 환경 변수 로드 완료',
      '[INFO] 2025-04-05 13:46:00 - 소스 코드 체크아웃 완료',
      '[INFO] 2025-04-05 13:47:00 - 의존성 설치 시작',
      '[INFO] 2025-04-05 13:48:00 - 의존성 설치 완료',
      '[INFO] 2025-04-05 13:48:30 - 테스트 실행 시작',
      '[INFO] 2025-04-05 13:50:00 - 테스트 실행 완료: 모든 테스트 통과',
      '[INFO] 2025-04-05 13:50:30 - 이미지 빌드 시작',
      '[INFO] 2025-04-05 13:52:00 - 패키지 압축 중...',
      '[INFO] 2025-04-05 13:53:30 - Docker 레이어 구성 중...'
    ]
  },
  {
    id: 'd1002',
    requirementId: '1003',
    status: 'completed',
    overallProgress: 100,
    startTime: '2025-04-04T10:15:00Z',
    completedAt: '2025-04-04T10:45:00Z',
    currentStep: '완료',
    steps: [
      { id: 's1', name: '코드 체크아웃', status: 'completed', completedAt: '2025-04-04T10:16:00Z' },
      { id: 's2', name: '의존성 설치', status: 'completed', completedAt: '2025-04-04T10:18:00Z' },
      { id: 's3', name: '테스트 실행', status: 'completed', completedAt: '2025-04-04T10:25:00Z' },
      { id: 's4', name: '이미지 빌드', status: 'completed', completedAt: '2025-04-04T10:35:00Z' },
      { id: 's5', name: '이미지 배포', status: 'completed', completedAt: '2025-04-04T10:40:00Z' },
      { id: 's6', name: 'ArgoCD 배포', status: 'completed', completedAt: '2025-04-04T10:45:00Z' }
    ],
    logs: [
      '[INFO] 2025-04-04 10:15:00 - 배포 시작',
      '[INFO] 2025-04-04 10:15:30 - 환경 변수 로드 완료',
      '[INFO] 2025-04-04 10:16:00 - 소스 코드 체크아웃 완료',
      '[INFO] 2025-04-04 10:17:00 - 의존성 설치 시작',
      '[INFO] 2025-04-04 10:18:00 - 의존성 설치 완료',
      '[INFO] 2025-04-04 10:18:30 - 테스트 실행 시작',
      '[INFO] 2025-04-04 10:25:00 - 테스트 실행 완료: 모든 테스트 통과',
      '[INFO] 2025-04-04 10:25:30 - 이미지 빌드 시작',
      '[INFO] 2025-04-04 10:35:00 - 이미지 빌드 완료',
      '[INFO] 2025-04-04 10:35:30 - 이미지 배포 시작',
      '[INFO] 2025-04-04 10:40:00 - 이미지 배포 완료',
      '[INFO] 2025-04-04 10:40:30 - ArgoCD 배포 시작',
      '[INFO] 2025-04-04 10:45:00 - ArgoCD 배포 완료',
      '[SUCCESS] 2025-04-04 10:45:00 - 배포 성공적으로 완료'
    ]
  },
  {
    id: 'd1003',
    requirementId: '1004',
    status: 'failed',
    overallProgress: 42,
    startTime: '2025-04-03T15:30:00Z',
    failedAt: '2025-04-03T15:45:00Z',
    currentStep: '테스트 실행',
    steps: [
      { id: 's1', name: '코드 체크아웃', status: 'completed', completedAt: '2025-04-03T15:31:00Z' },
      { id: 's2', name: '의존성 설치', status: 'completed', completedAt: '2025-04-03T15:34:00Z' },
      { id: 's3', name: '테스트 실행', status: 'failed', startedAt: '2025-04-03T15:35:00Z', failedAt: '2025-04-03T15:45:00Z' },
      { id: 's4', name: '이미지 빌드', status: 'pending' },
      { id: 's5', name: '이미지 배포', status: 'pending' },
      { id: 's6', name: 'ArgoCD 배포', status: 'pending' }
    ],
    logs: [
      '[INFO] 2025-04-03 15:30:00 - 배포 시작',
      '[INFO] 2025-04-03 15:30:30 - 환경 변수 로드 완료',
      '[INFO] 2025-04-03 15:31:00 - 소스 코드 체크아웃 완료',
      '[INFO] 2025-04-03 15:32:00 - 의존성 설치 시작',
      '[INFO] 2025-04-03 15:34:00 - 의존성 설치 완료',
      '[INFO] 2025-04-03 15:34:30 - 테스트 실행 시작',
      '[WARN] 2025-04-03 15:40:00 - 테스트 케이스 API-102 타임아웃 발생',
      '[ERROR] 2025-04-03 15:45:00 - 테스트 실패: API-102 응답 검증 실패',
      '[ERROR] 2025-04-03 15:45:00 - 배포 프로세스 중단: 테스트 단계에서 실패'
    ]
  }
];

// 모의 시스템 상태 데이터
const mockSystemStatus: SystemStatus = {
  gitlab: { status: 'online', responseTime: 120, availability: 99.9 },
  jenkins: { status: 'online', responseTime: 180, availability: 99.8 },
  argocd: { status: 'warning', responseTime: 250, availability: 98.5 },
  kubernetes: { status: 'online', responseTime: 150, availability: 99.7 }
};

// 모의 서비스 API
const mockService = {
  // 요구사항 API
  getRequirements: (params: QueryParams = {}): Promise<PaginatedResult<Requirement>> => {
    // 필터링 및 정렬 로직 (실제 구현에서는 더 복잡할 수 있음)
    let filteredReqs = [...mockRequirements];
    
    // 상태 필터링
    if (params.status) {
      filteredReqs = filteredReqs.filter(req => req.status === params.status);
    }
    
    // 우선순위 필터링
    if (params.priority) {
      filteredReqs = filteredReqs.filter(req => req.priority === params.priority);
    }
    
    // 검색어 필터링
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredReqs = filteredReqs.filter(req => 
        req.title.toLowerCase().includes(searchLower) || 
        req.description.toLowerCase().includes(searchLower)
      );
    }
    
    // 페이지네이션
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const paginatedReqs = filteredReqs.slice(startIndex, startIndex + pageSize);
    
    // 지연 효과를 위한 Promise 반환 (실제 API와 비슷한 느낌)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          items: paginatedReqs,
          page: page,
          pageSize: pageSize,
          total: filteredReqs.length
        });
      }, 300); // 300ms 지연
    });
  },
  
  getRequirementById: (id: string): Promise<Requirement> => {
    const requirement = mockRequirements.find(req => req.id === id);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (requirement) {
          resolve(requirement);
        } else {
          reject(new Error(`요구사항 ID ${id}를 찾을 수 없습니다.`));
        }
      }, 200);
    });
  },
  
  submitRequirement: (requirementData: Partial<Requirement>): Promise<Requirement> => {
    // 새 요구사항 생성
    const newRequirement: Requirement = {
      id: (1000 + mockRequirements.length + 1).toString(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      title: requirementData.title || '새 요구사항',
      description: requirementData.description || '',
      priority: requirementData.priority || 'medium',
      ...requirementData
    } as Requirement;
    
    // 모의 데이터에 추가
    mockRequirements.unshift(newRequirement);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newRequirement);
      }, 400);
    });
  },
  
  updateRequirement: (id: string, requirementData: Partial<Requirement>): Promise<Requirement> => {
    const index = mockRequirements.findIndex(req => req.id === id);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (index !== -1) {
          const updatedRequirement = {
            ...mockRequirements[index],
            ...requirementData,
            updatedAt: new Date().toISOString()
          };
          
          mockRequirements[index] = updatedRequirement;
          resolve(updatedRequirement);
        } else {
          reject(new Error(`요구사항 ID ${id}를 찾을 수 없습니다.`));
        }
      }, 300);
    });
  },
  
  deleteRequirement: (id: string): Promise<{ success: boolean }> => {
    const index = mockRequirements.findIndex(req => req.id === id);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (index !== -1) {
          mockRequirements.splice(index, 1);
          resolve({ success: true });
        } else {
          reject(new Error(`요구사항 ID ${id}를 찾을 수 없습니다.`));
        }
      }, 300);
    });
  },
  
  // 배포 API
  getLatestDeployment: (): Promise<Deployment | null> => {
    // 가장 최근 배포 반환 (startTime 기준 정렬)
    const sortedDeployments = [...mockDeployments].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sortedDeployments[0] || null);
      }, 300);
    });
  },
  
  getDeploymentById: (deploymentId: string): Promise<Deployment> => {
    const deployment = mockDeployments.find(dep => dep.id === deploymentId);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deployment) {
          resolve(deployment);
        } else {
          reject(new Error(`배포 ID ${deploymentId}를 찾을 수 없습니다.`));
        }
      }, 200);
    });
  },
  
  startDeployment: (requirementId: string): Promise<Deployment> => {
    // 요구사항 확인
    const requirement = mockRequirements.find(req => req.id === requirementId);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!requirement) {
          reject(new Error(`요구사항 ID ${requirementId}를 찾을 수 없습니다.`));
          return;
        }
        
        // 새 배포 객체 생성
        const newDeployment: Deployment = {
          id: 'd' + (1000 + mockDeployments.length + 1).toString(),
          requirementId: requirementId,
          status: 'in-progress',
          overallProgress: 5,
          startTime: new Date().toISOString(),
          currentStep: '코드 체크아웃',
          steps: [
            { id: 's1', name: '코드 체크아웃', status: 'in-progress', startedAt: new Date().toISOString() },
            { id: 's2', name: '의존성 설치', status: 'pending' },
            { id: 's3', name: '테스트 실행', status: 'pending' },
            { id: 's4', name: '이미지 빌드', status: 'pending' },
            { id: 's5', name: '이미지 배포', status: 'pending' },
            { id: 's6', name: 'ArgoCD 배포', status: 'pending' }
          ],
          logs: [
            `[INFO] ${new Date().toLocaleString()} - 배포 시작`,
            `[INFO] ${new Date().toLocaleString()} - 환경 변수 로드 완료`,
            `[INFO] ${new Date().toLocaleString()} - 소스 코드 체크아웃 시작`
          ]
        };
        
        // 모의 데이터에 추가
        mockDeployments.unshift(newDeployment);
        
        // 요구사항 상태 업데이트
        const reqIndex = mockRequirements.findIndex(req => req.id === requirementId);
        if (reqIndex !== -1) {
          mockRequirements[reqIndex].status = 'in-progress';
        }
        
        resolve(newDeployment);
      }, 500);
    });
  },
  
  cancelDeployment: (deploymentId: string): Promise<{ success: boolean }> => {
    const index = mockDeployments.findIndex(dep => dep.id === deploymentId);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (index !== -1 && mockDeployments[index].status === 'in-progress') {
          mockDeployments[index].status = 'cancelled';
          mockDeployments[index].overallProgress = Math.min(
            95,
            mockDeployments[index].overallProgress
          );
          
          // 로그 추가
          mockDeployments[index].logs.push(
            `[WARN] ${new Date().toLocaleString()} - 사용자에 의해 배포가 취소되었습니다.`
          );
          
          resolve({ success: true });
        } else if (index === -1) {
          reject(new Error(`배포 ID ${deploymentId}를 찾을 수 없습니다.`));
        } else {
          reject(new Error('진행 중인 배포만 취소할 수 있습니다.'));
        }
      }, 300);
    });
  },
  
  // 통계 및 상태 API
  getDeploymentStatistics: (): Promise<any> => {
    // 가상의 통계 데이터 생성
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalDeployments: mockDeployments.length,
          successRate: 85, // 퍼센트
          averageDeploymentTime: "25분",
          deploymentsByStatus: {
            completed: mockDeployments.filter(d => d.status === 'completed').length,
            inProgress: mockDeployments.filter(d => d.status === 'in-progress').length,
            failed: mockDeployments.filter(d => d.status === 'failed').length,
            cancelled: mockDeployments.filter(d => d.status === 'cancelled').length
          },
          recentTrend: [
            { date: '2025-03-28', deployments: 4, successRate: 75 },
            { date: '2025-03-29', deployments: 3, successRate: 67 },
            { date: '2025-03-30', deployments: 5, successRate: 80 },
            { date: '2025-03-31', deployments: 7, successRate: 86 },
            { date: '2025-04-01', deployments: 6, successRate: 83 },
            { date: '2025-04-02', deployments: 8, successRate: 88 },
            { date: '2025-04-03', deployments: 9, successRate: 89 }
          ]
        });
      }, 400);
    });
  },
  
  getSystemStatus: (): Promise<SystemStatus> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSystemStatus);
      }, 200);
    });
  },
  
  getWorkflowStatus: (deploymentId: string): Promise<WorkflowStatus> => {
    const deployment = mockDeployments.find(dep => dep.id === deploymentId);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        if (deployment) {
          // 배포 단계에 따른 워크플로우 상태 계산
          const steps = deployment.steps || [];
          const workflowStatus: WorkflowStatus = {
            requirement: 'completed', // 요구사항 단계는 항상 완료됨
            sourceCode: 'pending',
            cicd: 'pending',
            deployment: 'pending'
          };
          
          // 단계 진행 상태에 따라 워크플로우 상태 업데이트
          if (steps.find(s => s.name === '코드 체크아웃' && s.status === 'completed')) {
            workflowStatus.sourceCode = 'completed';
          } else if (steps.find(s => s.name === '코드 체크아웃' && s.status === 'in-progress')) {
            workflowStatus.sourceCode = 'in-progress';
          } else if (steps.find(s => s.name === '코드 체크아웃' && s.status === 'failed')) {
            workflowStatus.sourceCode = 'failed';
          }
          
          if (steps.find(s => s.name === '이미지 빌드' && s.status === 'completed')) {
            workflowStatus.cicd = 'completed';
          } else if (steps.find(s => (s.name === '의존성 설치' || s.name === '테스트 실행' || s.name === '이미지 빌드') && (s.status === 'in-progress' || s.status === 'completed'))) {
            workflowStatus.cicd = 'in-progress';
          } else if (steps.find(s => (s.name === '의존성 설치' || s.name === '테스트 실행' || s.name === '이미지 빌드') && s.status === 'failed')) {
            workflowStatus.cicd = 'failed';
          }
          
          if (steps.find(s => s.name === 'ArgoCD 배포' && s.status === 'completed')) {
            workflowStatus.deployment = 'completed';
          } else if (steps.find(s => (s.name === '이미지 배포' || s.name === 'ArgoCD 배포') && (s.status === 'in-progress' || s.status === 'completed'))) {
            workflowStatus.deployment = 'in-progress';
          } else if (steps.find(s => (s.name === '이미지 배포' || s.name === 'ArgoCD 배포') && s.status === 'failed')) {
            workflowStatus.deployment = 'failed';
          }
          
          resolve(workflowStatus);
        } else {
          // 배포가 없는 경우 기본 워크플로우 상태 반환
          resolve({
            requirement: 'completed',
            sourceCode: 'in-progress',
            cicd: 'pending',
            deployment: 'pending'
          });
        }
      }, 200);
    });
  }
};

export default mockService;