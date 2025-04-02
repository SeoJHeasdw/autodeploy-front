<template>
  <aside :class="['app-sidebar', { 'collapsed': isCollapsed }]">
    <div class="sidebar-header">
      <div class="brand">
        <svg class="logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2L3 9L16 16L29 9L16 2Z" fill="var(--primary)"/>
          <path d="M3 23L16 30L29 23V9L16 16L3 9V23Z" fill="var(--primary-light)" fill-opacity="0.7"/>
        </svg>
        <h1 v-if="!isCollapsed">AutoDeploy</h1>
      </div>
      <button class="collapse-btn" @click="toggleSidebar">
        <i class="fas" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
      </button>
    </div>

    <div class="sidebar-content">
      <nav class="sidebar-nav">
        <ul>
          <li>
            <router-link to="/" class="nav-link" :title="isCollapsed ? '대시보드' : ''">
              <i class="fas fa-tachometer-alt"></i>
              <span v-if="!isCollapsed">대시보드</span>
            </router-link>
          </li>
          <li>
            <router-link to="/requirements" class="nav-link" :title="isCollapsed ? '요구사항' : ''">
              <i class="fas fa-clipboard-list"></i>
              <span v-if="!isCollapsed">요구사항</span>
            </router-link>
          </li>
          <li>
            <router-link to="/deployments" class="nav-link" :title="isCollapsed ? '배포 관리' : ''">
              <i class="fas fa-rocket"></i>
              <span v-if="!isCollapsed">배포 관리</span>
            </router-link>
          </li>
          <li>
            <router-link to="/analytics" class="nav-link" :title="isCollapsed ? '분석' : ''">
              <i class="fas fa-chart-bar"></i>
              <span v-if="!isCollapsed">분석</span>
            </router-link>
          </li>
          <li>
            <router-link to="/settings" class="nav-link" :title="isCollapsed ? '설정' : ''">
              <i class="fas fa-cog"></i>
              <span v-if="!isCollapsed">설정</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <div class="sidebar-footer">
      <div class="user-info" v-if="!isCollapsed">
        <div class="user-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="user-details">
          <p class="user-name">개발자 계정</p>
          <p class="user-role">관리자</p>
        </div>
      </div>
      <button class="logout-btn" :title="isCollapsed ? '로그아웃' : ''">
        <i class="fas fa-sign-out-alt"></i>
        <span v-if="!isCollapsed">로그아웃</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// ref와 함수 정의
const isCollapsed = ref(false);

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('sidebarCollapsed', isCollapsed.value);
}

// onMounted 훅 사용
onMounted(() => {
  try {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      isCollapsed.value = savedState === 'true';
    }
  } catch (e) {
    console.error('Failed to load sidebar state:', e);
  }
});
</script>

<style>
.app-sidebar {
  height: 100vh;
  background-color: var(--gray-900);
  color: var(--gray-200);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 250px;
  flex-shrink: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.app-sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 1.25rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  white-space: nowrap;
}

.logo-icon {
  flex-shrink: 0;
}

.collapse-btn {
  background: transparent;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.collapse-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--white);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: var(--gray-300);
  text-decoration: none;
  transition: all 0.2s ease;
  gap: 1rem;
}

.collapsed .nav-link {
  padding: 0.75rem;
  justify-content: center;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--white);
}

.nav-link.router-link-active {
  color: var(--white);
  background-color: rgba(67, 97, 238, 0.2);
  border-left: 3px solid var(--primary);
}

.nav-link i {
  font-size: 1.1rem;
  min-width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background-color: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  flex-shrink: 0;
}

.user-details {
  overflow: hidden;
}

.user-name, .user-role {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--white);
}

.user-role {
  font-size: 0.75rem;
  color: var(--gray-400);
}

.logout-btn {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: transparent;
  color: var(--gray-300);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: rgba(230, 57, 70, 0.1);
  color: var(--danger);
  border-color: var(--danger);
}

@media (max-width: 768px) {
  .app-sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  
  .app-sidebar.collapsed {
    width: 100%;
    height: auto;
  }
  
  .sidebar-nav ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-link {
    padding: 0.75rem;
  }
  
  .sidebar-footer {
    display: none;
  }
}
</style>