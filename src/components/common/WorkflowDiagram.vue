<!-- src/components/common/WorkflowDiagram.vue -->
<template>
    <div class="workflow-container">
      <h2 class="workflow-title">자동화 CI/CD 파이프라인 워크플로우</h2>
      <p class="workflow-subtitle">요구사항부터 배포까지 자동화된 프로세스</p>
      
      <div class="workflow-diagram">
        <div class="diagram-step" :class="{ 'step-completed': stepStatus.requirement === 'completed', 'step-in-progress': stepStatus.requirement === 'in-progress' }">
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
        
        <div class="diagram-step" :class="{ 'step-completed': stepStatus.sourceCode === 'completed', 'step-in-progress': stepStatus.sourceCode === 'in-progress' }">
          <div class="step-number">2</div>
          <div class="step-box source-step">
            <div class="step-icon">
              <i class="fas fa-code"></i>
            </div>
            <h3>소스 생성</h3>
            <p>DB 테이블 추가 & 수정</p>
          </div>
          <div class="step-status">
            <span class="status-dot" :class="getStatusClass(stepStatus.sourceCode)"></span>
            <span class="status-text">{{ getStatusText(stepStatus.sourceCode) }}</span>
          </div>
        </div>
        
        <div class="diagram-arrow">
          <i class="fas fa-long-arrow-alt-right"></i>
        </div>
        
        <div class="diagram-step" :class="{ 'step-completed': stepStatus.cicd === 'completed', 'step-in-progress': stepStatus.cicd === 'in-progress' }">
          <div class="step-number">3</div>
          <div class="step-box cicd-step">
            <div class="step-icon">
              <i class="fas fa-cogs"></i>
            </div>
            <h3>GitLab 커밋</h3>
            <p>Jenkins 빌드 & 이미지 생성</p>
          </div>
          <div class="step-status">
            <span class="status-dot" :class="getStatusClass(stepStatus.cicd)"></span>
            <span class="status-text">{{ getStatusText(stepStatus.cicd) }}</span>
          </div>
        </div>
        
        <div class="diagram-arrow">
          <i class="fas fa-long-arrow-alt-right"></i>
        </div>
        
        <div class="diagram-step" :class="{ 'step-completed': stepStatus.deployment === 'completed', 'step-in-progress': stepStatus.deployment === 'in-progress' }">
          <div class="step-number">4</div>
          <div class="step-box deployment-step">
            <div class="step-icon">
              <i class="fas fa-rocket"></i>
            </div>
            <h3>GitOps 커밋</h3>
            <p>ArgoCD 배포</p>
          </div>
          <div class="step-status">
            <span class="status-dot" :class="getStatusClass(stepStatus.deployment)"></span>
            <span class="status-text">{{ getStatusText(stepStatus.deployment) }}</span>
          </div>
        </div>
      </div>
      
      <div class="workflow-info">
        <p>각 단계는 자동으로 진행되며, 전체 파이프라인의 상태는 실시간으로 모니터링됩니다.</p>
        <p>오류 발생 시 관리자에게 알림이 전송되고 로그를 통해 문제를 진단할 수 있습니다.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  // 각 단계의 상태를 관리하는 반응형 객체
  const stepStatus = ref({
    requirement: 'completed',   // completed, in-progress, pending, failed
    sourceCode: 'in-progress',
    cicd: 'pending',
    deployment: 'pending'
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
  
  // 데모를 위한 상태 변경 함수 (실제로는 API나 WebSocket을 통해 업데이트)
  onMounted(() => {
    // 예시: 5초 후에 소스 생성 단계를 완료하고 CI/CD 단계를 시작
    setTimeout(() => {
      stepStatus.value.sourceCode = 'completed';
      stepStatus.value.cicd = 'in-progress';
    }, 5000);
    
    // 예시: 10초 후에 CI/CD 단계를 완료하고 배포 단계를 시작
    setTimeout(() => {
      stepStatus.value.cicd = 'completed';
      stepStatus.value.deployment = 'in-progress';
    }, 10000);
    
    // 예시: 15초 후에 배포 단계 완료
    setTimeout(() => {
      stepStatus.value.deployment = 'completed';
    }, 15000);
  });
  </script>
  
  <style scoped>
  .workflow-container {
    max-width: 1000px;
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
  }
  
  .workflow-subtitle {
    text-align: center;
    font-size: 1.1rem;
    color: var(--gray-600);
    margin-bottom: 3rem;
  }
  
  .workflow-diagram {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  
  .diagram-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
    min-width: 160px;
    transition: all 0.3s ease;
  }
  
  .step-number {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: white;
    z-index: 2;
  }
  
  .diagram-step:nth-child(1) .step-number {
    background-color: var(--primary);
  }
  
  .diagram-step:nth-child(3) .step-number {
    background-color: var(--secondary);
  }
  
  .diagram-step:nth-child(5) .step-number {
    background-color: var(--warning);
  }
  
  .diagram-step:nth-child(7) .step-number {
    background-color: var(--success);
  }
  
  .step-box {
    width: 150px;
    height: 150px;
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    text-align: center;
    color: white;
    transition: all 0.3s ease;
  }
  
  .requirement-step {
    background-color: var(--primary);
  }
  
  .source-step {
    background-color: var(--secondary);
  }
  
  .cicd-step {
    background-color: var(--warning);
  }
  
  .deployment-step {
    background-color: var(--success);
  }
  
  .step-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
  
  .step-box h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: white;
  }
  
  .step-box p {
    margin: 0;
    font-size: 0.875rem;
    opacity: 0.9;
  }
  
  .step-status {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
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
  }
  
  .diagram-arrow {
    font-size: 1.5rem;
    color: var(--gray-400);
    margin: 0 -0.5rem;
    align-self: center;
  }
  
  .step-completed .step-box {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  .step-in-progress .step-box {
    animation: pulse-box 2s infinite;
  }
  
  .workflow-info {
    text-align: center;
    color: var(--gray-600);
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--gray-200);
  }
  
  .workflow-info p {
    margin: 0.5rem 0;
    font-size: 0.9rem;
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
      width: 200px;
    }
  }
  </style>