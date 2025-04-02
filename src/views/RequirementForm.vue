<template>
    <div class="requirement-form-view">
      <h1>새 요구사항 등록</h1>
      <RequirementForm />
    </div>
  </template>
  
  <script setup>
  import RequirementForm from '@/components/requirements/RequirementForm.vue';
  </script>
  
  <style scoped>
  .requirement-form-view {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  </style>