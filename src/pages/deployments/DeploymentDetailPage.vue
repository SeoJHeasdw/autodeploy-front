<template>
  <div class="deployment-detail-page">
    <div class="page-header">
      <div class="header-breadcrumb">
        <router-link to="/deployments" class="breadcrumb-link">
          <i class="fas fa-arrow-left"></i> 배포 목록
        </router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">배포 상세</span>
      </div>
      <div class="header-actions" v-if="requirement">
        <button 
          v-if="isDeploymentActive" 
          class="btn-danger"
          @click="confirmCancelDeployment"
        >
          <i class="fas fa-stop-circle"></i> 배포 취소
        </button>
        <router-link :to="`/requirements/${requirementId}`" class="btn-secondary">
          <i class="fas fa-clipboard-list"></i> 요구사항 보기
        </router-link>
      </div>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>데이터를 불러오는 중...</p>
    </div>

    <template v-else-if="requirement">
      <!-- 요구사항 및 배포 요약 정보 -->
      <div class="info-cards">
        <div class="requirement-card">
          <div class="card-header">
            <h2>요구사항 정보</h2>
            <span class="priority-badge" :class="getPriorityClass(requirement.priority)">
              {{ getPriorityText(requirement.priority) }}
            </span>
          </div>
          <div class="card-content">
            <h1 class="requirement-title">{{ requirement.title }}</h1>
            <div class="requirement-meta">
              <div class="meta-item">
                <span class="meta-label">요청 ID:</span>
                <span class="meta-value">#{{ requirementId }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">요청일:</span>
                <span class="meta-value">{{ formatDate(requirement.createdAt) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">마감일:</span>
                <span class="meta-value">{{ formatDate(requirement.deadline) || '미지정' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">담당자:</span>
                <span class="meta-value">{{ requirement.assignee || '미배정' }}</span>
              </div>
            </div>
            <div class="requirement-description">
              <h3>상세 설명</h3>
              <p>{{ requirement.description }}</p>
            </div>
          </div>
        </div>

        <div class="deployment-status-card">
          <div class="card-header">
            <h2>배포 상태</h2>
            <span class="status-badge" :class="getStatusClass(deploymentStatus)">
              {{ getStatusText(deploymentStatus) }}
            </span>
          </div>
          <div class="card-content">
            <div class="deployment-progress">
              <div class="progress-header">
                <h3>전체 진행률</h3>
                <span class="progress-percentage">{{ deploymentProgress }}%</span>
              </div>
              <div class="progress-bar-container">
                <div 
                  class="progress-bar" 
                  :class="getProgressClass(deploymentStatus)"
                  :style="{ width: `${deploymentProgress}%` }"
                ></div>
              </div>
            </div>

            <div class="deployment-timeline">
              <div class="timeline-header">
                <h3>배포 타임라인</h3>
              </div>
              <div class="timeline">
                <div 
                  v-for="(step, index) in deploymentSteps" 
                  :key="index" 
                  class="timeline-item"
                  :class="{ 
                    'completed': step.status === 'completed',
                    'active': step.status === 'in-progress',
                    'failed': step.status === 'failed'
                  }"
                >
                  <div class="timeline-marker">
                    <div class="marker-icon">
                      <i v-if="step.status === 'completed'" class="fas fa-check"></i>
                      <i v-else-if="step.status === 'in-progress'" class="fas fa-spinner fa-spin"></i>
                      <i v-else-if="step.status === 'failed'" class="fas fa-times"></i>
                      <template v-else>{{ index + 1 }}</template>
                    </div>
                  </div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <h4 class="timeline-title">{{ step.name }}</h4>
                      <div class="timeline-info">
                        <span class="status-badge small" :class="getStatusClass(step.status)">
                          {{ getStatusText(step.status) }}
                        </span>
                        <span v-if="step.completedAt || step.startedAt" class="timeline-time">
                          {{ formatTime(step.completedAt || step.startedAt) }}
                        </span>
                      </div>
                    </div>
                    <div v-if="step.details" class="timeline-details">
                      <p>{{ step.details }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 워크플로우 다이어그램 -->
      <div class="workflow-diagram-container">
        <WorkflowDiagram 
          :isDemo="false" 
          :deploymentId="requirementId" 
          :autoAnimate="false"
        />
      </div>

      <!-- 배포 로그 섹션 -->
      <div class="deployment-logs-section">
        <div class="section-header">
          <h2>배포 로그</h2>
          <div class="log-actions">
            <button class="btn-icon" @click="refreshLogs" title="새로고침">
              <i class="fas fa-sync-alt"></i>
            </button>
            <button class="btn-icon" @click="copyLogs" title="로그 복사">
              <i class="fas fa-copy"></i>
            </button>
            <button 
              class="btn-icon"
              :class="{ 'active': autoScroll }"
              @click="toggleAutoScroll" 
              title="자동 스크롤"
            >
              <i class="fas" :class="autoScroll ? 'fa-eye' : 'fa-eye-slash'"></i>
            </button>
          </div>
        </div>
        <div class="logs-container" ref="logsContainer">
          <div v-if="deploymentLogs.length === 0" class="logs-empty">
            <p>로그 정보가 없습니다.</p>
          </div>
          <div 
            v-for="(log, index) in deploymentLogs" 
            :key="index" 
            class="log-line"
            :class="getLogClass(log)"
          >
            {{ log }}
          </div>
        </div>
      </div>
    </template>

    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-circle error-icon"></i>
      <h2>요구사항을 불러올 수 없습니다</h2>
      <p>{{ error }}</p>
      <router-link to="/deployments" class="btn-primary">
        배포 목록으로 돌아가기
      </router-link>
    </div>

    <!-- 배포 취소 확인 모달 -->
    <div v-if="showCancelModal" class="modal-overlay" @click="showCancelModal = false">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>배포 취소 확인</h3>
          <button class="modal-close-btn" @click="showCancelModal = false">×</button>
        </div>
        <div class="modal-content">
          <p>정말로 이 배포를 취소하시겠습니까?</p>
          <p class="warning-text">이 작업은 되돌릴 수 없습니다.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showCancelModal = false">취소</button>
          <button class="btn-danger" @click="cancelDeployment">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRequirementStore } from '@/store/modules/requirement.store';
import { useDeploymentStore } from '@/store/modules/deployment.store';
import WorkflowDiagram from '@/components/common/WorkflowDiagram.vue';

const route = useRoute();
const router = useRouter();
const requirementStore = useRequirementStore();
const deploymentStore = useDeploymentStore();

// 상태 변수
const isLoading = ref(true);
const error = ref(null);
const requirement = ref(null);
const deploymentProgress = ref(0);
const deploymentStatus = ref('pending');
const deploymentSteps = ref([]);
const deploymentLogs = ref([]);
const requirementId = ref(null);
const showCancelModal = ref(false);
const autoScroll = ref(true);
const logsContainer = ref(null);

// 계산된 속성
const isDeploymentActive = computed(() => {
  return deploymentStatus.value === 'in-progress';
});

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  requirementId.value = route.params.id;
  
  if (!requirementId.value) {
    error.value = '요구사항 ID가 제공되지 않았습니다.';
    isLoading.value = false;
    return;
  }
  
  try {
    // 요구사항 정보 로드
    await requirementStore.fetchRequirementById(requirementId.value);
    requirement.value = requirementStore.currentRequirement;
    
    if (!requirement.value) {
      throw new Error('요구사항 정보를 찾을 수 없습니다.');
    }
    
    // 배포 정보 로드 또는 생성 (데모를 위한 가상 데이터)
    await loadOrCreateDeployment();
    
    // 주기적인 진행 상태 업데이트 시작 (데모용)
    startDeploymentSimulation();
  } catch (err) {
    console.error('데이터 로딩 중 오류 발생:', err);
    error.value = err.message || '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    isLoading.value = false;
  }
});

// 컴포넌트 언마운트 시 타이머 정리
onUnmounted(() => {
  stopDeploymentSimulation();
});

// 배포 정보 로드 또는 생성
async function loadOrCreateDeployment() {
  // 데모용: 랜덤 진행 상태로 배포 정보 생성
  const randomStatus = getRandomDeploymentStatus();
  deploymentStatus.value = randomStatus;
  
  // 랜덤 진행률 생성
  deploymentProgress.value = getProgressForStatus(randomStatus);
  
  // 배포 단계 생성
  deploymentSteps.value = [
    { 
      name: '코드 체크아웃', 
      status: 'completed',
      startedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
      details: 'GitLab 저장소에서 소스코드 체크아웃 완료'
    },
    { 
      name: '의존성 설치', 
      status: 'completed',
      startedAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
      details: '프로젝트 의존성 모듈 설치 완료'
    },
    { 
      name: '테스트 실행', 
      status: deploymentProgress.value >= 45 ? 'completed' : 'pending',
      startedAt: deploymentProgress.value >= 30 ? new Date(Date.now() - 1000 * 60 * 7).toISOString() : null,
      completedAt: deploymentProgress.value >= 45 ? new Date(Date.now() - 1000 * 60 * 5).toISOString() : null,
      details: deploymentProgress.value >= 45 ? '단위 테스트 및 통합 테스트 실행 완료 (성공률: 96%)' : null
    },
    { 
      name: '이미지 빌드', 
      status: deploymentProgress.value >= 60 ? 'completed' : deploymentProgress.value >= 45 ? 'in-progress' : 'pending',
      startedAt: deploymentProgress.value >= 45 ? new Date(Date.now() - 1000 * 60 * 5).toISOString() : null,
      completedAt: deploymentProgress.value >= 60 ? new Date(Date.now() - 1000 * 60 * 3).toISOString() : null,
      details: deploymentProgress.value >= 60 ? '도커 이미지 빌드 및 레지스트리 푸시 완료' : null
    },
    { 
      name: 'GitOps 업데이트', 
      status: deploymentProgress.value >= 80 ? 'completed' : deploymentProgress.value >= 60 ? 'in-progress' : 'pending',
      startedAt: deploymentProgress.value >= 60 ? new Date(Date.now() - 1000 * 60 * 3).toISOString() : null,
      completedAt: deploymentProgress.value >= 80 ? new Date(Date.now() - 1000 * 60 * 1).toISOString() : null,
      details: deploymentProgress.value >= 80 ? 'GitOps 레포지토리에 새 이미지 태그 적용 완료' : null
    },
    { 
      name: 'ArgoCD 배포', 
      status: deploymentProgress.value >= 100 ? 'completed' : deploymentProgress.value >= 80 ? 'in-progress' : 'pending',
      startedAt: deploymentProgress.value >= 80 ? new Date(Date.now() - 1000 * 60 * 1).toISOString() : null,
      completedAt: deploymentProgress.value >= 100 ? new Date().toISOString() : null,
      details: deploymentProgress.value >= 100 ? 'ArgoCD를 통해 쿠버네티스 클러스터에 애플리케이션 배포 완료' : null
    }
  ];
  
  // 오류가 발생한 경우, 관련 단계 실패 표시
  if (randomStatus === 'failed') {
    const failedStepIndex = Math.floor(Math.random() * 4) + 2; // 2~5 단계 중 하나가 실패
    deploymentSteps.value[failedStepIndex].status = 'failed';
    deploymentSteps.value[failedStepIndex].details = '오류: ' + getRandomError(deploymentSteps.value[failedStepIndex].name);
    
    // 이후 단계는 모두 pending 상태로 유지
    for (let i = failedStepIndex + 1; i < deploymentSteps.value.length; i++) {
      deploymentSteps.value[i].status = 'pending';
      deploymentSteps.value[i].startedAt = null;
      deploymentSteps.value[i].completedAt = null;
    }
  }
  
  // 로그 생성
  generateInitialLogs();
}

// 랜덤 배포 상태 생성 (데모용)
function getRandomDeploymentStatus() {
  const statuses = ['in-progress', 'completed', 'failed'];
  const weights = [0.6, 0.3, 0.1]; // 확률 가중치
  
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    sum += weights[i];
    if (random < sum) return statuses[i];
  }
  
  return statuses[0];
}

