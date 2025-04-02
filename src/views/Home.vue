<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRequirementStore } from '@/store/modules/requirement';
import { useDeploymentStore } from '@/store/modules/deployment';
import WorkflowDiagram from '@/components/common/WorkflowDiagram.vue'; // 워크플로우 다이어그램 컴포넌트 추가

const router = useRouter();
const requirementStore = useRequirementStore();
const deploymentStore = useDeploymentStore();

// 상태
const isLoading = ref(true);
const activeDeploymentsIncreased = ref(true);
const activeDeploymentsChange = ref(15);

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  try {
    await Promise.all([
      requirementStore.fetchRequirements(),
      deploymentStore.fetchLatestDeployment()
    ]);
  } catch (error) {
    console.error('데이터 로딩 중 오류 발생:', error);
  } finally {
    isLoading.value = false;
  }
});

// 최근 요구사항 목록
const recentRequirements = computed(() => {
  return requirementStore.requirements.slice(0, 4);
});

// 최근 배포 목록
const recentDeployments = computed(() => {
  return deploymentStore.recentDeployments?.slice(0, 4) || [];
});

// 활성화된 배포 여부
const hasActiveDeployment = computed(() => {
  return deploymentStore.activeDeployments?.length > 0;
});

// 진행 중인 배포 작업
const activeDeployments = computed(() => {
  return deploymentStore.activeDeployments || [];
});

// 완료된 배포 작업
const completedDeployments = computed(() => {
  return deploymentStore.completedDeployments || [];
});

// 실패한 배포 작업
const failedDeployments = computed(() => {
  return deploymentStore.failedDeployments || [];
});

// 평균 배포 소요 시간
const avgDeploymentTime = computed(() => {
  return deploymentStore.averageDeploymentTime || '25분';
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
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
};

// 경과 시간 형식화
const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}일 전`;
  
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}개월 전`;
};

// 우선순위 클래스
const getPriorityClass = (priority) => {
  if (!priority) return '';
  
  switch (priority.toLowerCase()) {
    case 'high':
      return 'status-error';
    case 'medium':
      return 'status-warning';
    case 'low':
      return 'status-success';
    default:
      return '';
  }
};

// 우선순위 텍스트
const getPriorityText = (priority) => {
  if (!priority) return '';
  
  switch (priority.toLowerCase()) {
    case 'high':
      return '높음';
    case 'medium':
      return '중간';
    case 'low':
      return '낮음';
    default:
      return priority;
  }
};

