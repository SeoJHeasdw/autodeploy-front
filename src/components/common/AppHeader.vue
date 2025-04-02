<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <div class="brand">
          <router-link to="/">
            <div class="logo d-flex align-items-center">
              <svg class="logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L3 9L16 16L29 9L16 2Z" fill="var(--primary)"/>
                <path d="M3 23L16 30L29 23V9L16 16L3 9V23Z" fill="var(--primary-light)" fill-opacity="0.7"/>
              </svg>
              <h1>AutoDeploy</h1>
            </div>
          </router-link>
        </div>
        
        <nav class="main-nav">
          <ul>
            <li>
              <router-link to="/" exact class="nav-link">
                <i class="fas fa-tachometer-alt"></i>
                <span>대시보드</span>
              </router-link>
            </li>
            <li>
              <router-link to="/requirements" class="nav-link">
                <i class="fas fa-clipboard-list"></i>
                <span>요구사항</span>
              </router-link>
            </li>
            <li>
              <router-link to="/deployments" class="nav-link">
                <i class="fas fa-rocket"></i>
                <span>배포 관리</span>
              </router-link>
            </li>
          </ul>
        </nav>
        
        <div class="actions">
          <div class="dropdown hide-mobile">
            <button class="btn btn-ghost btn-icon">
              <i class="fas fa-bell"></i>
            </button>
          </div>
          
          <router-link to="/requirements/new" class="btn btn-primary btn-icon">
            <i class="fas fa-plus"></i>
            <span>새 요구사항</span>
          </router-link>
        </div>
        
        <!-- 모바일 메뉴 토글 버튼 -->
        <button class="mobile-toggle hide-desktop" @click="toggleMobileMenu">
          <i class="fas" :class="mobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
        </button>
      </div>
    </div>
    
    <!-- 모바일 메뉴 -->
    <div class="mobile-menu" :class="{ 'open': mobileMenuOpen }">
      <nav>
        <ul>
          <li>
            <router-link to="/" exact class="nav-link" @click="toggleMobileMenu">
              <i class="fas fa-tachometer-alt"></i>
              <span>대시보드</span>
            </router-link>
          </li>
          <li>
            <router-link to="/requirements" class="nav-link" @click="toggleMobileMenu">
              <i class="fas fa-clipboard-list"></i>
              <span>요구사항</span>
            </router-link>
          </li>
          <li>
            <router-link to="/deployments" class="nav-link" @click="toggleMobileMenu">
              <i class="fas fa-rocket"></i>
              <span>배포 관리</span>
            </router-link>
          </li>
          <li>
            <router-link to="/requirements/new" class="nav-link" @click="toggleMobileMenu">
              <i class="fas fa-plus"></i>
              <span>새 요구사항</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  
  // 모바일 메뉴가 열려있을 때 스크롤 방지
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  background-color: var(--white);
  box-shadow: var(--shadow-sm);
  z-index: 100;
  padding: 0.75rem 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand a {
  text-decoration: none;
  color: var(--gray-900);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.brand h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.main-nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--gray-700);
  font-weight: 500;
  padding: 0.5rem 0.25rem;
  position: relative;
  transition: color var(--transition-fast);
}

.nav-link i {
  font-size: 1rem;
}

.nav-link:hover {
  color: var(--primary);
}

.nav-link.router-link-active {
  color: var(--primary);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary);
  border-radius: var(--radius-full);
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 모바일 메뉴 토글 버튼 */
.mobile-toggle {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: var(--gray-700);
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.mobile-toggle:hover {
  background-color: var(--gray-100);
}

/* 모바일 메뉴 */
.mobile-menu {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--white);
  z-index: 99;
  transform: translateX(100%);
  transition: transform var(--transition-normal);
  overflow-y: auto;
  padding: 1.5rem;
}

.mobile-menu.open {
  transform: translateX(0);
}

.mobile-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-menu .nav-link {
  display: flex;
  padding: 1rem 0.5rem;
  font-size: 1.125rem;
  border-bottom: 1px solid var(--gray-200);
}

.mobile-menu .nav-link i {
  width: 24px;
  margin-right: 0.75rem;
}

@media (max-width: 768px) {
  .main-nav {
    display: none;
  }
}
</style>