// 상태에 따른 진행률 생성
function getProgressForStatus(status) {
  switch (status) {
    case 'pending':
      return 0;
    case 'in-progress':
      return Math.floor(Math.random() * 70) + 20; // 20-90%
    case 'completed':
      return 100;
    case 'failed':
      return Math.floor(Math.random() * 70) + 20; // 20-90%
    default:
      return 0;
  }
}

// 랜덤 오류 메시지 생성
function getRandomError(stepName) {
  const errors = {
    '테스트 실행': [
      '테스트케이스 실패: API 응답 검증 오류 발생',
      '테스트 타임아웃: 데이터베이스 연결 실패',
      '단위 테스트 실패: 예상치 못한 예외 발생'
    ],
    '이미지 빌드': [
      '도커 빌드 실패: 컴파일 오류',
      '이미지 푸시 실패: 레지스트리 인증 오류',
      '빌드 명령 실패: 종속성 충돌 발생'
    ],
    'GitOps 업데이트': [
      'GitOps 저장소 커밋 실패: 권한 거부',
      '태그 업데이트 실패: 매니페스트 유효성 검사 오류',
      '저장소 접근 오류: 네트워크 연결 문제'
    ],
    'ArgoCD 배포': [
      'ArgoCD 배포 실패: 헬름 차트 오류',
      '쿠버네티스 리소스 생성 실패: 권한 부족',
      '배포 타임아웃: 리소스 부족으로 파드 시작 실패'
    ]
  };
  
  const stepErrors = errors[stepName] || ['알 수 없는 오류가 발생했습니다.'];
  return stepErrors[Math.floor(Math.random() * stepErrors.length)];
}