// 배포 상태 클래스
const getDeploymentStatusClass = (status) => {
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

// 배포 상태 텍스트
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

// 라우팅 함수
const navigateToRequirements = () => {
  router.push('/requirements');
};

const viewRequirement = (requirementId) => {
  router.push(`/requirements/${requirementId}`);
};

const viewDeployment = (deploymentId) => {
  router.push(`/deployments/${deploymentId}`);
};

// 배포 시작
const startDeployment = async (requirementId) => {
  try {
    await deploymentStore.startDeployment(requirementId);
    router.push(`/deployments/${deploymentStore.currentDeploymentId}`);
  } catch (error) {
    console.error('배포 시작 중 오류 발생:', error);
  }
};
</script>

<template>
  <div class="dashboard">
    <div class="container">
      <!-- 대시보드 헤더 -->
      <div class="dashboard-header mb-4">
        <h1 class="page-title">대시보드</h1>
        <div class="dashboard-actions">
          <router-link to="/requirements/new" class="btn btn-primary btn-icon">
            <i class="fas fa-plus"></i>
            <span>새 요구사항</span>
          </router-link>
        </div>
      </div>
      
      <!-- 워크플로우 다이어그램 추가 -->
      <WorkflowDiagram class="mb-5" />

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>데이터를 불러오는 중...</p>
      </div>
      
      <!-- 대시보드 콘텐츠 -->
      <div v-else class="dashboard-content">
        <!-- 요약 카드 섹션 -->
        <div class="stats-grid mb-5">
          <div class="stat-card">
            <div class="stat-icon active">
              <i class="fas fa-rocket"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-label">진행 중인 배포</h3>
              <div class="stat-value">{{ activeDeployments.length }}</div>
              <div class="stat-change" :class="activeDeploymentsIncreased ? 'positive' : 'negative'">
                <i :class="activeDeploymentsIncreased ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                <span>{{ activeDeploymentsChange }}% 지난 주 대비</span>
              </div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon completed">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-label">완료된 배포</h3>
              <div class="stat-value">{{ completedDeployments.length }}</div>
              <div class="stat-change positive">
                <i class="fas fa-arrow-up"></i>
                <span>12% 지난 주 대비</span>
              </div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon failed">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-label">실패한 배포</h3>
              <div class="stat-value">{{ failedDeployments.length }}</div>
              <div class="stat-change negative">
                <i class="fas fa-arrow-down"></i>
                <span>5% 지난 주 대비</span>
              </div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-label">평균 배포 시간</h3>
              <div class="stat-value">{{ avgDeploymentTime }}</div>
              <div class="stat-change positive">
                <i class="fas fa-arrow-down"></i>
                <span>8% 지난 주 대비</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 메인 콘텐츠 그리드 -->
        <div class="dashboard-grid">
          <!-- 최근 요구사항 카드 -->
          <div class="dashboard-card recent-requirements">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h2>최근 요구사항</h2>
              <router-link to="/requirements" class="btn btn-ghost btn-sm">
                모두 보기
                <i class="fas fa-chevron-right"></i>
              </router-link>
            </div>
            
            <div class="card-content">
              <div v-if="recentRequirements.length > 0" class="requirement-list">
                <div 
                  v-for="req in recentRequirements" 
                  :key="req.id" 
                  class="requirement-item"
                  @click="viewRequirement(req.id)"
                >
                  <div class="req-header d-flex justify-content-between">
                    <h4 class="req-title">{{ req.title }}</h4>
                    <span 
                      class="status-tag" 
                      :class="getPriorityClass(req.priority)"
                    >
                      {{ getPriorityText(req.priority) }}
                    </span>
                  </div>
                  
                  <p class="req-description">{{ truncateText(req.description, 120) }}</p>
                  
                  <div class="req-footer d-flex justify-content-between align-items-center">
                    <div class="req-meta">
                      <span class="req-date">
                        <i class="far fa-calendar-alt"></i>
                        {{ formatDate(req.createdAt) }}
                      </span>
                    </div>
                    
                    <button 
                      v-if="!req.deploymentId"
                      class="btn btn-sm btn-outline-primary"
                      @click.stop="startDeployment(req.id)"
                    >
                      <i class="fas fa-rocket"></i> 배포 시작
                    </button>
                    <span 
                      v-else 
                      class="status-tag"
                      :class="getDeploymentStatusClass(req.deploymentStatus)"
                      @click.stop="viewDeployment(req.deploymentId)"
                    >
                      {{ getDeploymentStatusText(req.deploymentStatus) }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div v-else class="empty-state">
                <i class="fas fa-clipboard-list empty-icon"></i>
                <p>등록된 요구사항이 없습니다.</p>
                <router-link to="/requirements/new" class="btn btn-outline-primary">
                  새 요구사항 등록하기
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- 최근 배포 카드 -->
          <div class="dashboard-card recent-deployments">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h2>최근 배포</h2>
              <router-link to="/deployments" class="btn btn-ghost btn-sm">
                모두 보기
                <i class="fas fa-chevron-right"></i>
              </router-link>
            </div>
            
            <div class="card-content">
              <div v-if="recentDeployments.length > 0" class="deployment-list">
                <div 
                  v-for="dep in recentDeployments" 
                  :key="dep.id" 
                  class="deployment-item"
                  @click="viewDeployment(dep.id)"
                >
                  <div class="deployment-header d-flex justify-content-between align-items-center">
                    <h4 class="deployment-title">요구사항 #{{ dep.requirementId }}</h4>
                    <span 
                      class="status-tag" 
                      :class="getDeploymentStatusClass(dep.status)"
                    >
                      {{ getDeploymentStatusText(dep.status) }}
                    </span>
                  </div>
                  
                  <div class="deployment-progress">
                    <div class="progress-label d-flex justify-content-between">
                      <span>{{ dep.currentStep || '준비 중' }}</span>
                      <span>{{ dep.overallProgress || 0 }}%</span>
                    </div>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :style="{ width: `${dep.overallProgress || 0}%` }"
                        :class="{'progress-animated': dep.status === 'in-progress'}"
                      ></div>
                    </div>
                  </div>
                  
                  <div class="deployment-footer d-flex justify-content-between align-items-center">
                    <span class="deployment-date">
                      <i class="far fa-clock"></i>
                      {{ formatTimeAgo(dep.startTime) }}
                    </span>
                    
                    <button class="btn btn-sm btn-ghost">
                      <i class="fas fa-external-link-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <div v-else class="empty-state">
                <i class="fas fa-rocket empty-icon"></i>
                <p>최근 배포 작업이 없습니다.</p>
                <button 
                  class="btn btn-outline-primary"
                  :disabled="recentRequirements.length === 0"
                  @click="navigateToRequirements"
                >
                  요구사항 확인하기
                </button>
              </div>
            </div>
          </div>
          
          <!-- 배포 활동 그래프 -->
          <div class="dashboard-card deployment-activity">
            <div class="card-header">
              <h2>배포 활동</h2>
            </div>
            
            <div class="card-content">
              <div class="chart-container">
                <!-- 이 부분에 차트 컴포넌트를 추가할 수 있습니다 -->
                <div class="placeholder-chart">
                  <div class="bar-chart">
                    <div class="chart-bar" style="height: 70%;"><span>월</span></div>
                    <div class="chart-bar" style="height: 50%;"><span>화</span></div>
                    <div class="chart-bar" style="height: 80%;"><span>수</span></div>
                    <div class="chart-bar" style="height: 65%;"><span>목</span></div>
                    <div class="chart-bar active" style="height: 90%;"><span>금</span></div>
                    <div class="chart-bar" style="height: 40%;"><span>토</span></div>
                    <div class="chart-bar" style="height: 30%;"><span>일</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 최근 활동 피드 -->
          <div class="dashboard-card activity-feed">
            <div class="card-header">
              <h2>최근 활동</h2>
            </div>
            
            <div class="card-content">
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-icon completed">
                    <i class="fas fa-check"></i>
                  </div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <h4>배포 완료</h4>
                      <span class="timeline-time">10분 전</span>
                    </div>
                    <p>요구사항 #1023 배포가 성공적으로 완료되었습니다.</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-icon active">
                    <i class="fas fa-spinner"></i>
                  </div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <h4>배포 시작</h4>
                      <span class="timeline-time">1시간 전</span>
                    </div>
                    <p>요구사항 #1025에 대한 배포가 시작되었습니다.</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-icon info">
                    <i class="fas fa-file-alt"></i>
                  </div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <h4>요구사항 등록</h4>
                      <span class="timeline-time">3시간 전</span>
                    </div>
                    <p>새로운 요구사항 #1026이 등록되었습니다.</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-icon failed">
                    <i class="fas fa-times"></i>
                  </div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <h4>배포 실패</h4>
                      <span class="timeline-time">어제</span>
                    </div>
                    <p>요구사항 #1022 배포 중 오류가 발생했습니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.dashboard {
  padding: var(--space-lg) 0;
  min-height: calc(100vh - 200px);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: var(--gray-900);
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 40px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: var(--radius-full);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xxl);
}

