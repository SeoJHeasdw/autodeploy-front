<template>
  <div class="deployment-status">
    <div class="status-header mb-4">
      <h2 class="status-title">배포 상태</h2>
      <div v-if="deploymentData" class="status-actions">
        <button 
          v-if="isInProgress" 
          class="btn btn-outline-danger btn-icon btn-sm"
          @click="confirmCancelDeployment"
        >
          <i class="fas fa-stop-circle"></i>
          <span>배포 취소</span>
        </button>
        <button 
          v-else 
          class="btn btn-outline-primary btn-icon btn-sm"
          @click="navigateToRequirements"
        >
          <i class="fas fa-list"></i>
          <span>요구사항 목록</span>
        </button>
      </div>
    </div>
    
    <div v-if="isLoading" class="loader-container">
      <div class="loader-content">
        <div class="spinner"></div>
        <p>배포 상태를 불러오는 중...</p>
      </div>
    </div>
    
    <div v-else-if="deploymentData" class="status-content">
      <!-- 상태 요약 카드 -->
      <div class="status-card mb-4">
        <div class="status-summary-grid">
          <div class="summary-item">
            <span class="summary-label">요구사항 ID</span>
            <span class="summary-value">
              <router-link :to="`/requirements/${deploymentData.requirementId}`">
                #{{ deploymentData.requirementId }}
              </router-link>
            </span>
          </div>
          
          <div class="summary-item">
            <span class="summary-label">시작 시간</span>
            <span class="summary-value">{{ formatDateTime(deploymentData.startTime) }}</span>
          </div>
          
          <div class="summary-item">
            <span class="summary-label">상태</span>
            <span 
              class="status-tag" 
              :class="getStatusClass(deploymentData.status)"
            >
              {{ deploymentData.status }}
            </span>
          </div>
          
          <div class="summary-item" v-if="deploymentData.completedAt">
            <span class="summary-label">완료 시간</span>
            <span class="summary-value">{{ formatDateTime(deploymentData.completedAt) }}</span>
          </div>
          
          <div class="summary-item" v-if="deploymentData.failedAt">
            <span class="summary-label">실패 시간</span>
            <span class="summary-value">{{ formatDateTime(deploymentData.failedAt) }}</span>
          </div>
          
          <div class="summary-item" v-if="isCompleted || isInProgress">
            <span class="summary-label">소요 시간</span>
            <span class="summary-value">{{ calculateDuration }}</span>
          </div>
        </div>
      </div>
      
      <!-- 진행 상태 바 -->
      <div class="status-progress mb-4">
        <div class="progress-container">
          <div class="progress-header">
            <h3>전체 진행률</h3>
            <span class="progress-percentage">{{ deploymentData.overallProgress }}%</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${deploymentData.overallProgress}%` }" 
              :class="{'progress-animated': isInProgress}"
            ></div>
          </div>
        </div>
      </div>
      
      <!-- 단계별 상태 -->
      <div class="deployment-steps mb-4">
        <h3 class="steps-title">배포 단계</h3>
        
        <div class="deployment-stepper">
          <div
            v-for="(step, index) in deploymentData.steps"
            :key="index"
            class="stepper-item"
            :class="{
              'completed': step.status === 'completed',
              'active': step.status === 'in-progress',
              'failed': step.status === 'failed',
              'pending': step.status === 'pending'
            }"
          >
            <div class="stepper-circle">
              <i v-if="step.status === 'completed'" class="fas fa-check"></i>
              <i v-else-if="step.status === 'in-progress'" class="fas fa-spinner fa-spin"></i>
              <i v-else-if="step.status === 'failed'" class="fas fa-times"></i>
              <template v-else>{{ index + 1 }}</template>
            </div>
            
            <div class="stepper-content">
              <div class="stepper-header">
                <h4 class="stepper-title">{{ step.name }}</h4>
                <div class="stepper-info">
                  <span 
                    class="stepper-status status-tag"
                    :class="getStepStatusClass(step.status)"
                  >
                    {{ getStepStatusText(step.status) }}
                  </span>
                  <span v-if="step.completedAt" class="stepper-time">
                    {{ formatTime(step.completedAt) }}
                  </span>
                </div>
              </div>
              
              <div v-if="step.details && (step.status === 'completed' || step.status === 'failed')" class="stepper-details">
                <div class="details-collapsible">
                  <button 
                    class="details-toggle btn btn-ghost btn-sm"
                    @click="toggleStepDetails(index)"
                  >
                    {{ expandedSteps[index] ? '상세 정보 숨기기' : '상세 정보 보기' }}
                    <i 
                      class="fas"
                      :class="expandedSteps[index] ? 'fa-chevron-up' : 'fa-chevron-down'"
                    ></i>
                  </button>
                  
                  <div v-if="expandedSteps[index]" class="details-content">
                    <pre>{{ step.details }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 로그 콘솔 -->
      <div v-if="deploymentData.logs && deploymentData.logs.length > 0" class="deployment-logs">
        <div class="logs-header">
          <h3>배포 로그</h3>
          <div class="logs-actions">
            <button class="btn btn-ghost btn-sm btn-icon" @click="toggleAutoScroll">
              <i class="fas" :class="autoScroll ? 'fa-eye' : 'fa-eye-slash'"></i>
              <span>{{ autoScroll ? '자동 스크롤' : '자동 스크롤 해제' }}</span>
            </button>
            <button class="btn btn-ghost btn-sm btn-icon" @click="copyLogs">
              <i class="fas fa-copy"></i>
              <span>복사</span>
            </button>
          </div>
        </div>
        
        <div class="logs-container" ref="logsContainerRef">
          <div 
            v-for="(log, index) in deploymentData.logs" 
            :key="index" 
            class="log-line"
            :class="getLogClass(log)"
          >
            {{ log }}
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <div class="empty-content">
        <i class="fas fa-rocket empty-icon"></i>
        <h3>활성화된 배포가 없습니다</h3>
        <p>새로운 요구사항을 등록하고 배포를 시작해보세요.</p>
        <router-link to="/requirements" class="btn btn-primary btn-icon">
          <i class="fas fa-plus"></i>
          <span>요구사항 등록하기</span>
        </router-link>
      </div>
    </div>
    
    <!-- 취소 확인 모달 -->
    <div v-if="showCancelModal" class="modal-overlay" @click="showCancelModal = false">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>배포 취소 확인</h3>
          <button class="btn-close" @click="showCancelModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <p>정말로 현재 진행 중인 배포를 취소하시겠습니까?</p>
          <p class="text-danger">이 작업은 되돌릴 수 없습니다.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" @click="showCancelModal = false">
            취소
          </button>
          <button class="btn btn-danger" @click="cancelDeployment">
            배포 취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDeploymentStore } from '@/store/modules/deployment.store';

const router = useRouter();
const deploymentStore = useDeploymentStore();

// 상태 변수
const isLoading = ref(true);
const deploymentId = ref(null);
const expandedSteps = ref({});
const autoScroll = ref(true);
const showCancelModal = ref(false);
const logsContainerRef = ref(null);

// 웹소켓 구독 상태
let wsSubscribed = false;

// 컴포넌트 마운트 시 실행
onMounted(async () => {
  try {
    // URL에서 배포 ID 가져오기 또는 가장 최근 배포 가져오기
    const routeId = router.currentRoute.value.params.id;
    
    if (routeId) {
      await deploymentStore.getDeploymentById(routeId);
      deploymentId.value = routeId;
    } else {
      await deploymentStore.fetchLatestDeployment();
      deploymentId.value = deploymentStore.currentDeploymentId;
      
      // URL 업데이트
      if (deploymentId.value) {
        router.replace(`/deployments/${deploymentId.value}`);
      }
    }
    
    // WebSocket 구독 설정
    if (deploymentId.value && window.$wsService && !wsSubscribed) {
      window.$wsService.subscribeToDeployment(deploymentId.value);
      wsSubscribed = true;
    }
  } catch (error) {
    console.error('배포 상태 로딩 중 오류 발생:', error);
  } finally {
    isLoading.value = false;
  }
});

// 컴포넌트 언마운트 시 실행
onUnmounted(() => {
  // WebSocket 구독 해제
  if (deploymentId.value && window.$wsService && wsSubscribed) {
    window.$wsService.unsubscribeFromDeployment(deploymentId.value);
    wsSubscribed = false;
  }
});

// 현재 배포 데이터
const deploymentData = computed(() => {
  return deploymentStore.currentDeployment;
});

// 배포 상태 관련 계산된 속성
const isCompleted = computed(() => {
  return deploymentData.value?.status === 'completed';
});

const isInProgress = computed(() => {
  return deploymentData.value?.status === 'in-progress';
});

const isFailed = computed(() => {
  return deploymentData.value?.status === 'failed';
});

// 배포 소요 시간 계산
const calculateDuration = computed(() => {
  if (!deploymentData.value?.startTime) return '-';
  
  const startTime = new Date(deploymentData.value.startTime);
  const endTime = deploymentData.value.completedAt 
    ? new Date(deploymentData.value.completedAt) 
    : deploymentData.value.failedAt 
      ? new Date(deploymentData.value.failedAt) 
      : new Date();
  
  const durationMs = endTime - startTime;
  const seconds = Math.floor(durationMs / 1000);
  
  if (seconds < 60) {
    return `${seconds}초`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return `${minutes}분 ${remainingSeconds}초`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours}시간 ${remainingMinutes}분 ${remainingSeconds}초`;
});

