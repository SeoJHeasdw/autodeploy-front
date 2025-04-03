<template>
    <div class="not-found">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>페이지를 찾을 수 없습니다</h2>
        <p>요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
        <router-link to="/" class="btn-primary">
          홈으로 돌아가기
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  // 필요한 경우 스크립트 로직 추가
  </script>
  
  <style scoped>
  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
    text-align: center;
    padding: 2rem;
  }
  
  .not-found-content {
    max-width: 500px;
  }
  
  h1 {
    font-size: 6rem;
    margin: 0;
    color: #4CAF50;
    line-height: 1;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  p {
    font-size: 1.125rem;
    color: #666;
    margin-bottom: 2rem;
  }
  
  .btn-primary {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #4CAF50;
    color: white;
    border-radius: 4px;
    font-weight: 500;
    text-decoration: none;
    transition: background-color 0.2s;
  }
  
  .btn-primary:hover {
    background-color: #45a049;
    text-decoration: none;
  }
  </style>