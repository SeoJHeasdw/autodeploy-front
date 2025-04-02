<template>
  <footer class="app-footer">
    <div class="footer-content container">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="d-flex align-items-center mb-2">
            <svg class="logo-icon me-2" width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L3 9L16 16L29 9L16 2Z" fill="var(--primary)"/>
              <path d="M3 23L16 30L29 23V9L16 16L3 9V23Z" fill="var(--primary-light)" fill-opacity="0.7"/>
            </svg>
            <h2 class="logo-text">AutoDeploy</h2>
          </div>
          <p class="footer-description">빠르고 안정적인 CI/CD 배포 자동화</p>
        </div>
        
        <div class="footer-links">
          <div class="link-group">
            <h3>서비스</h3>
            <ul>
              <li><a href="#">요구사항 관리</a></li>
              <li><a href="#">배포 관리</a></li>
              <li><a href="#">CI/CD 통합</a></li>
              <li><a href="#">모니터링</a></li>
            </ul>
          </div>
          
          <div class="link-group">
            <h3>도움말</h3>
            <ul>
              <li><a href="#">문서</a></li>
              <li><a href="#">API 레퍼런스</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">지원</a></li>
            </ul>
          </div>
          
          <div class="link-group">
            <h3>회사</h3>
            <ul>
              <li><a href="#">소개</a></li>
              <li><a href="#">블로그</a></li>
              <li><a href="#">채용</a></li>
              <li><a href="#">연락처</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; {{ currentYear }} AutoDeploy. All rights reserved.</p>
        </div>
        <div class="social-links">
          <a href="#" class="social-link" aria-label="GitHub">
            <i class="fab fa-github"></i>
          </a>
          <a href="#" class="social-link" aria-label="Twitter">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="#" class="social-link" aria-label="LinkedIn">
            <i class="fab fa-linkedin"></i>
          </a>
          <a href="#" class="social-link" aria-label="YouTube">
            <i class="fab fa-youtube"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.app-footer {
  background-color: var(--gray-900);
  color: var(--gray-300);
  padding: var(--space-xl) 0;
  margin-top: auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xl);
}

.footer-brand {
  flex: 1;
  min-width: 250px;
}

.logo-text {
  font-size: 1.5rem;
  margin: 0;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.footer-description {
  margin-top: var(--space-sm);
  color: var(--gray-400);
  max-width: 300px;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xl);
}

.link-group {
  min-width: 160px;
}

.link-group h3 {
  font-size: 1rem;
  color: var(--white);
  margin-bottom: var(--space-md);
}

.link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-group li {
  margin-bottom: var(--space-sm);
}

.link-group a {
  color: var(--gray-400);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.link-group a:hover {
  color: var(--primary-light);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-lg);
  border-top: 1px solid var(--gray-800);
}

.copyright p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--gray-500);
}

.social-links {
  display: flex;
  gap: var(--space-md);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: var(--gray-800);
  color: var(--gray-300);
  transition: all var(--transition-fast);
}

.social-link:hover {
  background-color: var(--primary);
  color: var(--white);
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
    gap: var(--space-xl);
  }
  
  .footer-links {
    flex-direction: column;
    gap: var(--space-lg);
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: var(--space-md);
    text-align: center;
  }
}
</style>