// 배포 로그가 변경될 때 자동 스크롤
watch(
  () => deploymentData.value?.logs?.length,
  async () => {
    if (autoScroll.value && logsContainerRef.value) {
      await nextTick();
      logsContainerRef.value.scrollTop = logsContainerRef.value.scrollHeight;
    }
  }
);

// 상태에 따른 클래스 반환
const getStatusClass = (status) => {
  if (!status) return '';
  
  switch (status.toLowerCase()) {
    case 'completed':
      return 'status-success';
    case 'in-progress':
      return 'status-info';
    case 'failed':
      return 'status-error';
    default:
      return 'status-pending';
  }
};

// 단계 상태에 따른 클래스 반환
const getStepStatusClass = (status) => {
  if (!status) return '';
  
  switch (status) {
    case 'completed':
      return 'status-success';
    case 'in-progress':
      return 'status-info';
    case 'failed':
      return 'status-error';
    case 'pending':
      return 'status-pending';
    default:
      return '';
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

// 로그 라인 클래스 반환
const getLogClass = (log) => {
  if (!log) return '';
  
  const logLower = log.toLowerCase();
  
  if (logLower.includes('error') || logLower.includes('fail') || logLower.includes('exception')) {
    return 'log-error';
  }
  
  if (logLower.includes('warn')) {
    return 'log-warning';
  }
  
  if (logLower.includes('info')) {
    return 'log-info';
  }
  
  if (logLower.includes('success') || logLower.includes('complete')) {
    return 'log-success';
  }
  
  return '';
};

// 날짜 형식화
const formatDateTime = (timestamp) => {
  if (!timestamp) return '-';
  
  const date = new Date(timestamp);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  return date.toLocaleString('ko-KR', options);
};

// 시간 형식화
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  return date.toLocaleString('ko-KR', options);
};

// 단계 상세 정보 토글
const toggleStepDetails = (index) => {
  expandedSteps.value = {
    ...expandedSteps.value,
    [index]: !expandedSteps.value[index]
  };
};

// 자동 스크롤 토글
const toggleAutoScroll = () => {
  autoScroll.value = !autoScroll.value;
};

// 로그 복사
const copyLogs = () => {
  if (!deploymentData.value?.logs) return;
  
  const logsText = deploymentData.value.logs.join('\n');
  navigator.clipboard.writeText(logsText)
    .then(() => {
      alert('로그가 클립보드에 복사되었습니다.');
    })
    .catch((err) => {
      console.error('클립보드 복사 실패:', err);
      alert('로그 복사에 실패했습니다.');
    });
};

// 배포 취소 모달 표시
const confirmCancelDeployment = () => {
  showCancelModal.value = true;
};

// 배포 취소 실행
const cancelDeployment = async () => {
  if (!deploymentId.value) return;
  
  try {
    await deploymentStore.cancelDeployment(deploymentId.value);
    showCancelModal.value = false;
    
    // 모달 닫기 후 상태 업데이트
    setTimeout(() => {
      if (deploymentStore.currentDeployment) {
        deploymentStore.updateDeploymentStatus(deploymentId.value, {
          status: 'cancelled',
          overallProgress: deploymentData.value.overallProgress
        });
      }
    }, 300);
  } catch (error) {
    console.error('배포 취소 중 오류 발생:', error);
    alert('배포 취소에 실패했습니다.');
  }
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
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  position: relative;
}

.status-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 40px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: var(--radius-full);
}

