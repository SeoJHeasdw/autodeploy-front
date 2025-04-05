<template>
  <div class="flex justify-center items-center min-h-[70vh] text-center p-8">
    <div class="max-w-[500px]">
      <h1 class="text-6xl m-0 text-success leading-tight">404</h1>
      <h2 class="text-2xl mb-4 text-gray-800">페이지를 찾을 수 없습니다</h2>
      <p class="text-lg text-gray-600 mb-8">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
      <router-link to="/" class="inline-block py-3 px-6 bg-success text-white rounded font-medium transition-colors hover:bg-green-600">
        홈으로 돌아가기
      </router-link>
    </div>
  </div>
</template>

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

</style>