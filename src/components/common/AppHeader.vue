<template>
    <header class="app-header">
      <div class="container">
        <div class="brand">
          <router-link to="/">
            <h1>AutoDeploy</h1>
          </router-link>
        </div>
        
        <nav class="main-nav">
          <ul>
            <li>
              <router-link to="/" exact>대시보드</router-link>
            </li>
            <li>
              <router-link to="/requirements">요구사항</router-link>
            </li>
            <li>
              <router-link to="/deployments">배포 관리</router-link>
            </li>
          </ul>
        </nav>
        
        <div class="actions">
          <button class="btn-action">
            <i class="fas fa-plus"></i>
            <span>새 요구사항</span>
          </button>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  // 필요한 경우 여기에 스크립트 로직 추가
  </script>
  
  <style scoped>
  .app-header {
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1rem 0;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .brand a {
    text-decoration: none;
    color: #333;
  }
  
  .brand h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .main-nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .main-nav li {
    margin-right: 1.5rem;
  }
  
  .main-nav a {
    text-decoration: none;
    color: #555;
    font-weight: 500;
    padding: 0.5rem 0;
    position: relative;
  }
  
  .main-nav a:hover {
    color: #4CAF50;
  }
  
  .main-nav a.router-link-active {
    color: #4CAF50;
  }
  
  .main-nav a.router-link-active::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #4CAF50;
  }
  
  .actions {
    display: flex;
    align-items: center;
  }
  
  .btn-action {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: #4CAF50;
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-action:hover {
    background-color: #45a049;
  }
  
  .btn-action i {
    margin-right: 0.5rem;
  }
  
  @media (max-width: 768px) {
    .container {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .brand {
      margin-bottom: 1rem;
    }
    
    .main-nav {
      width: 100%;
      margin-bottom: 1rem;
    }
    
    .main-nav ul {
      flex-direction: column;
    }
    
    .main-nav li {
      margin-right: 0;
      margin-bottom: 0.5rem;
    }
    
    .actions {
      width: 100%;
    }
    
    .btn-action {
      width: 100%;
      justify-content: center;
    }
  }
  </style>