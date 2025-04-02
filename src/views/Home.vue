<template>
  <div class="dashboard">
    <!-- 대시보드 콘텐츠 -->
    <div class="dashboard-content">
      <!-- 워크플로우 다이어그램 -->
      <div class="workflow-section">
        <WorkflowDiagram />
      </div>

      <!-- 알림 및 빠른 액션 섹션 -->
      <div class="alerts-actions-section">
        <div class="alerts-card">
          <div class="card-header">
            <h2>최근 알림</h2>
            <button class="btn-link">모두 읽음</button>
          </div>
          <div class="card-content">
            <div class="alert-list">
              <div class="alert-item unread">
                <div class="alert-icon warning">
                  <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="alert-content">
                  <h4>배포 경고</h4>
                  <p>요구사항 #1025의 빌드 과정에서 경고가 발생했습니다.</p>
                  <span class="alert-time">5분 전</span>
                </div>
                <button class="alert-dismiss">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="alert-item unread">
                <div class="alert-icon success">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="alert-content">
                  <h4>배포 완료</h4>
                  <p>요구사항 #1023이 성공적으로 배포되었습니다.</p>
                  <span class="alert-time">15분 전</span>
                </div>
                <button class="alert-dismiss">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="alert-item">
                <div class="alert-icon info">
                  <i class="fas fa-info-circle"></i>
                </div>
                <div class="alert-content">
                  <h4>시스템 공지</h4>
                  <p>이번 주 금요일 오후 10시부터 시스템 점검이 예정되어 있습니다.</p>
                  <span class="alert-time">1시간 전</span>
                </div>
                <button class="alert-dismiss">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="quick-actions-card">
          <div class="card-header">
            <h2>빠른 작업</h2>
          </div>
          <div class="card-content">
            <div class="quick-actions-grid">
              <button class="quick-action-btn">
                <i class="fas fa-plus-circle"></i>
                <span>새 요구사항</span>
              </button>
              <button class="quick-action-btn">
                <i class="fas fa-rocket"></i>
                <span>배포 시작</span>
              </button>
              <button class="quick-action-btn">
                <i class="fas fa-history"></i>
                <span>배포 이력</span>
              </button>
              <button class="quick-action-btn">
                <i class="fas fa-chart-line"></i>
                <span>성능 분석</span>
              </button>
              <button class="quick-action-btn">
                <i class="fas fa-cog"></i>
                <span>설정</span>
              </button>
              <button class="quick-action-btn">
                <i class="fas fa-question-circle"></i>
                <span>도움말</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 통계 카드 섹션 -->
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon active">
              <i class="fas fa-rocket"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-label">진행 중인 배포</h3>
              <div class="stat-value">{{ activeDeployments.length || 3 }}</div>
              <div class="stat-change positive">
                <i class="fas fa-arrow-up"></i>
                <span>15% 지난 주 대비</span>
              </div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon completed">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-label">완료된 배포</h3>
              <div class="stat-value">{{ completedDeployments.length || 12 }}</div>
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
              <div class="stat-value">{{ failedDeployments.length || 1 }}</div>
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
              <div class="stat-value">{{ avgDeploymentTime || '25분' }}</div>
              <div class="stat-change positive">
                <i class="fas fa-arrow-down"></i>
                <span>8% 지난 주 대비</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 지표 차트 섹션 -->
      <div class="metrics-section">
        <div class="metrics-card">
          <div class="card-header">
            <h2>배포 성능 추이</h2>
            <div class="chart-controls">
              <button class="btn-link active">일간</button>
              <button class="btn-link">주간</button>
              <button class="btn-link">월간</button>
            </div>
          </div>
          <div class="card-content">
            <div class="performance-chart">
              <!-- 여기에 실제 차트 렌더링 -->
              <div class="chart-placeholder">
                <div class="chart-area">
                  <div class="chart-point" style="bottom: 30%; left: 10%"></div>
                  <div class="chart-point" style="bottom: 45%; left: 25%"></div>
                  <div class="chart-point" style="bottom: 60%; left: 40%"></div>
                  <div class="chart-point" style="bottom: 55%; left: 55%"></div>
                  <div class="chart-point" style="bottom: 65%; left: 70%"></div>
                  <div class="chart-point active" style="bottom: 75%; left: 85%"></div>
                  
                  <div class="chart-line"></div>
                </div>
                <div class="chart-labels">
                  <span>월</span>
                  <span>화</span>
                  <span>수</span>
                  <span>목</span>
                  <span>금</span>
                  <span>토</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 데이터 그리드 섹션 -->
      <div class="data-grid-section">
        <!-- 최근 요구사항 카드 -->
        <div class="requirements-card">
          <div class="card-header">
            <h2>최근 요구사항</h2>
            <router-link to="/requirements" class="btn-link">
              모두 보기 <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div class="card-content">
            <div class="requirements-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>제목</th>
                    <th>우선순위</th>
                    <th>상태</th>
                    <th>등록일</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(req, index) in recentRequirements" :key="req.id || index">
                    <td>#{{ req.id || 1000 + index }}</td>
                    <td class="title-cell">{{ req.title || `요구사항 예시 ${index + 1}` }}</td>
                    <td>
                      <span class="status-tag" :class="getPriorityClass(req.priority || (index % 3 === 0 ? 'high' : index % 3 === 1 ? 'medium' : 'low'))">
                        {{ getPriorityText(req.priority || (index % 3 === 0 ? 'high' : index % 3 === 1 ? 'medium' : 'low')) }}
                      </span>
                    </td>
                    <td>
                      <span class="status-tag" :class="getStatusClass(req.status || (index % 4 === 0 ? 'in-progress' : index % 4 === 1 ? 'completed' : index % 4 === 2 ? 'pending' : 'review'))">
                        {{ getStatusText(req.status || (index % 4 === 0 ? 'in-progress' : index % 4 === 1 ? 'completed' : index % 4 === 2 ? 'pending' : 'review')) }}
                      </span>
                    </td>
                    <td>{{ formatDate(req.createdAt) || '2023-07-' + (20 + index) }}</td>
                    <td class="actions-cell">
                      <button class="action-icon" title="상세 보기">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="action-icon" title="배포 시작" v-if="!req.deploymentId">
                        <i class="fas fa-rocket"></i>
                      </button>
                      <button class="action-icon" title="수정">
                        <i class="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 최근 배포 카드 -->
        <div class="deployments-card">
          <div class="card-header">
            <h2>최근 배포</h2>
            <router-link to="/deployments" class="btn-link">
              모두 보기 <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div class="card-content">
            <div class="deployments-grid">
              <div v-for="(dep, index) in recentDeployments.length ? recentDeployments : [1, 2, 3, 4]" :key="dep.id || index" class="deployment-item">
                <div class="deployment-header">
                  <h4>요구사항 #{{ dep.requirementId || 1000 + index }}</h4>
                  <span class="status-tag" :class="getDeploymentStatusClass(dep.status || (index % 3 === 0 ? 'in-progress' : index % 3 === 1 ? 'completed' : 'failed'))">
                    {{ getDeploymentStatusText(dep.status || (index % 3 === 0 ? 'in-progress' : index % 3 === 1 ? 'completed' : 'failed')) }}
                  </span>
                </div>
                
                <div class="deployment-progress">
                  <div class="progress-label">
                    <span>{{ dep.currentStep || '이미지 빌드' }}</span>
                    <span>{{ dep.overallProgress || (index % 3 === 0 ? 65 : index % 3 === 1 ? 100 : 42) }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" 
                      :style="{ width: `${dep.overallProgress || (index % 3 === 0 ? 65 : index % 3 === 1 ? 100 : 42)}%` }"
                      :class="{'progress-animated': dep.status === 'in-progress' || index % 3 === 0 }">
                    </div>
                  </div>
                </div>
                
                <div class="deployment-footer">
                  <span class="deployment-date">
                    <i class="far fa-clock"></i>
                    {{ formatTimeAgo(dep.startTime) || (index === 0 ? '10분 전' : index === 1 ? '3시간 전' : index === 2 ? '어제' : '2일 전') }}
                  </span>
                  
                  <button class="btn-icon">
                    <i class="fas fa-external-link-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 시스템 상태 및 활동 섹션 -->
      <div class="status-activity-section">
        <!-- 시스템 상태 카드 -->
        <div class="system-status-card">
          <div class="card-header">
            <h2>시스템 상태</h2>
            <span class="status-badge online">
              <i class="fas fa-check-circle"></i> 정상
            </span>
          </div>
          <div class="card-content">
            <div class="status-grid">
              <div class="status-item">
                <div class="status-item-header">
                  <h4>GitLab</h4>
                  <span class="status-dot online"></span>
                </div>
                <div class="status-details">
                  <div class="status-metric">
                    <span>응답 시간</span>
                    <span>120ms</span>
                  </div>
                  <div class="status-metric">
                    <span>가용성</span>
                    <span>99.9%</span>
                  </div>
                </div>
              </div>
              
              <div class="status-item">
                <div class="status-item-header">
                  <h4>Jenkins</h4>
                  <span class="status-dot online"></span>
                </div>
                <div class="status-details">
                  <div class="status-metric">
                    <span>응답 시간</span>
                    <span>180ms</span>
                  </div>
                  <div class="status-metric">
                    <span>가용성</span>
                    <span>99.8%</span>
                  </div>
                </div>
              </div>
              
              <div class="status-item">
                <div class="status-item-header">
                  <h4>ArgoCD</h4>
                  <span class="status-dot warning"></span>
                </div>
                <div class="status-details">
                  <div class="status-metric">
                    <span>응답 시간</span>
                    <span>250ms</span>
                  </div>
                  <div class="status-metric">
                    <span>가용성</span>
                    <span>98.5%</span>
                  </div>
                </div>
              </div>
              
              <div class="status-item">
                <div class="status-item-header">
                  <h4>Kubernetes</h4>
                  <span class="status-dot online"></span>
                </div>
                <div class="status-details">
                  <div class="status-metric">
                    <span>응답 시간</span>
                    <span>150ms</span>
                  </div>
                  <div class="status-metric">
                    <span>가용성</span>
                    <span>99.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 활동 피드 카드 -->
        <div class="activity-feed-card">
          <div class="card-header">
            <h2>최근 활동</h2>
            <div class="feed-filter">
              <select>
                <option>모든 활동</option>
                <option>배포</option>
                <option>빌드</option>
                <option>요구사항</option>
              </select>
            </div>
          </div>
          <div class="card-content">
            <div class="activity-timeline">
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
                  <div class="timeline-actions">
                    <button class="btn-link">상세 보기</button>
                  </div>
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
                  <div class="timeline-actions">
                    <button class="btn-link">모니터링</button>
                  </div>
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
                  <div class="timeline-actions">
                    <button class="btn-link">상세 보기</button>
                  </div>
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
                  <div class="timeline-details">
                    <pre>Error: 이미지 빌드 중 컴파일 오류 발생 (Exit code: 1)</pre>
                  </div>
                  <div class="timeline-actions">
                    <button class="btn-link">로그 보기</button>
                    <button class="btn-link">재시도</button>
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

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRequirementStore } from '@/store/modules/requirement';
import { useDeploymentStore } from '@/store/modules/deployment';
import WorkflowDiagram from '@/components/common/WorkflowDiagram.vue';