.loading-container p {
  margin-top: var(--space-md);
  color: var(--gray-600);
}

/* 통계 카드 스타일 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.stat-card {
  display: flex;
  align-items: center;
  padding: var(--space-lg);
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-right: var(--space-md);
  border-radius: var(--radius-lg);
  background-color: rgba(67, 97, 238, 0.1);
  color: var(--primary);
  font-size: 1.5rem;
}

.stat-icon.active {
  background-color: rgba(76, 201, 240, 0.1);
  color: var(--info);
}

.stat-icon.completed {
  background-color: rgba(6, 214, 160, 0.1);
  color: var(--success);
}

.stat-icon.failed {
  background-color: rgba(230, 57, 70, 0.1);
  color: var(--danger);
}

.stat-content {
  flex: 1;
}

.stat-label {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-600);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--gray-900);
}

.stat-change {
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.stat-change.positive {
  color: var(--success);
}

.stat-change.negative {
  color: var(--danger);
}

.stat-change i {
  margin-right: 0.25rem;
}

/* 대시보드 그리드 레이아웃 */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "requirements deployments"
    "activity chart";
  gap: var(--space-lg);
}

.recent-requirements {
  grid-area: requirements;
}

.recent-deployments {
  grid-area: deployments;
}

.deployment-activity {
  grid-area: chart;
}

