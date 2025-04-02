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

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--background);
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* 필요한 경우 내용이 넘치지 않도록 함 */
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>