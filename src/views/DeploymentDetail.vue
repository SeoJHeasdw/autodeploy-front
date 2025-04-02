
<script setup>

// 필요한 import 추가
import { onMounted, onBeforeUnmount } from 'vue';

// 모의 업데이트 간격 (밀리초)
const UPDATE_INTERVAL = 3000;
let updateTimer = null;

// 모의 로그 메시지
const logsMessages = [
  "[INFO] 도커 이미지 빌드 중...",
  "[INFO] 의존성 설치 완료",
  "[INFO] 단위 테스트 진행 중...",
  "[INFO] 94% 테스트 성공",
  "[WARN] 일부 테스트에서 경고 발생",
  "[INFO] 이미지 태그 설정: v1.0.3",
  "[INFO] 도커 레이어 최적화 중...",
  "[INFO] GitOps 저장소에 변경사항 적용 중...",
  "[INFO] ArgoCD 동기화 시작",
  "[INFO] 새 버전 배포 준비 완료"
];

// 모의 업데이트 함수
const simulateDeploymentUpdates = () => {
  // 현재 배포 객체가 있고 진행 중인 상태일 때만 실행
  if (deploymentStore.currentDeployment && 
      deploymentStore.currentDeployment.status === 'in-progress') {
    
    const deployment = deploymentStore.currentDeployment;
    let currentProgress = deployment.overallProgress || 0;
    
    // 진행률이 95% 미만일 때만 업데이트 (완료는 별도로 처리)
    if (currentProgress < 95) {
      // 5~15% 사이 랜덤하게 증가
      const progressIncrement = 5 + Math.floor(Math.random() * 10);
      const newProgress = Math.min(95, currentProgress + progressIncrement);
      
      // 모의 로그 추가
      const randomLogIndex = Math.floor(Math.random() * logsMessages.length);
      const newLog = `[${new Date().toLocaleTimeString()}] ${logsMessages[randomLogIndex]}`;
      
      // 업데이트 적용
      const logs = [...(deployment.logs || []), newLog];
      
      // 단계 업데이트
      let steps = [...(deployment.steps || [])];
      
      // 진행률에 따라 단계 상태 업데이트
      if (newProgress >= 25 && newProgress < 50) {
        // 의존성 설치 완료, 테스트 시작
        steps = steps.map(step => {
          if (step.name === '코드 체크아웃') {
            return {...step, status: 'completed', completedAt: new Date().toISOString()};
          } else if (step.name === '의존성 설치') {
            return {...step, status: 'in-progress', startedAt: new Date().toISOString()};
          }
          return step;
        });
      } else if (newProgress >= 50 && newProgress < 75) {
        // 테스트 완료, 이미지 빌드 시작
        steps = steps.map(step => {
          if (step.name === '코드 체크아웃' || step.name === '의존성 설치') {
            return {...step, status: 'completed', completedAt: new Date().toISOString()};
          } else if (step.name === '테스트 실행') {
            return {...step, status: 'in-progress', startedAt: new Date().toISOString()};
          }
          return step;
        });
      } else if (newProgress >= 75) {
        // 이미지 빌드 중
        steps = steps.map(step => {
          if (step.name === '코드 체크아웃' || step.name === '의존성 설치' || step.name === '테스트 실행') {
            return {...step, status: 'completed', completedAt: new Date().toISOString()};
          } else if (step.name === '이미지 빌드') {
            return {...step, status: 'in-progress', startedAt: new Date().toISOString()};
          }
          return step;
        });
      }
      
      // 스토어 업데이트
      deploymentStore.updateDeploymentStatus(deployment.id, {
        overallProgress: newProgress,
        logs,
        steps,
        currentStep: newProgress >= 75 ? '이미지 빌드' : 
                    newProgress >= 50 ? '테스트 실행' : 
                    newProgress >= 25 ? '의존성 설치' : '코드 체크아웃'
      });
      
      // 일정 확률로 배포 완료 처리 (95% 이상일 때)
      if (newProgress >= 90 && Math.random() > 0.7) {
        setTimeout(() => {
          completeDeployment(deployment.id);
        }, 5000);
      }
    }
  }
};

// 배포 완료 처리
const completeDeployment = (deploymentId) => {
  if (!deploymentId) return;
  
  const steps = deploymentStore.deployments[deploymentId]?.steps || [];
  const updatedSteps = steps.map(step => ({
    ...step, 
    status: 'completed',
    completedAt: step.completedAt || new Date().toISOString()
  }));
  
  const logs = [
    ...(deploymentStore.deployments[deploymentId]?.logs || []),
    `[${new Date().toLocaleTimeString()}] [INFO] 모든 단계 완료됨`,
    `[${new Date().toLocaleTimeString()}] [INFO] 배포가 성공적으로 완료되었습니다.`
  ];
  
  // 배포 완료 상태 업데이트
  deploymentStore.updateDeploymentStatus(deploymentId, {
    status: 'completed',
    overallProgress: 100,
    completedAt: new Date().toISOString(),
    steps: updatedSteps,
    logs,
    currentStep: '완료'
  });
  
  // 타이머 정리
  if (updateTimer) {
    clearInterval(updateTimer);
    updateTimer = null;
  }
};

// 모의 업데이트 시작
const startSimulation = () => {
  // 이미 실행 중이면 중복 실행 방지
  if (updateTimer) return;
  
  // 첫 번째 업데이트는 빠르게
  simulateDeploymentUpdates();
  
  // 이후 정기적 업데이트
  updateTimer = setInterval(simulateDeploymentUpdates, UPDATE_INTERVAL);
};

// 모의 업데이트 정지
const stopSimulation = () => {
  if (updateTimer) {
    clearInterval(updateTimer);
    updateTimer = null;
  }
};

// 컴포넌트 라이프사이클 훅에 연결
onMounted(() => {
  // 배포 데이터 로드 후 시뮬레이션 시작
  setTimeout(startSimulation, 1000);
});

onBeforeUnmount(() => {
  stopSimulation();
});
</script>