/* 로딩 상태 */
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.loader-content {
  text-align: center;
}

.loader-content p {
  margin-top: var(--space-md);
  color: var(--gray-600);
}

/* 상태 요약 카드 */
.status-card {
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-lg);
}

.status-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
}

.summary-item {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 0.875rem;
  color: var(--gray-600);
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray-900);
}

.summary-value a {
  color: var(--primary);
  text-decoration: none;
}

.summary-value a:hover {
  text-decoration: underline;
}

/* 진행 상태 바 */
.status-progress {
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-lg);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.progress-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.progress-percentage {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary);
}

.progress-bar {
  height: 0.75rem;
  background-color: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}

.progress-animated {
  background-image: linear-gradient(45deg, 
    rgba(255, 255, 255, 0.15) 25%, 
    transparent 25%, 
    transparent 50%, 
    rgba(255, 255, 255, 0.15) 50%, 
    rgba(255, 255, 255, 0.15) 75%, 
    transparent 75%, 
    transparent);
  background-size: 1rem 1rem;
  animation: progress-animation 1s linear infinite;
}

@keyframes progress-animation {
  0% { background-position: 1rem 0; }
  100% { background-position: 0 0; }
}

/* 배포 단계 */
.deployment-steps {
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-lg);
}

.steps-title {
  margin: 0 0 var(--space-lg) 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.deployment-stepper {
  position: relative;
}

.stepper-item {
  display: flex;
  margin-bottom: var(--space-lg);
  position: relative;
}

.stepper-item:last-child {
  margin-bottom: 0;
}

.stepper-item::after {
  content: '';
  position: absolute;
  left: 16px;
  top: 30px;
  bottom: -30px;
  width: 2px;
  background-color: var(--gray-300);
  z-index: 1;
}

.stepper-item:last-child::after {
  display: none;
}

.stepper-item.completed::after {
  background-color: var(--success);
}

.stepper-item.active::after {
  background-color: var(--info);
}

.stepper-item.failed::after {
  background-color: var(--danger);
}

.stepper-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: var(--gray-300);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  margin-right: var(--space-md);
  position: relative;
  z-index: 2;
}

