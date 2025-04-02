<template>
    <div class="deployment-status">
      <h2>배포 진행 상태</h2>
      
      <div v-if="isLoading" class="loading-container">
        <div class="loader"></div>
        <p>배포 상태 로딩 중...</p>
      </div>
      
      <div v-else-if="deploymentData">
        <!-- 진행 상태 요약 정보 -->
        <div class="status-summary">
          <div class="status-item">
            <span class="label">요구사항 ID:</span>
            <span class="value">#{{ deploymentData.requirementId }}</span>
          </div>
          <div class="status-item">
            <span class="label">시작 시간:</span>
            <span class="value">{{ formatDateTime(deploymentData.startTime) }}</span>
          </div>
          <div class="status-item">
            <span class="label">현재 단계:</span>
            <span class="value status-tag" :class="getStatusClass(deploymentData.status)">
              {{ deploymentData.status }}
            </span>
          </div>
        </div>
        
        <!-- 전체 진행 상태 프로그레스 바 -->
        <div class="progress-container">
          <div class="progress-label">
            <span>전체 진행률: {{ deploymentData.overallProgress }}%</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${deploymentData.overallProgress}%` }"
            ></div>
          </div>
        </div>
        
        <!-- 각 단계별 상태 -->
        <div class="deployment-steps">
          <h3>단계별 진행 상태</h3>
          <ul class="step-list">
            <li 
              v-for="(step, index) in deploymentData.steps" 
              :key="index"
              class="step-item"
              :class="{
                'completed': step.status === 'completed',
                'in-progress': step.status === 'in-progress',
                'pending': step.status === 'pending',
                'failed': step.status === 'failed'
              }"
            >
              <div class="step-header">
                <div class="step-icon">
                  <i class="step-indicator"></i>
                </div>
                <div class="step-title">
                  <h4>{{ step.name }}</h4>
                  <span class="step-status">{{ getStepStatusText(step.status) }}</span>
                </div>
                <div class="step-time" v-if="step.completedAt">
                  {{ formatTime(step.completedAt) }}
                </div>
              </div>
              <div class="step-details" v-if="step.details">
                <pre>{{ step.details }}</pre>
              </div>
            </li>
          </ul>
        </div>
        
        <!-- 로그 출력 -->
        <div class="deployment-logs" v-if="deploymentData.logs && deploymentData.logs.length > 0">
          <h3>배포 로그</h3>
          <div class="log-container">
            <pre>{{ deploymentData.logs.join('\n') }}</pre>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <p>현재 활성화된 배포 작업이 없습니다.</p>
        <button @click="navigateToRequirements" class="btn-primary">
          새 요구사항 등록하기
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDeploymentStore } from '@/store/modules/deployment';
  
  const router = useRouter();
  const deploymentStore = useDeploymentStore();
  
  const isLoading = ref(true);
  const deploymentId = ref(null);
  
  // 컴포넌트 마운트 시 배포 상태 로드
  onMounted(async () => {
    try {
      // URL 파라미터에서 배포 ID 추출 로직이 필요할 수 있음
      // 또는 가장 최근 배포 상태를 가져오는 로직
      await deploymentStore.fetchLatestDeployment();
      deploymentId.value = deploymentStore.currentDeploymentId;
      isLoading.value = false;
    } catch (error) {
      console.error('배포 상태 로딩 중 오류 발생:', error);
      isLoading.value = false;
    }
  });
  
  // 배포 데이터 가져오기
  const deploymentData = computed(() => {
    return deploymentStore.currentDeployment;
  });
  
  // 상태에 따른 클래스 반환
  const getStatusClass = (status) => {
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
  
  // 단계 상태 텍스트 변환
  const getStepStatusText = (status) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'in-progress':
        return '진행 중';
      case 'pending':
        return '대기 중';
      case 'failed':
        return '실패';
      default:
        return status;
    }
  };
  
  // 날짜 형식화
  const formatDateTime = (timestamp) => {
    if (!timestamp) return '-';
    
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR');
  };
  
  // 시간 형식화
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR');
  };
  
  // 요구사항 페이지로 이동
  const navigateToRequirements = () => {
    router.push('/requirements');
  };
  </script>
  
  <style scoped>
  .deployment-status {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  h2, h3 {
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 0;
  }
  
  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .status-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .status-item {
    display: flex;
    flex-direction: column;
  }
  
  .label {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 0.25rem;
  }
  
  .value {
    font-size: 1rem;
    font-weight: 500;
  }
  
  .status-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 16px;
    font-size: 0.875rem;
  }
  
  .status-success {
    background-color: #e6f7ea;
    color: #2e7d32;
  }
  
  .status-progress {
    background-color: #e3f2fd;
    color: #1976d2;
  }
  
  .status-error {
    background-color: #fdecea;
    color: #d32f2f;
  }
  
  .status-pending {
    background-color: #fff8e1;
    color: #f57c00;
  }
  
  .progress-container {
    margin-bottom: 2rem;
  }
  
  .progress-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .progress-bar {
    height: 12px;
    background-color: #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #4CAF50;
    transition: width 0.3s ease;
  }
  
  .step-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .step-item {
    border-left: 2px solid #e0e0e0;
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative;
  }
  
  .step-item.completed {
    border-left-color: #4CAF50;
  }
  
  .step-item.in-progress {
    border-left-color: #2196F3;
  }
  
  .step-item.failed {
    border-left-color: #F44336;
  }
  
  .step-indicator {
    position: absolute;
    left: -10px;
    top: 0;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #e0e0e0;
  }
  
  .step-item.completed .step-indicator {
    background-color: #4CAF50;
  }
  
  .step-item.in-progress .step-indicator {
    background-color: #2196F3;
  }
  
  .step-item.failed .step-indicator {
    background-color: #F44336;
  }
  
  .step-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .step-title {
    flex: 1;
  }
  
  .step-title h4 {
    margin: 0 0 0.25rem 0;
  }
  
  .step-status {
    font-size: 0.875rem;
    color: #666;
  }
  
  .step-details {
    margin-top: 0.5rem;
    padding: 0.75rem;
    background-color: #f0f0f0;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  
  .step-details pre {
    margin: 0;
    white-space: pre-wrap;
  }
  
  .log-container {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #2d2d2d;
    color: #f1f1f1;
    border-radius: 4px;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .log-container pre {
    margin: 0;
    font-family: monospace;
    font-size: 0.875rem;
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem 0;
  }
  
  .empty-state p {
    margin-bottom: 1.5rem;
    color: #666;
  }
  
  .btn-primary {
    background-color: #4CAF50;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .btn-primary:hover {
    background-color: #45a049;
  }
  </style>