// 초기 로그 생성
function generateInitialLogs() {
  const logs = [
    `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 10))} 배포 시작`,
    `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 9.5))} 환경 변수 로드 완료`,
    `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 9))} 소스 코드 체크아웃 시작`,
    `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 8.5))} GitLab에서 코드 복제 중...`,
    `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 8))} 브랜치: main, 커밋: a8fc7e2`,
    `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 7.5))} 소스 코드 체크아웃 완료`,
    `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 7))} 의존성 설치 시작`,
    `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 6.5))} npm 패키지 설치 중...`
  ];
  
  if (deploymentProgress.value >= 30) {
    logs.push(
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 6))} 의존성 설치 완료`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 5.5))} 테스트 실행 시작`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 5))} 단위 테스트 실행 중...`
    );
  }
  
  if (deploymentProgress.value >= 45) {
    logs.push(
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 4.5))} 단위 테스트 완료: 32개 테스트 통과`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 4))} 통합 테스트 실행 중...`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 3.5))} 통합 테스트 완료: 12개 테스트 통과, 1개 경고`,
      `[WARN] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 3.2))} API 응답 시간이 임계값을 초과했습니다 (2.3s > 2.0s)`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 3))} 이미지 빌드 시작`
    );
  }
  
  if (deploymentProgress.value >= 60) {
    logs.push(
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 2.5))} 도커 컨텍스트 준비 중...`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 2))} Dockerfile을 사용하여 이미지 빌드 중...`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 1.5))} 이미지 태그: my-app:1.2.${Math.floor(Math.random() * 100)}`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 1))} 이미지 빌드 완료`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 0.9))} 이미지를 레지스트리에 푸시 중...`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 0.8))} 이미지 푸시 완료`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 0.7))} GitOps 저장소 업데이트 시작`
    );
  }
  
  if (deploymentProgress.value >= 80) {
    logs.push(
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 0.6))} GitOps 저장소 복제 중...`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 0.5))} 매니페스트 파일 업데이트 중...`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 0.4))} 이미지 태그 업데이트: my-app:1.2.${Math.floor(Math.random() * 100)}`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 0.3))} GitOps 저장소에 변경사항 커밋 및 푸시 완료`,
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 0.2))} ArgoCD 배포 시작`
    );
  }
  
  if (deploymentProgress.value >= 100) {
    logs.push(
      `[INFO] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 0.1))} ArgoCD 동기화 진행 중...`,
      `[INFO] ${formatLogTime(new Date())} 쿠버네티스 클러스터에 새 버전 배포 완료`,
      `[SUCCESS] ${formatLogTime(new Date())} 배포가 성공적으로 완료되었습니다.`
    );
  }
  
  // 실패한 경우 오류 로그 추가
  if (deploymentStatus.value === 'failed') {
    const failedStep = deploymentSteps.value.find(step => step.status === 'failed');
    if (failedStep) {
      logs.push(
        `[ERROR] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 0.5))} ${failedStep.details}`,
        `[ERROR] ${formatLogTime(new Date(Date.now() - 1000 * 60 * 0.4))} 배포 프로세스 중단: ${failedStep.name} 단계에서 실패`
      );
    }
  }
  
  deploymentLogs.value = logs;
}

// 로그 시간 형식화
function formatLogTime(date) {
  return date.toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
}

// 배포 진행 시뮬레이션 (데모용)
let simulationInterval = null;

function startDeploymentSimulation() {
  // 이미 완료된 경우 시뮬레이션 필요 없음
  if (deploymentStatus.value === 'completed' || deploymentStatus.value === 'failed') {
    return;
  }
  
  // 3초마다 진행률 업데이트
  simulationInterval = setInterval(() => {
    if (deploymentProgress.value < 100) {
      const increment = Math.floor(Math.random() * 10) + 5; // 5-15% 증가
      const newProgress = Math.min(95, deploymentProgress.value + increment);
      
      // 진행률 업데이트
      deploymentProgress.value = newProgress;
      
      // 단계 상태 업데이트
      updateStepsBasedOnProgress(newProgress);
      
      // 새 로그 추가
      addRandomLog(newProgress);
      
      // 95% 이상이면 랜덤하게 완료 처리
      if (newProgress >= 95 && Math.random() > 0.5) {
        completeDeployment();
      }
    }
  }, 3000);
}

// 진행률에 따른 단계 상태 업데이트
function updateStepsBasedOnProgress(progress) {
  if (progress >= 30 && deploymentSteps.value[2].status === 'pending') {
    deploymentSteps.value[2].status = 'in-progress';
    deploymentSteps.value[2].startedAt = new Date().toISOString();
  }
  
  if (progress >= 45 && deploymentSteps.value[2].status === 'in-progress') {
    deploymentSteps.value[2].status = 'completed';
    deploymentSteps.value[2].completedAt = new Date().toISOString();
    deploymentSteps.value[3].status = 'in-progress';
    deploymentSteps.value[3].startedAt = new Date().toISOString();
  }
  
  if (progress >= 60 && deploymentSteps.value[3].status === 'in-progress') {
    deploymentSteps.value[3].status = 'completed';
    deploymentSteps.value[3].completedAt = new Date().toISOString();
    deploymentSteps.value[4].status = 'in-progress';
    deploymentSteps.value[4].startedAt = new Date().toISOString();
  }
  
  if (progress >= 80 && deploymentSteps.value[4].status === 'in-progress') {
    deploymentSteps.value[4].status = 'completed';
    deploymentSteps.value[4].completedAt = new Date().toISOString();
    deploymentSteps.value[5].status = 'in-progress';
    deploymentSteps.value[5].startedAt = new Date().toISOString();
  }
}

// 랜덤 로그 추가
function addRandomLog(progress) {
  const logs = [
    "도커 이미지 빌드 중...",
    "의존성 설치 완료",
    "단위 테스트 진행 중...",
    "테스트 성공: 94%",
    "일부 테스트에서 경고 발생",
    `이미지 태그 설정: my-app:1.2.${Math.floor(Math.random() * 100)}`,
    "도커 레이어 최적화 중...",
    "GitOps 저장소에 변경사항 적용 중...",
    "ArgoCD 동기화 시작",
    "쿠버네티스 리소스 생성 중...",
    "새 버전 배포 중..."
  ];
  
  const logLevel = Math.random() > 0.9 ? "WARN" : "INFO";
  const randomLog = logs[Math.floor(Math.random() * logs.length)];
  const logEntry = `[${logLevel}] ${formatLogTime(new Date())} ${randomLog}`;
  
  deploymentLogs.value.push(logEntry);
  
  // 로그 스크롤 처리
  scrollToBottom();
}

// 배포 완료 처리
function completeDeployment() {
  clearInterval(simulationInterval);
  simulationInterval = null;
  
  deploymentProgress.value = 100;
  deploymentStatus.value = 'completed';
  
  // 마지막 단계 완료 처리
  deploymentSteps.value[5].status = 'completed';
  deploymentSteps.value[5].completedAt = new Date().toISOString();
  
  // 완료 로그 추가
  deploymentLogs.value.push(`[INFO] ${formatLogTime(new Date())} 쿠버네티스 클러스터에 새 버전 배포 완료`);
  deploymentLogs.value.push(`[SUCCESS] ${formatLogTime(new Date())} 배포가 성공적으로 완료되었습니다.`);
  
  scrollToBottom();
}

// 시뮬레이션 중지
function stopDeploymentSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}

// 로그 스크롤 처리
function scrollToBottom() {
  if (autoScroll.value && logsContainer.value) {
    nextTick(() => {
      logsContainer.value.scrollTop = logsContainer.value.scrollHeight;
    });
  }
}

// 자동 스크롤 토글
function toggleAutoScroll() {
  autoScroll.value = !autoScroll.value;
}

// 로그 새로고침
function refreshLogs() {
  // 실제로는 API 호출로 최신 로그를 가져오겠지만, 
  // 데모에서는 랜덤 로그 추가로 대체
  addRandomLog(deploymentProgress.value);
}

// 로그 복사
function copyLogs() {
  const logText = deploymentLogs.value.join('\n');
  navigator.clipboard.writeText(logText)
    .then(() => {
      alert('로그가 클립보드에 복사되었습니다.');
    })
    .catch((err) => {
      console.error('로그 복사 실패:', err);
      alert('로그 복사에 실패했습니다.');
    });
}

// 배포 취소 모달 표시
function confirmCancelDeployment() {
  showCancelModal.value = true;
}

// 배포 취소 실행
function cancelDeployment() {
  stopDeploymentSimulation();
  
  deploymentStatus.value = 'failed';
  
  // 현재 진행 중인 단계 실패 처리
  const currentStep = deploymentSteps.value.find(step => step.status === 'in-progress');
  if (currentStep) {
    currentStep.status = 'failed';
    currentStep.details = '사용자에 의해 배포가 취소되었습니다.';
    
    // 이후 단계는 모두 pending 상태로 유지
    const currentIndex = deploymentSteps.value.indexOf(currentStep);
    for (let i = currentIndex + 1; i < deploymentSteps.value.length; i++) {
      deploymentSteps.value[i].status = 'pending';
      deploymentSteps.value[i].startedAt = null;
      deploymentSteps.value[i].completedAt = null;
    }
  }
  
  // 취소 로그 추가
  deploymentLogs.value.push(`[WARN] ${formatLogTime(new Date())} 사용자에 의해 배포가 취소되었습니다.`);
  deploymentLogs.value.push(`[ERROR] ${formatLogTime(new Date())} 배포 프로세스가 중단되었습니다.`);
  
  scrollToBottom();
  showCancelModal.value = false;
}

// 우선순위 클래스
function getPriorityClass(priority) {
  switch (priority) {
    case 'high':
      return 'priority-high';
    case 'medium':
      return 'priority-medium';
    case 'low':
      return 'priority-low';
    default:
      return '';
  }
}

// 우선순위 텍스트
function getPriorityText(priority) {
  switch (priority) {
    case 'high':
      return '높음';
    case 'medium':
      return '중간';
    case 'low':
      return '낮음';
    default:
      return priority;
  }
}

// 상태 클래스
function getStatusClass(status) {
  switch (status) {
    case 'completed':
      return 'status-completed';
    case 'in-progress':
      return 'status-in-progress';
    case 'pending':
      return 'status-pending';
    case 'failed':
      return 'status-failed';
    default:
      return '';
  }
}

// 상태 텍스트
function getStatusText(status) {
  switch (status) {
    case 'completed':
      return '완료됨';
    case 'in-progress':
      return '진행 중';
    case 'pending':
      return '대기 중';
    case 'failed':
      return '실패';
    default:
      return status;
  }
}

// 진행 바 클래스
function getProgressClass(status) {
  switch (status) {
    case 'completed':
      return 'progress-completed';
    case 'in-progress':
      return 'progress-in-progress';
    case 'failed':
      return 'progress-failed';
    default:
      return '';
  }
}

// 로그 라인 클래스
function getLogClass(log) {
  if (!log) return '';
  
  if (log.includes('[ERROR]')) {
    return 'log-error';
  }
  
  if (log.includes('[WARN]')) {
    return 'log-warning';
  }
  
  if (log.includes('[INFO]')) {
    return 'log-info';
  }
  
  if (log.includes('[SUCCESS]')) {
    return 'log-success';
  }
  
  return '';
}

// 날짜 형식화
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// 시간 형식화
function formatTime(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
}

// 로그 감시
watch(deploymentLogs, () => {
  scrollToBottom();
}, { deep: true });

</script>
<style scoped>
.deployment-detail-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-breadcrumb {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.breadcrumb-link {
  color: var(--primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: var(--gray-400);
}

.breadcrumb-current {
  color: var(--gray-600);
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary, .btn-secondary, .btn-danger {
  padding: 0.6rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-secondary {
  background-color: var(--white);
  border: 1px solid var(--gray-300);
  color: var(--gray-700);
}

.btn-secondary:hover {
  background-color: var(--gray-100);
  border-color: var(--gray-400);
}

.btn-danger {
  background-color: var(--danger);
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: #d32f2f;
}

/* 로딩 상태 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(67, 97, 238, 0.3);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container p {
  color: var(--gray-600);
}

/* 에러 상태 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  color: var(--danger);
  margin-bottom: 1rem;
}

.error-state h2 {
  margin-bottom: 1rem;
  color: var(--gray-800);
}

.error-state p {
  color: var(--gray-600);
  max-width: 500px;
  margin: 0 auto 2rem;
}

/* 정보 카드 */
.info-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.requirement-card, .deployment-status-card {
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid var(--gray-200);
}

.card-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
}

.card-content {
  padding: 1.25rem;
}

/* 요구사항 정보 */
.requirement-title {
  margin: 0 0 1.25rem 0;
  font-size: 1.5rem;
  color: var(--gray-900);
}

.requirement-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: 0.25rem;
}

.meta-value {
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray-800);
}

.requirement-description h3 {
  font-size: 1.1rem;
  margin: 0 0 0.75rem 0;
  color: var(--gray-800);
}

.requirement-description p {
  color: var(--gray-700);
  line-height: 1.6;
}

/* 우선순위 배지 */
.priority-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.priority-high {
  background-color: rgba(230, 57, 70, 0.1);
  color: var(--danger);
}

.priority-medium {
  background-color: rgba(255, 159, 28, 0.1);
  color: var(--warning);
}

.priority-low {
  background-color: rgba(6, 214, 160, 0.1);
  color: var(--success);
}

/* 상태 배지 */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.small {
  padding: 0.15rem 0.5rem;
  font-size: 0.75rem;
}

.status-completed {
  background-color: rgba(6, 214, 160, 0.1);
  color: var(--success);
}

.status-in-progress {
  background-color: rgba(76, 201, 240, 0.1);
  color: var(--info);
}

.status-pending {
  background-color: rgba(108, 117, 125, 0.1);
  color: var(--gray-600);
}

.status-failed {
  background-color: rgba(230, 57, 70, 0.1);
  color: var(--danger);
}

/* 진행 상태 */
.deployment-progress {
  margin-bottom: 1.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gray-800);
}

.progress-percentage {
  font-weight: 600;
  color: var(--primary);
}

.progress-bar-container {
  height: 8px;
  background-color: var(--gray-200);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-in-progress {
  background-color: var(--info);
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

.progress-completed {
  background-color: var(--success);
}

.progress-failed {
  background-color: var(--danger);
}

/* 타임라인 */
.deployment-timeline {
  margin-top: 1.5rem;
}

.timeline-header {
  margin-bottom: 1rem;
}

.timeline-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gray-800);
}

.timeline {
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 16px;
  width: 2px;
  background-color: var(--gray-300);
}

.timeline-item {
  position: relative;
  padding-left: 40px;
  margin-bottom: 1.5rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  top: 0;
  left: 0;
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.marker-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--gray-400);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.timeline-item.completed .marker-icon {
  background-color: var(--success);
}

.timeline-item.active .marker-icon {
  background-color: var(--info);
}

.timeline-item.failed .marker-icon {
  background-color: var(--danger);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timeline-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-800);
}

.timeline-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timeline-time {
  font-size: 0.75rem;
  color: var(--gray-600);
}

.timeline-details {
  background-color: var(--gray-100);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  margin-top: 0.5rem;
}

.timeline-details p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--gray-700);
}

/* 워크플로우 다이어그램 */
.workflow-diagram-container {
  margin-bottom: 1.5rem;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

/* 로그 섹션 */
.deployment-logs-section {
  background-color: var(--gray-900);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background-color: var(--gray-800);
  border-bottom: 1px solid var(--gray-700);
}

.section-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--white);
}

.log-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: var(--gray-700);
  color: var(--gray-300);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background-color: var(--gray-600);
  color: var(--white);
}

.btn-icon.active {
  background-color: var(--primary);
  color: var(--white);
}

.logs-container {
  height: 300px;
  overflow-y: auto;
  padding: 1rem;
  font-family: var(--font-family-mono);
  font-size: 0.85rem;
  color: var(--gray-300);
  background-color: var(--gray-900);
}

.logs-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--gray-500);
}

.log-line {
  padding: 2px 0;
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
  padding: 1.25rem;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: transparent;
  font-size: 1.5rem;
  color: var(--gray-600);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal-close-btn:hover {
  background-color: var(--gray-200);
}

.modal-content {
  padding: 1.5rem;
}

.modal-content p {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.warning-text {
  color: var(--danger);
  font-weight: 500;
}

.modal-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--gray-200);
  background-color: var(--gray-50);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@keyframes progress-animation {
  0% { background-position: 1rem 0; }
  100% { background-position: 0 0; }
}

/* 반응형 스타일 */
@media (max-width: 992px) {
  .info-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .requirement-meta {
    grid-template-columns: 1fr;
  }
  
  .timeline-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>