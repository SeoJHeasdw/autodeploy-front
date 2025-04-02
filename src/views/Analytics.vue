<template>
    <div class="analytics-page">
      <h1>분석 및 통계</h1>
      <div class="coming-soon">
        <img src="@/assets/chart-placeholder.svg" alt="분석 준비 중" />
        <h2>준비 중입니다</h2>
        <p>분석 및 통계 기능은 곧 제공될 예정입니다. 조금만 기다려주세요!</p>
      </div>
    </div>
  </template>
  
  <script setup>
  // 추후 분석 관련 로직 추가 예정
  </script>
  
  <style scoped>
  .analytics-page {
    padding: 1.5rem;
  }
  
  .coming-soon {
    margin-top: 3rem;
    text-align: center;
    padding: 3rem;
    background-color: var(--gray-100);
    border-radius: var(--radius-lg);
  }
  
  .coming-soon img {
    max-width: 250px;
    margin-bottom: 1.5rem;
  }
  
  .coming-soon h2 {
    font-size: 1.75rem;
    margin-bottom: 1rem;
    color: var(--gray-800);
  }
  
  .coming-soon p {
    font-size: 1.1rem;
    color: var(--gray-600);
    max-width: 500px;
    margin: 0 auto;
  }
  </style>