<template>
    <div class="dashboard">
      <h1 class="page-title">자동화 CI/CD 대시보드</h1>
      
      <!-- 대시보드 요약 정보 -->
      <div class="dashboard-summary">
        <div class="summary-card">
          <div class="card-icon">
            <i class="fas fa-tasks"></i>
          </div>
          <div class="card-content">
            <h3>진행 중인 작업</h3>
            <p class="card-value">{{ activeDeployments.length }}</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="card-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="card-content">
            <h3>완료된 작업</h3>
            <p class="card-value">{{ completedDeployments.length }}</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="card-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="card-content">
            <h3>실패한 작업</h3>
            <p class="card-value">{{ failedDeployments.length }}</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="card-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="card-content">
            <h3>평균 소요 시간</h3>
            <p class="card-value">{{ avgDeploymentTime }}</p>
          </div>
        </div>
      </div>
      
      <!-- 최근 요구사항 & 작업 내역 -->
      <div class="dashboard-recent">
        <div class="recent-requirements">
          <div class="section-header">
            <h2>최근 요구사항</h2>
            <button class="btn-text" @click="navigateToRequirements">
              모두 보기
            </button>
          </div>
          
          <div class="requirements-list" v-if="recentRequirements.length > 0">
            <div 
              v-for="req in recentRequirements" 
              :key="req.id" 
              class="requirement-item"
              @click="viewRequirement(req.id)"
            >
              <div class="req-header">
                <h4>{{ req.title }}</h4>
                <span class="req-priority" :class="`priority-${req.priority}`">
                  {{ req.priority }}
                </span>
              </div>
              <p class="req-description">{{ truncateText(req.description, 100) }}</p>
              <div class="req-footer">
                <span class="req-date">{{ formatDate(req.createdAt) }}</span>
                <button 
                  class="btn-primary btn-sm" 
                  v-if="!req.deploymentId"
                  @click.stop="startDeployment(req.id)"
                >
                  배포 시작
                </button>
                <span 
                  v-else 
                  class="deployment-status" 
                  :class="getDeploymentStatusClass(req.deploymentStatus)"
                  @click.stop="viewDeployment(req.deploymentId)"
                >
                  {{ getDeploymentStatusText(req.deploymentStatus) }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="empty-state" v-else>
            <p>등록된 요구사항이 없습니다.</p>
            <button class="btn-primary" @click="navigateToRequirements">
              새 요구사항 등록하기
            </button>
          </div>
        </div>
        
        <div class="recent-deployments">
          <div class="section-header">
            <h2>최근 배포 작업</h2>
            <button class="btn-text" @click="navigateToDeployments">
              모두 보기
            </button>
          </div>
          
          <div class="deployments-list" v-if="recentDeployments.length > 0">
            <div 
              v-for="dep in recentDeployments" 
              :key="dep.id" 
              class="deployment-item"
              :class="`status-${dep.status.toLowerCase()}`"
              @click="viewDeployment(dep.id)"
            >
              <div class="deployment-header">
                <h4>요구사항 #{{ dep.requirementId }}</h4>
                <span class="deployment-status">
                  {{ getDeploymentStatusText(dep.status) }}
                </span>
              </div>
              
              <div class="deployment-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${dep.overallProgress || 0}%` }"
                  ></div>
                </div>
                <span class="progress-text">{{ dep.overallProgress || 0 }}%</span>
              </div>
              
              <div class="deployment-footer">
                <span class="deployment-date">{{ formatDate(dep.startTime) }}</span>
                <span class="deployment-step">{{ dep.currentStep || '준비 중' }}</span>
              </div>
            </div>
          </div>
          
          <div class="empty-state" v-else>
            <p>최근 배포 작업이 없습니다.</p>
          </div>
        </div>
      </div>
      
      <!-- 빠른 작업 버튼 -->
      <div class="quick-actions">
        <button class="btn-primary" @click="navigateToRequirements">
          새 요구사항 등록
        </button>
        <button 
          class="btn-secondary" 
          @click="viewLatestDeployment"
          :disabled="!hasActiveDeployment"
        >
          현재 진행 중인 배포 보기
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useRequirementStore } from '@/store/modules/requirement';
  import { useDeploymentStore } from '@/store/modules/deployment';
  
  const router = useRouter();
  const requirementStore = useRequirementStore();
  const deploymentStore = useDeploymentStore();
  
  // 상태 로딩
  const isLoading = ref(true);
  
  // 컴포넌트 마운트 시 데이터 로드
  onMounted(async () => {
    try {
      await Promise.all([
        requirementStore.fetchRequirements(),
        deploymentStore.fetchRecentDeployments()
      ]);
    } catch (error) {
      console.error('데이터 로딩 중 오류 발생:', error);
    } finally {
      isLoading.value = false;
    }
  });
  
  // 최근 요구사항 목록 (최대 5개)
  const recentRequirements = computed(() => {
    return requirementStore.requirements.slice(0, 5);
  });
  
  // 배포 작업 목록
  const recentDeployments = computed(() => {
    return deploymentStore.recentDeployments.slice(0, 5);
  });
  
  // 활성화된 배포 여부
  const hasActiveDeployment = computed(() => {
    return deploymentStore.activeDeployments.length > 0;
  });
  
  // 진행 중인 배포 작업
  const activeDeployments = computed(() => {
    return deploymentStore.activeDeployments;
  });
  
  // 완료된 배포 작업
  const completedDeployments = computed(() => {
    return deploymentStore.completedDeployments;
  });
  
  // 실패한 배포 작업
  const failedDeployments = computed(() => {
    return deploymentStore.failedDeployments;
  });
  
  // 평균 배포 소요 시간
  const avgDeploymentTime = computed(() => {
    return deploymentStore.averageDeploymentTime || '계산 중...';
  });
  
  // 텍스트 자르기
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  // 날짜 형식화
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };
  
  // 배포 상태에 따른 클래스 반환
  const getDeploymentStatusClass = (status) => {
    if (!status) return '';
    
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-success';
      case 'in-progress':
        return 'status-progress';
      case 'failed':
        return 'status-error';
      default:
        return 'status-pending';
    }
  };
  
  // 배포 상태 텍스트 반환
  const getDeploymentStatusText = (status) => {
    if (!status) return '알 수 없음';
    
    switch (status.toLowerCase()) {
      case 'completed':
        return '완료됨';
      case 'in-progress':
        return '진행 중';
      case 'failed':
        return '실패';
      case 'pending':
        return '대기 중';
      case 'cancelled':
        return '취소됨';
      default:
        return status;
    }
  };
  
  // 요구사항 페이지로 이동
  const navigateToRequirements = () => {
    router.push('/requirements');
  };
  
  // 배포 페이지로 이동
  const navigateToDeployments = () => {
    router.push('/deployments');
  };
  
  // 특정 요구사항 상세 보기
  const viewRequirement = (requirementId) => {
    router.push(`/requirements/${requirementId}`);
  };
  
  // 특정 배포 작업 상세 보기
  const viewDeployment = (deploymentId) => {
    router.push(`/deployments/${deploymentId}`);
  };
  
  // 최신 배포 작업 보기
  const viewLatestDeployment = () => {
    if (deploymentStore.activeDeployments.length > 0) {
      const latestDeploymentId = deploymentStore.activeDeployments[0].id;
      router.push(`/deployments/${latestDeploymentId}`);
    }
  };
  
  // 요구사항에 대한 배포 시작
  const startDeployment = async (requirementId) => {
    try {
      const deployment = await deploymentStore.startDeployment(requirementId);
      if (deployment) {
        router.push(`/deployments/${deployment.id}`);
      }
    } catch (error) {
      console.error('배포 시작 중 오류 발생:', error);
      // 오류 처리 로직 추가
    }
  };
  </script>
  
  <style scoped>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .page-title {
    margin-bottom: 2rem;
    color: #333;
    font-size: 2rem;
  }
  
  .dashboard-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }
  
  .summary-card {
    display: flex;
    padding: 1.5rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    margin-right: 1rem;
    background-color: #f5f5f5;
    border-radius: 50%;
    font-size: 1.5rem;
    color: #4CAF50;
  }
  
  .card-content {
    flex: 1;
  }
  
  .card-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: #666;
  }
  
  .card-value {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 600;
    color: #333;
  }
  
  .dashboard-recent {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2.5rem;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .section-header h2 {
    margin: 0;
    font-size: 1.25rem;
  }
  
  .btn-text {
    background: none;
    border: none;
    color: #4CAF50;
    padding: 0;
    font-size: 0.875rem;
    cursor: pointer;
  }
  
  .btn-text:hover {
    text-decoration: underline;
  }
  
  .requirements-list, .deployments-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .requirement-item, .deployment-item {
    padding: 1rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .requirement-item:hover, .deployment-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .req-header, .deployment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .req-header h4, .deployment-header h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
  }
  
  .req-description {
    margin: 0.5rem 0;
    font-size: 0.875rem;
    color: #666;
  }
  
  .req-footer, .deployment-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.75rem;
    font-size: 0.875rem;
  }
  
  .req-date, .deployment-date {
    color: #777;
  }
  
  .req-priority {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .priority-high {
    background-color: #ffebee;
    color: #d32f2f;
  }
  
  .priority-medium {
    background-color: #fff8e1;
    color: #f57c00;
  }
  
  .priority-low {
    background-color: #e8f5e9;
    color: #388e3c;
  }
  
  .deployment-status {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .status-success {
    background-color: #e8f5e9;
    color: #388e3c;
  }
  
  .status-progress {
    background-color: #e3f2fd;
    color: #1976d2;
  }
  
  .status-error {
    background-color: #ffebee;
    color: #d32f2f;
  }
  
  .status-pending {
    background-color: #f5f5f5;
    color: #757575;
  }
  
  .deployment-progress {
    display: flex;
    align-items: center;
    margin: 0.75rem 0;
  }
  
  .progress-bar {
    flex: 1;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
    margin-right: 0.5rem;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #4CAF50;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-size: 0.75rem;
    font-weight: 500;
    color: #666;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    text-align: center;
  }
  
  .empty-state p {
    margin-bottom: 1rem;
    color: #666;
  }
  
  .quick-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .btn-primary, .btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
  
  .btn-primary {
    background-color: #4CAF50;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #45a049;
  }
  
  .btn-secondary {
    background-color: #f1f1f1;
    color: #333;
  }
  
  .btn-secondary:hover {
    background-color: #e0e0e0;
  }
  
  .btn-secondary:disabled {
    background-color: #f1f1f1;
    color: #aaa;
    cursor: not-allowed;
  }
  </style>