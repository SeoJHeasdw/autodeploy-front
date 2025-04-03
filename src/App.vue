<template>
  <div class="app-container">
    <AppSidebar />
    <div class="main-wrapper">
      <AppHeader />
      <main class="main-content">
        <div class="content-container">
          <router-view />
        </div>
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppFooter from '@/components/common/AppFooter.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';

onMounted(() => {
  console.log('Application mounted');
});
</script>

<style>
.app-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: var(--background);
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 250px; /* 사이드바 너비만큼 마진 */
  width: calc(100% - 250px); /* 전체 너비에서 사이드바 너비 제외 */
  min-width: 0;
  overflow-x: hidden;
}

/* 사이드바 접힐 때 */
.app-sidebar.collapsed + .main-wrapper {
  margin-left: 70px;
  width: calc(100% - 70px); /* 접힌 사이드바 너비 반영 */
}

/* main-content는 전체 너비를 차지하도록 변경 */
.main-content {
  flex: 1;
  width: 100%;
  padding: 1.5rem;
  overflow-x: auto;
}

/* 실제 컨텐츠는 content-container 안에서 중앙 정렬 */
.content-container {
  max-width: 1280px; 
  margin: 0 auto;
}

/* 미디어 쿼리 추가 */
@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 0;
    width: 100%;
  }
  
  .app-sidebar.collapsed + .main-wrapper {
    margin-left: 0;
    width: 100%;
  }
}

</style>