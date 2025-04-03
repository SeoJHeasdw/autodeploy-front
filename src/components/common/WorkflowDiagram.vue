<template>
  <div class="workflow-container">
    <h2 class="workflow-title">자동화 CI/CD 파이프라인 워크플로우</h2>
    <p class="workflow-subtitle">요구사항부터 배포까지 자동화된 프로세스</p>
    
    <div class="workflow-diagram">
      <div class="diagram-step" :class="{ 'step-completed': stepStatus.requirement === 'completed', 'step-in-progress': stepStatus.requirement === 'in-progress', 'step-failed': stepStatus.requirement === 'failed' }">
        <div class="step-number">1</div>
        <div class="step-box requirement-step">
          <div class="step-icon">
            <i class="fas fa-clipboard-list"></i>
          </div>
          <h3>요구사항 입력</h3>
          <p>ITO/SM</p>
        </div>
        <div class="step-status">
          <span class="status-dot" :class="getStatusClass(stepStatus.requirement)"></span>
          <span class="status-text">{{ getStatusText(stepStatus.requirement) }}</span>
        </div>
      </div>
      
      <div class="diagram-arrow">
        <i class="fas fa-long-arrow-alt-right"></i>
      </div>
      
      <div class="diagram-step" :class="{ 'step-completed': stepStatus.sourceCode === 'completed', 'step-in-progress': stepStatus.sourceCode === 'in-progress', 'step-failed': stepStatus.sourceCode === 'failed' }">
        <div class="step-number">2</div>
        <div class="step-box source-step">
          <div class="step-icon">
            <i class="fas fa-code"></i>
          </div>
          <h3>소스 생성</h3>
          <div class="step-details">
            <p>클라우드 AI 코드 개선</p>
            <p>DB 테이블 추가 & 수정</p>
          </div>
        </div>
        <div class="step-status">
          <span class="status-dot" :class="getStatusClass(stepStatus.sourceCode)"></span>
          <span class="status-text">{{ getStatusText(stepStatus.sourceCode) }}</span>
        </div>
      </div>
      
      <div class="diagram-arrow">
        <i class="fas fa-long-arrow-alt-right"></i>
      </div>
      
      <div class="diagram-step" :class="{ 'step-completed': stepStatus.cicd === 'completed', 'step-in-progress': stepStatus.cicd === 'in-progress', 'step-failed': stepStatus.cicd === 'failed' }">
        <div class="step-number">3</div>
        <div class="step-box cicd-step">
          <div class="step-icon">
            <i class="fas fa-cogs"></i>
          </div>
          <h3>GitLab 커밋</h3>
          <div class="step-details">
            <p>Jenkins 빌드</p>
            <p>컨테이너 이미지 생성</p>
          </div>
        </div>
        <div class="step-status">
          <span class="status-dot" :class="getStatusClass(stepStatus.cicd)"></span>
          <span class="status-text">{{ getStatusText(stepStatus.cicd) }}</span>
        </div>
      </div>
      
      <div class="diagram-arrow">
        <i class="fas fa-long-arrow-alt-right"></i>
      </div>
      
      <div class="diagram-step" :class="{ 'step-completed': stepStatus.gitops === 'completed', 'step-in-progress': stepStatus.gitops === 'in-progress', 'step-failed': stepStatus.gitops === 'failed' }">
        <div class="step-number">4</div>
        <div class="step-box gitops-step">
          <div class="step-icon">
            <i class="fas fa-code-branch"></i>
          </div>
          <h3>GitOps 업데이트</h3>
          <div class="step-details">
            <p>이미지 태그 갱신</p>
            <p>매니페스트 커밋</p>
          </div>
        </div>
        <div class="step-status">
          <span class="status-dot" :class="getStatusClass(stepStatus.gitops)"></span>
          <span class="status-text">{{ getStatusText(stepStatus.gitops) }}</span>
        </div>
      </div>
      
      <div class="diagram-arrow">
        <i class="fas fa-long-arrow-alt-right"></i>
      </div>
      
      <div class="diagram-step" :class="{ 'step-completed': stepStatus.deployment === 'completed', 'step-in-progress': stepStatus.deployment === 'in-progress', 'step-failed': stepStatus.deployment === 'failed' }">
        <div class="step-number">5</div>
        <div class="step-box deployment-step">
          <div class="step-icon">
            <i class="fas fa-rocket"></i>
          </div>
          <h3>ArgoCD 배포</h3>
          <div class="step-details">
            <p>MSA 서비스 배포</p>
            <p>상태 모니터링</p>
          </div>
        </div>
        <div class="step-status">
          <span class="status-dot" :class="getStatusClass(stepStatus.deployment)"></span>
          <span class="status-text">{{ getStatusText(stepStatus.deployment) }}</span>
        </div>
      </div>
    </div>
    
    <div class="workflow-info">
      <p v-if="isDemo">자동화 CI/CD 파이프라인은 요구사항 입력부터 배포까지 전 과정을 자동화합니다.</p>
      <p v-if="isDemo">각 단계는 MSA 아키텍처에 최적화되어 있으며, 배포 과정을 실시간으로 모니터링할 수 있습니다.</p>
      <template v-else>
        <p>각 단계는 자동으로 진행되며, 전체 파이프라인의 상태는 실시간으로 모니터링됩니다.</p>
        <p>오류 발생 시 관리자에게 알림이 전송되고 로그를 통해 문제를 진단할 수 있습니다.</p>
      </template>
    </div>
    
    <!-- 실제 배포 모드에서만 표시되는 액션 버튼 -->
    <div v-if="!isDemo && currentDeploymentId" class="workflow-actions">
      <button class="btn btn-primary" @click="navigateToDeployment">
        <i class="fas fa-eye"></i> 현재 배포 상세 보기
      </button>
      <button v-if="isActiveDeployment" class="btn btn-danger" @click="confirmCancel">
        <i class="fas fa-stop-circle"></i> 배포 취소
      </button>
    </div>
    
    <!-- 취소 확인 모달 -->
    <!-- 실제 배포 모드에서만 표시되는 모달 -->
    <div v-if="!isDemo && showCancelModal" class="cancel-modal-overlay" @click="showCancelModal = false">
      <div class="cancel-modal" @click.stop>
        <div class="cancel-modal-header">
          <h3>배포 취소 확인</h3>
          <button class="close-btn" @click="showCancelModal = false">×</button>
        </div>
        <div class="cancel-modal-body">
          <p>정말로 현재 진행 중인 배포를 취소하시겠습니까?</p>
          <p class="warning-text">이 작업은 되돌릴 수 없습니다.</p>
        </div>
        <div class="cancel-modal-footer">
          <button class="btn btn-outline" @click="showCancelModal = false">아니오</button>
          <button class="btn btn-danger" @click="cancelDeployment">예, 취소합니다</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDeploymentStore } from '@/store/modules/deployment.store';

