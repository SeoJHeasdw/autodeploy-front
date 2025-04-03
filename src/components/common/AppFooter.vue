<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-main">
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
        
        <div class="footer-newsletter">
          <h3>뉴스레터 구독</h3>
          <p>최신 업데이트 및 소식을 받아보세요</p>
          <div class="newsletter-form">
            <input type="email" placeholder="이메일 입력" />
            <button class="subscribe-btn">구독</button>
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
      
      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; {{ currentYear }} AutoDeploy. All rights reserved.</p>
        </div>
        <div class="footer-info">
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="#">사이트맵</a>
        </div>
      </div>
      
      <div class="scroll-top" @click="scrollToTop">
        <i class="fas fa-arrow-up"></i>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
</script>

<style>
.app-footer {
  background-color: var(--gray-900);
  color: var(--gray-300);
  padding: 0;
  width: 100%;
  margin-top: auto; /* 푸터를 페이지 하단에 고정 */
}

.footer-container {
  width: 100%;
  padding: 3rem 1.5rem 1.5rem;
  position: relative;
}

.footer-main {
  display: grid;
  grid-template-columns: 1.5fr 3fr 1.5fr;
  gap: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--gray-800);
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.link-group h3 {
  font-size: 1rem;
  color: var(--white);
  margin-bottom: 1.25rem;
  position: relative;
}

.link-group h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.5rem;
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 1px;
}

.link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-group li {
  margin-bottom: 0.75rem;
}

.link-group a {
  color: var(--gray-400);
  text-decoration: none;
  transition: color var(--transition-fast);
  font-size: 0.9rem;
}

.link-group a:hover {
  color: var(--primary-light);
}

.footer-newsletter h3 {
  font-size: 1rem;
  color: var(--white);
  margin-bottom: 0.75rem;
}

.footer-newsletter p {
  color: var(--gray-400);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.newsletter-form {
  display: flex;
  margin-bottom: 1.25rem;
}

.newsletter-form input {
  flex: 1;
  padding: 0.75rem 1rem;
  background-color: var(--gray-800);
  border: 1px solid var(--gray-700);
  border-right: none;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  color: var(--white);
  font-size: 0.9rem;
}

.newsletter-form input:focus {
  outline: none;
  border-color: var(--primary);
}

.subscribe-btn {
  padding: 0.75rem 1.25rem;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  font-weight: 500;
}

.subscribe-btn:hover {
  background-color: var(--primary-dark);
}

.social-links {
  display: flex;
  gap: 1rem;
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

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
}

.copyright p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--gray-500);
}

.footer-info {
  display: flex;
  gap: 1.5rem;
}

.footer-info a {
  font-size: 0.875rem;
  color: var(--gray-500);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-info a:hover {
  color: var(--primary-light);
}

.scroll-top {
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  width: 40px;
  height: 40px;
  background-color: var(--primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.scroll-top:hover {
  background-color: var(--primary-dark);
  transform: translateY(-3px);
}

@media (max-width: 1024px) {
  .footer-main {
    grid-template-columns: 1fr 2fr;
  }
  
  .footer-newsletter {
    grid-column: span 2;
    margin-top: 1rem;
  }
}

@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-links {
    grid-template-columns: 1fr 1fr;
  }
  
  .footer-newsletter {
    grid-column: auto;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>