<template>
    <footer class="app-footer">
      <div class="container">
        <div class="footer-content">
          <div class="copyright">
            <p>&copy; {{ currentYear }} AutoDeploy. All rights reserved.</p>
          </div>
          <div class="footer-links">
            <a href="#" target="_blank">문서</a>
            <a href="#" target="_blank">지원</a>
            <a href="#" target="_blank">GitHub</a>
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
    background-color: #f8f9fa;
    border-top: 1px solid #e9ecef;
    padding: 1.5rem 0;
    margin-top: 2rem;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .copyright p {
    margin: 0;
    color: #6c757d;
    font-size: 0.875rem;
  }
  
  .footer-links {
    display: flex;
    gap: 1.5rem;
  }
  
  .footer-links a {
    color: #6c757d;
    text-decoration: none;
    font-size: 0.875rem;
  }
  
  .footer-links a:hover {
    color: #4CAF50;
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      text-align: center;
    }
    
    .copyright {
      margin-bottom: 1rem;
    }
  }
  </style>