const deploymentStore = useDeploymentStore();
const router = useRouter();

// 각 단계의 상태를 관리하는 반응형 객체
const stepStatus = ref({
  requirement: 'completed',   // completed, in-progress, pending, failed
  sourceCode: 'in-progress',
  cicd: 'pending',
  gitops: 'pending',           // 새로 추가된 GitOps 단계
  deployment: 'pending'
});

// 현재 배포 ID 및 모달 상태
const currentDeploymentId = ref(null);
const showCancelModal = ref(false);

// 현재 배포가 활성 상태인지 확인
const isActiveDeployment = computed(() => {
  const deployment = deploymentStore.deployments[currentDeploymentId.value];
  return deployment && deployment.status === 'in-progress';
});

// 상태에 따른 클래스 반환 함수
const getStatusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'status-completed';
    case 'in-progress':
      return 'status-in-progress';
    case 'failed':
      return 'status-failed';
    default:
      return 'status-pending';
  }
};

// 상태 텍스트 반환 함수
const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return '완료';
    case 'in-progress':
      return '진행 중';
    case 'failed':
      return '실패';
    default:
      return '대기 중';
  }
};

// props 정의
const props = defineProps({
  // 데모 모드 여부 (설명용 시각화만 제공하는 모드)
  isDemo: {
    type: Boolean,
    default: true
  },
  // 활성 배포 ID (실제 배포 화면에서 사용)
  deploymentId: {
    type: String,
    default: null
  },
  // 자동 애니메이션 실행 여부
  autoAnimate: {
    type: Boolean,
    default: false
  }
});