.stepper-item.completed .stepper-circle {
  background-color: var(--success);
}

.stepper-item.active .stepper-circle {
  background-color: var(--info);
}

.stepper-item.failed .stepper-circle {
  background-color: var(--danger);
}

.stepper-content {
  flex: 1;
}

.stepper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.stepper-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.stepper-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.stepper-time {
  font-size: 0.75rem;
  color: var(--gray-600);
}

.details-collapsible {
  background-color: var(--gray-100);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.details-toggle {
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  background-color: var(--gray-200);
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.details-content {
  padding: 1rem;
  font-size: 0.875rem;
  background-color: var(--gray-100);
  border-top: 1px solid var(--gray-200);
  max-height: 300px;
  overflow-y: auto;
}

.details-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: var(--font-family-mono);
}

/* 배포 로그 */
.deployment-logs {
  background-color: var(--gray-900);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  background-color: var(--gray-800);
  border-bottom: 1px solid var(--gray-700);
}

.logs-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--white);
}

.logs-actions {
  display: flex;
  gap: var(--space-sm);
}

.logs-actions .btn {
  color: var(--gray-300);
}

.logs-actions .btn:hover {
  color: var(--white);
}

.logs-container {
  padding: var(--space-md);
  height: 400px;
  overflow-y: auto;
  font-family: var(--font-family-mono);
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--gray-300);
}

.log-line {
  padding: 0.125rem 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.log-error {
  color: #ff6b6b;
}

.log-warning {
  color: #ffd166;
}

.log-info {
  color: #4cc9f0;
}

.log-success {
  color: #06d6a0;
}

/* 빈 상태 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  font-size: 4rem;
  color: var(--gray-300);
  margin-bottom: var(--space-md);
}

.empty-content h3 {
  margin-bottom: var(--space-md);
  font-size: 1.5rem;
  font-weight: 600;
}

.empty-content p {
  margin-bottom: var(--space-lg);
  color: var(--gray-600);
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  width: 100%;
  max-width: 500px;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--gray-200);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--gray-600);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: background-color var(--transition-fast);
}

.btn-close:hover {
  background-color: var(--gray-200);
}

.modal-content {
  padding: var(--space-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  padding: var(--space-lg);
  border-top: 1px solid var(--gray-200);
  background-color: var(--gray-100);
}

/* 반응형 */
@media (max-width: 768px) {
  .status-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }
  
  .stepper-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .logs-header {
    flex-direction: column;
    gap: var(--space-sm);
    align-items: flex-start;
  }
  
  .logs-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>