.activity-feed {
  grid-area: activity;
}

.dashboard-card {
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--gray-200);
}

.card-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
}

.card-content {
  padding: var(--space-lg);
  overflow-y: auto;
  flex: 1;
}

/* 요구사항 아이템 스타일 */
.requirement-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.requirement-item {
  padding: var(--space-md);
  background-color: var(--gray-100);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.requirement-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.req-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.req-description {
  margin: var(--space-sm) 0;
  font-size: 0.875rem;
  color: var(--gray-600);
  line-height: 1.5;
}

.req-footer {
  margin-top: var(--space-sm);
  font-size: 0.75rem;
}

.req-meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  color: var(--gray-600);
}

.req-date i {
  margin-right: 0.25rem;
}

/* 배포 아이템 스타일 */
.deployment-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.deployment-item {
  padding: var(--space-md);
  background-color: var(--gray-100);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.deployment-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.deployment-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.deployment-progress {
  margin: var(--space-sm) 0;
}

.progress-label {
  font-size: 0.75rem;
  color: var(--gray-600);
  margin-bottom: 0.25rem;
}

.progress-bar {
  height: 0.5rem;
  background-color: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary);
  border-radius: var(--radius-full);
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

.deployment-footer {
  margin-top: var(--space-sm);
  font-size: 0.75rem;
  color: var(--gray-600);
}

.deployment-date i {
  margin-right: 0.25rem;
}

/* 타임라인 스타일 */
.timeline {
  position: relative;
  padding-left: var(--space-lg);
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 6px;
  width: 2px;
  background-color: var(--gray-200);
}

.timeline-item {
  position: relative;
  margin-bottom: var(--space-lg);
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-icon {
  position: absolute;
  top: 0;
  left: -36px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--gray-300);
  color: var(--white);
  font-size: 0.75rem;
  z-index: 1;
}

.timeline-icon.completed {
  background-color: var(--success);
}

.timeline-icon.active {
  background-color: var(--info);
}

.timeline-icon.failed {
  background-color: var(--danger);
}

.timeline-icon.info {
  background-color: var(--primary);
}

.timeline-content {
  padding-left: var(--space-sm);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.timeline-header h4 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.timeline-time {
  font-size: 0.75rem;
  color: var(--gray-500);
}

.timeline-content p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--gray-600);
}

/* 차트 플레이스홀더 */
.chart-container {
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-chart {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: var(--space-md);
}

.bar-chart {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.chart-bar {
  width: 12%;
  background-color: rgba(67, 97, 238, 0.2);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  position: relative;
  transition: all var(--transition-normal);
}

.chart-bar:hover {
  transform: scaleY(1.05);
  background-color: rgba(67, 97, 238, 0.4);
}

.chart-bar.active {
  background-color: rgba(67, 97, 238, 0.6);
}

.chart-bar span {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--gray-600);
}

/* 빈 상태 스타일 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  text-align: center;
}

.empty-icon {
  font-size: 2.5rem;
  color: var(--gray-300);
  margin-bottom: var(--space-md);
}

.empty-state p {
  margin-bottom: var(--space-md);
  color: var(--gray-600);
}

/* 상태 태그 스타일 */
.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
}

.status-success {
  background-color: rgba(6, 214, 160, 0.1);
  color: #05a77e;
}

.status-info {
  background-color: rgba(76, 201, 240, 0.1);
  color: #1080ac;
}

.status-error {
  background-color: rgba(230, 57, 70, 0.1);
  color: #c2242f;
}

.status-warning {
  background-color: rgba(255, 159, 28, 0.1);
  color: #d17b00;
}

.status-pending {
  background-color: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

/* 반응형 레이아웃 */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "requirements"
      "deployments"
      "chart"
      "activity";
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }
}
</style>