// 컴포넌트 마운트 시
onMounted(async () => {
  if (props.isDemo) {
    // 데모 모드일 경우: 설명용 시각적 애니메이션만 제공
    if (!props.autoAnimate) {
      // 홈페이지에서는 정적 데모 상태만 보여줌
      stepStatus.value = {
        requirement: 'completed',
        sourceCode: 'completed',
        cicd: 'completed',
        gitops: 'completed',
        deployment: 'completed'
      };
    } else {
      // 자동 애니메이션이 설정된 경우만 애니메이션 실행
      startStatusSimulation();
    }
  } else {
    // 실제 모드: 현재 활성화된 배포 상태 보여주기
    try {
      // 배포 ID가 주어진 경우
      if (props.deploymentId) {
        await deploymentStore.getDeploymentById(props.deploymentId);
        currentDeploymentId.value = props.deploymentId;
      } else {
        // 최신 배포 정보 가져오기
        await deploymentStore.fetchLatestDeployment();
        currentDeploymentId.value = deploymentStore.currentDeploymentId;
      }
      
      // 배포 ID가 있으면 워크플로우 상태 가져오기
      if (currentDeploymentId.value) {
        const workflowStatus = await deploymentStore.getWorkflowStatus(currentDeploymentId.value);
        if (workflowStatus) {
          stepStatus.value = {
            ...stepStatus.value,
            ...workflowStatus,
            // GitOps 단계 추가: CICD와 Deployment 사이 단계로 추정
            gitops: workflowStatus.deployment === 'completed' || workflowStatus.deployment === 'in-progress' 
              ? 'completed' 
              : workflowStatus.cicd === 'completed' 
                ? 'in-progress' 
                : 'pending'
          };
        }
      }
    } catch (error) {
      console.error('워크플로우 상태를 가져오는 중 오류 발생:', error);
    }
  }
});

// 워크플로우 상태 시뮬레이션 (데모용)
const startStatusSimulation = () => {
  // 자동으로 워크플로우 진행되는 데모 효과
  setTimeout(() => {
    stepStatus.value.sourceCode = 'completed';
    stepStatus.value.cicd = 'in-progress';
  }, 5000);
  
  setTimeout(() => {
    stepStatus.value.cicd = 'completed';
    stepStatus.value.gitops = 'in-progress';
  }, 10000);
  
  setTimeout(() => {
    stepStatus.value.gitops = 'completed';
    stepStatus.value.deployment = 'in-progress';
  }, 15000);
  
  setTimeout(() => {
    stepStatus.value.deployment = 'completed';
  }, 20000);
};

// 현재 배포 상세 보기 이동
const navigateToDeployment = () => {
  if (currentDeploymentId.value) {
    router.push(`/deployments/${currentDeploymentId.value}`);
  }
};

// 취소 모달 표시
const confirmCancel = () => {
  showCancelModal.value = true;
};

// 배포 취소
const cancelDeployment = async () => {
  if (!currentDeploymentId.value) return;
  
  try {
    await deploymentStore.cancelDeployment(currentDeploymentId.value);
    showCancelModal.value = false;
    
    // 워크플로우 상태 업데이트
    stepStatus.value = {
      ...stepStatus.value,
      // 현재 진행 중인 단계를 실패로 표시
      sourceCode: stepStatus.value.sourceCode === 'in-progress' ? 'failed' : stepStatus.value.sourceCode,
      cicd: stepStatus.value.cicd === 'in-progress' ? 'failed' : stepStatus.value.cicd,
      gitops: stepStatus.value.gitops === 'in-progress' ? 'failed' : stepStatus.value.gitops,
      deployment: stepStatus.value.deployment === 'in-progress' ? 'failed' : stepStatus.value.deployment
    };
  } catch (error) {
    console.error('배포 취소 중 오류 발생:', error);
  }
};

// deploymentStore의 변화 감지하여 상태 업데이트
watch(() => deploymentStore.currentDeployment, async (newDeployment) => {
  if (newDeployment && newDeployment.id) {
    currentDeploymentId.value = newDeployment.id;
    
    // 워크플로우 상태 업데이트
    const workflowStatus = await deploymentStore.getWorkflowStatus(newDeployment.id);
    if (workflowStatus) {
      stepStatus.value = {
        ...stepStatus.value,
        ...workflowStatus,
        // GitOps 단계 추가
        gitops: workflowStatus.deployment === 'completed' || workflowStatus.deployment === 'in-progress' 
          ? 'completed' 
          : workflowStatus.cicd === 'completed' 
            ? 'in-progress' 
            : 'pending'
      };
    }
  }
}, { deep: true });
</script>

<style scoped>
.workflow-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.workflow-title {
  text-align: center;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: var(--gray-900);
  position: relative;
}