const router = useRouter();
const requirementStore = useRequirementStore();
const deploymentStore = useDeploymentStore();

// 상태
const isLoading = ref(false);
const activeDeploymentsIncreased = ref(true);
const activeDeploymentsChange = ref(15);

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  try {
    isLoading.value = true;
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
  return requirementStore.requirements.slice(0, 5);
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

// 상태 클래스
const getStatusClass = (status) => {
  if (!status) return '';
  
  switch (status.toLowerCase()) {
    case 'completed':
      return 'status-success';
    case 'in-progress':
      return 'status-info';
    case 'pending':
      return 'status-pending';
    case 'review':
      return 'status-warning';
    case 'failed':
      return 'status-error';
    default:
      return '';
  }
};

// 상태 텍스트
const getStatusText = (status) => {
  if (!status) return '';
  
  switch (status.toLowerCase()) {
    case 'completed':
      return '완료';
    case 'in-progress':
      return '진행 중';
    case 'pending':
      return '대기 중';
    case 'review':
      return '검토 중';
    case 'failed':
      return '실패';
    default:
      return status;
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

<style scoped>
.dashboard {
  min-height: calc(100vh - 200px);
}

/* 메인 레이아웃 컨테이너 */
.dashboard-content {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "workflow"
    "alerts-actions"
    "stats"
    "metrics"
    "data-grid"
    "status-activity";
  gap: 1.5rem;
}

/* 워크플로우 섹션 */
.workflow-section {
  grid-area: workflow;
}

/* 알림 및 빠른 액션 섹션 */
.alerts-actions-section {
  grid-area: alerts-actions;
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1.5rem;
}

.alerts-card, .quick-actions-card {
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  background-color: var(--gray-50);
  position: relative;
}

.alert-item.unread {
  background-color: rgba(76, 201, 240, 0.05);
  border-left: 3px solid var(--info);
}

.alert-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.alert-icon.warning {
  background-color: rgba(255, 159, 28, 0.1);
  color: var(--warning);
}

.alert-icon.success {
  background-color: rgba(6, 214, 160, 0.1);
  color: var(--success);
}

.alert-icon.info {
  background-color: rgba(67, 97, 238, 0.1);
  color: var(--primary);
}

.alert-icon.error {
  background-color: rgba(230, 57, 70, 0.1);
  color: var(--danger);
}

.alert-content {
  flex: 1;
}

.alert-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.alert-content p {
  margin: 0 0 0.25rem 0;
  font-size: 0.85rem;
  color: var(--gray-700);
}

.alert-time {
  font-size: 0.75rem;
  color: var(--gray-500);
}

.alert-dismiss {
  background: transparent;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 0.25rem;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.alert-dismiss:hover {
  background-color: var(--gray-200);
  color: var(--gray-700);
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-action-btn:hover {
  background-color: var(--primary-light);
  color: var(--white);
  transform: translateY(-2px);
}

.quick-action-btn i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.quick-action-btn span {
  font-size: 0.8rem;
  font-weight: 500;
}

/* 통계 섹션 */
.stats-section {
  grid-area: stats;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.25rem;
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

/* 지표 차트 섹션 */
.metrics-section {
  grid-area: metrics;
}

.metrics-card {
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.chart-controls {
  display: flex;
  gap: 0.75rem;
}

.chart-placeholder {
  height: 250px;
  position: relative;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.chart-area {
  flex: 1;
  position: relative;
  border-bottom: 1px solid var(--gray-200);
}

.chart-point {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: var(--primary);
  border-radius: 50%;
  transform: translate(-50%, 50%);
}

.chart-point.active {
  width: 14px;
  height: 14px;
  background-color: var(--primary-dark);
  box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.2);
}

.chart-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right top, transparent 49.9%, var(--primary) 49.9%, var(--primary) 50.1%, transparent 50.1%),
              linear-gradient(to right bottom, transparent 49.9%, var(--primary) 49.9%, var(--primary) 50.1%, transparent 50.1%);
  background-size: 10px 10px;
  background-position: 0 0;
  opacity: 0.1;
  pointer-events: none;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.25rem;
  margin-left: 10%;
  margin-right: 10%;
}

.chart-labels span {
  font-size: 0.75rem;
  color: var(--gray-600);
}

/* 데이터 그리드 섹션 */
.data-grid-section {
  grid-area: data-grid;
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1.5rem;
}

.requirements-card, .deployments-card {
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.requirements-table {
  overflow-x: auto;
}

.requirements-table table {
  width: 100%;
  border-collapse: collapse;
}

.requirements-table th, .requirements-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--gray-200);
}

.requirements-table th {
  font-weight: 600;
  color: var(--gray-700);
  background-color: var(--gray-50);
}

.requirements-table tr:last-child td {
  border-bottom: none;
}

.requirements-table .title-cell {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions-cell {
  white-space: nowrap;
}

.action-icon {
  background: transparent;
  border: none;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--gray-600);
  transition: all 0.2s ease;
  margin-right: 0.25rem;
  cursor: pointer;
}

.action-icon:hover {
  background-color: var(--gray-100);
  color: var(--primary);
}

.deployments-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.deployment-item {
  background-color: var(--gray-50);
  border-radius: var(--radius-md);
  padding: 0.75rem;
}

.deployment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.deployment-header h4 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.deployment-progress {
  margin-bottom: 0.75rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--gray-600);
  margin-bottom: 0.25rem;
}

.progress-bar {
  height: 6px;
  background-color: var(--gray-200);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary);
  border-radius: 3px;
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

.deployment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--gray-600);
}

.deployment-date i {
  margin-right: 0.25rem;
}

.btn-icon {
  background: transparent;
  border: none;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--gray-600);
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-icon:hover {
  background-color: var(--gray-200);
  color: var(--primary);
}

/* 시스템 상태 및 활동 섹션 */
.status-activity-section {
  grid-area: status-activity;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
}

.system-status-card, .activity-feed-card {
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.online {
  background-color: rgba(6, 214, 160, 0.1);
  color: var(--success);
}

.status-badge.warning {
  background-color: rgba(255, 159, 28, 0.1);
  color: var(--warning);
}

.status-badge.offline {
  background-color: rgba(230, 57, 70, 0.1);
  color: var(--danger);
}

.status-badge i {
  margin-right: 0.25rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.status-item {
  background-color: var(--gray-50);
  border-radius: var(--radius-md);
  padding: 0.75rem;
}

.status-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.status-item-header h4 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot.online {
  background-color: var(--success);
}

.status-dot.warning {
  background-color: var(--warning);
}

.status-dot.offline {
  background-color: var(--danger);
}

.status-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-metric {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--gray-600);
}

.feed-filter {
  min-width: 120px;
}

.feed-filter select {
  width: 100%;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--gray-700);
  background-color: var(--white);
}

.activity-timeline {
  position: relative;
  padding-left: 2rem;
}

.activity-timeline::before {
  content: '';
  position: absolute;
  top: 0;
  left: 8px;
  bottom: 0;
  width: 2px;
  background-color: var(--gray-200);
}

.timeline-item {
  position: relative;
  margin-bottom: 1.25rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-icon {
  position: absolute;
  left: -2rem;
  top: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: var(--white);
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
  background-color: var(--gray-50);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  position: relative;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timeline-header h4 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.timeline-time {
  font-size: 0.75rem;
  color: var(--gray-500);
}

.timeline-content p {
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  color: var(--gray-700);
}

.timeline-details {
  background-color: var(--gray-100);
  border-radius: var(--radius-sm);
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  overflow-x: auto;
}

.timeline-details pre {
  margin: 0;
  font-size: 0.8rem;
  font-family: monospace;
  color: var(--gray-800);
  white-space: pre-wrap;
}

.timeline-actions {
  display: flex;
  gap: 0.75rem;
}

/* 공통 스타일 */
.card-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gray-800);
}

.card-content {
  padding: 1rem 1.25rem;
  flex: 1;
  overflow-y: auto;
}

.btn-link {
  background: transparent;
  border: none;
  color: var(--primary);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s ease;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

.btn-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.btn-link.active {
  font-weight: 600;
  color: var(--primary-dark);
}

.btn-link i {
  margin-left: 0.25rem;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
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
@media (min-width: 1200px) {
  .dashboard-content {
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      "workflow workflow workflow workflow"
      "alerts-actions alerts-actions alerts-actions alerts-actions"
      "stats stats stats stats"
      "metrics metrics metrics metrics"
      "data-grid data-grid data-grid data-grid"
      "status-activity status-activity status-activity status-activity";
  }
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .data-grid-section {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
  
  .status-activity-section {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
  
  .alerts-actions-section {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
  
  .deployments-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>