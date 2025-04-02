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

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0; /* 내용이 넘치지 않도록 함 */
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  width: 100%;
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