<template>
  <div class="app-container">
    <AppSidebar />
    <div class="main-wrapper">
      <AppHeader />
      <main class="main-content">
        <router-view />
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

/* App.vue 스타일 수정 */
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

/* main-content는 그대로 유지 */
.main-content {
  flex: 1;
  padding: 1.5rem;
  width: 100%;
  max-width: 1280px; /* 최대 너비 제한 유지 */
  margin: 0 auto; /* 가운데 정렬 유지 */
}
</style>