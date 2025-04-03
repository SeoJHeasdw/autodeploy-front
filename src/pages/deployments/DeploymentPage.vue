<template>
    <!-- DeploymentPage.vue 내에서 WorkflowDiagram 사용 예시 -->
    <div class="deployment-page">
      <h1>배포 상태</h1>
      
      <!-- 실제 배포 상태를 보여주는 워크플로우 다이어그램 -->
      <WorkflowDiagram 
        :isDemo="false" 
        :deploymentId="currentDeploymentId" 
        :autoAnimate="false"
      />
      
      <!-- 배포 세부 정보 컴포넌트 등 추가 내용 -->
      <DeploymentStatus v-if="currentDeploymentId" :deploymentId="currentDeploymentId" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useDeploymentStore } from '@/store/modules/deployment.store';
  import WorkflowDiagram from '@/components/common/WorkflowDiagram.vue';
  import DeploymentStatus from '@/components/deployment/DeploymentStatus.vue';
  
  const route = useRoute();
  const deploymentStore = useDeploymentStore();
  const currentDeploymentId = ref(null);
  
  onMounted(async () => {
    // URL에서 배포 ID 가져오기
    const routeId = route.params.id;
    
    if (routeId) {
      currentDeploymentId.value = routeId;
    } else {
      // ID가 없으면 최신 배포 정보 가져오기
      await deploymentStore.fetchLatestDeployment();
      currentDeploymentId.value = deploymentStore.currentDeploymentId;
    }
  });
  </script>