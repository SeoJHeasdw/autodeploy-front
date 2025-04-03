<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <div class="page-info">
          <h1 class="page-title">{{ currentPageTitle }}</h1>
          <div class="breadcrumb" v-if="breadcrumbs.length > 0">
            <span v-for="(crumb, index) in breadcrumbs" :key="index">
              <span v-if="index > 0" class="breadcrumb-separator">
                <i class="fas fa-chevron-right"></i>
              </span>
              <router-link v-if="crumb.path && index < breadcrumbs.length - 1" :to="crumb.path">
                {{ crumb.name }}
              </router-link>
              <span v-else>{{ crumb.name }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="header-right">
        <div class="search-container">
          <div class="search-input">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="검색..." />
          </div>
        </div>

        <div class="header-actions">
          <button class="action-btn" title="도움말">
            <i class="fas fa-question-circle"></i>
          </button>
          
          <button class="action-btn" title="알림">
            <i class="fas fa-bell"></i>
            <span class="notification-badge">3</span>
          </button>
          
          <button class="action-btn" @click="toggleTheme" title="테마 변경">
            <i class="fas" :class="isDarkMode ? 'fa-sun' : 'fa-moon'"></i>
          </button>
          
          <router-link to="/requirements/new" class="btn btn-primary btn-icon">
            <i class="fas fa-plus"></i>
            <span>새 요구사항</span>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// 테마 변경 관련 상태
const isDarkMode = ref(false);

// 현재 페이지 제목 및 경로 관련
const route = useRoute();

// 페이지 제목 계산
const currentPageTitle = computed(() => {
  return route.meta.title || '자동화 CI/CD 플랫폼';
});

// 경로 기반 breadcrumb 생성
const breadcrumbs = computed(() => {
  const crumbs = [];
  
  // 홈 항상 포함
  crumbs.push({ name: '홈', path: '/' });
  
  // 현재 경로 분석하여 breadcrumb 생성
  const pathParts = route.path.split('/').filter(part => part);
  
  if (pathParts.length > 0) {
    let currentPath = '';
    
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentPath += `/${part}`;
      
      // ID 값이면 스킵 (마지막 항목으로 처리)
      if (part.match(/^[0-9a-f-]+$/)) continue;
      
      // 경로명 변환
      let name = '';
      switch (part) {
        case 'requirements':
          name = '요구사항';
          break;
        case 'deployments':
          name = '배포 관리';
          break;
        case 'new':
          name = '생성';
          break;
        case 'analytics':
          name = '분석';
          break;
        case 'settings':
          name = '설정';
          break;
        default:
          name = part.charAt(0).toUpperCase() + part.slice(1);
      }
      
      // 마지막 항목이면 path 없이 추가 (현재 페이지)
      if (i === pathParts.length - 1) {
        crumbs.push({ name });
      } else {
        crumbs.push({ name, path: currentPath });
      }
    }
  }
  
  return crumbs;
});

// 테마 변경 함수
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark-theme', isDarkMode.value);
  localStorage.setItem('darkMode', isDarkMode.value);
};

// 컴포넌트 마운트 시 저장된 테마 적용
onMounted(() => {
  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme === 'true') {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark-theme');
  }
});
</script>

<style>
.app-header {
  background-color: var(--white);
  border-bottom: 1px solid var(--gray-200);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 70px; /* 고정된 높이 설정 */
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-info {
  display: flex;
  flex-direction: column;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-900);
}

.breadcrumb {
  font-size: 0.8rem;
  color: var(--gray-600);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.breadcrumb a {
  color: var(--primary);
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 0.25rem;
  font-size: 0.7rem;
}

.search-container {
  position: relative;
}

.search-input {
  position: relative;
  width: 250px;
  display: flex;
  align-items: center;
}

.search-input input {
  width: 100%;
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  margin-left: 15px;
}

.search-input input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
  outline: none;
}

.search-input i {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-500);
  z-index: 1;
  pointer-events: none;
}




.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-btn {
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: var(--gray-700);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--gray-100);
  color: var(--primary);
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: var(--danger);
  color: white;
  font-size: 0.7rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .app-header {
    height: auto;
  }
  
  .header-content {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem;
  }
  
  .header-left, .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .search-input {
    width: 100%;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .breadcrumb {
    display: none;
  }
}
</style>