.workflow-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: var(--radius-full);
}

.workflow-subtitle {
  text-align: center;
  font-size: 1.1rem;
  color: var(--gray-600);
  margin-bottom: 3rem;
  margin-top: 1.5rem;
}

.workflow-diagram {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  position: relative;
}

.diagram-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  min-width: 180px;
  transition: all 0.3s ease;
  z-index: 2;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 0.75rem;
  color: white;
  z-index: 2;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 단계별 색상 지정 */
.diagram-step:nth-child(1) .step-number {
  background-color: var(--primary);
}

.diagram-step:nth-child(3) .step-number {
  background-color: var(--secondary);
}

.diagram-step:nth-child(5) .step-number {
  background-color: var(--info);
}

.diagram-step:nth-child(7) .step-number {
  background-color: var(--warning);
}

.diagram-step:nth-child(9) .step-number {
  background-color: var(--success);
}

.step-box {
  width: 180px;
  height: 170px;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  text-align: center;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.step-box::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.step-completed .step-box::after {
  background: rgba(255, 255, 255, 0.8);
}

.requirement-step {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
}

.source-step {
  background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%);
}

.cicd-step {
  background: linear-gradient(135deg, var(--info) 0%, #3a8dd9 100%);
}

.gitops-step {
  background: linear-gradient(135deg, var(--warning) 0%, #e97c06 100%);
}

.deployment-step {
  background: linear-gradient(135deg, var(--success) 0%, #04ab7f 100%);
}

.step-icon {
  font-size: 2.25rem;
  margin-bottom: 1rem;
  background-color: rgba(255, 255, 255, 0.15);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.step-completed .step-icon {
  background-color: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.step-box h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: white;
}

.step-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.step-details p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
}

.step-status {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--white);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-completed {
  background-color: var(--success);
}

.status-in-progress {
  background-color: var(--info);
  animation: pulse 1.5s infinite;
}

.status-failed {
  background-color: var(--danger);
}

.status-pending {
  background-color: var(--gray-400);
}

.status-text {
  font-size: 0.875rem;
  color: var(--gray-700);
  font-weight: 500;
}

.diagram-arrow {
  font-size: 1.5rem;
  color: var(--gray-400);
  margin: 0 -0.5rem;
  align-self: center;
  z-index: 1;
  transition: all 0.3s ease;
}

.step-completed ~ .diagram-arrow {
  color: var(--success);
}

.step-completed .step-box {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px -3px rgba(0, 0, 0, 0.15);
}

.step-in-progress .step-box {
  animation: pulse-box 2s infinite;
}

.step-failed .step-box {
  box-shadow: 0 10px 20px -3px rgba(230, 57, 70, 0.2);
  opacity: 0.9;
}

.workflow-info {
  text-align: center;
  color: var(--gray-600);
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-200);
  font-size: 0.95rem;
  line-height: 1.6;
}

.workflow-info p {
  margin: 0.5rem 0;
}

.workflow-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-200);
}

.btn {
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--primary);
  color: var(--white);
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-danger {
  background-color: var(--danger);
  color: var(--white);
}

.btn-danger:hover {
  background-color: #d32f2f;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--gray-400);
  color: var(--gray-700);
}

.btn-outline:hover {
  background-color: var(--gray-100);
  border-color: var(--gray-500);
}

/* 취소 모달 */
.cancel-modal-overlay {
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

.cancel-modal {
  width: 100%;
  max-width: 500px;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.cancel-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid var(--gray-200);
}

.cancel-modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--gray-900);
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: var(--gray-600);
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: var(--gray-200);
}

.cancel-modal-body {
  padding: 1.5rem;
}

.cancel-modal-body p {
  margin: 0 0 1rem;
  font-size: 1rem;
  color: var(--gray-800);
}

.warning-text {
  color: var(--danger);
  font-weight: 500;
}

.cancel-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem;
  background-color: var(--gray-100);
  border-top: 1px solid var(--gray-200);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 201, 240, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(76, 201, 240, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 201, 240, 0);
  }
}

@keyframes pulse-box {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

/* 반응형 레이아웃 */
@media (max-width: 768px) {
  .workflow-diagram {
    flex-direction: column;
    gap: 2rem;
  }
  
  .diagram-arrow {
    transform: rotate(90deg);
    margin: 0.5rem 0;
  }
  
  .step-box {
    width: 100%;
    max-width: 200px;
  }
  
  .workflow-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
  }
}
</style>