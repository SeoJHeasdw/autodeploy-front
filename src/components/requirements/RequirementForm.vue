<template>
    <div class="requirement-form">
      <h2>고객 요구사항 입력</h2>
      <form @submit.prevent="submitRequirement">
        <div class="form-group">
          <label for="title">제목</label>
          <input 
            type="text" 
            id="title" 
            v-model="form.title" 
            placeholder="요구사항 제목" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="description">상세 설명</label>
          <textarea 
            id="description" 
            v-model="form.description" 
            placeholder="요구사항에 대한 상세 설명을 입력해주세요" 
            rows="6" 
            required
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="priority">우선순위</label>
          <select id="priority" v-model="form.priority">
            <option value="high">높음</option>
            <option value="medium">중간</option>
            <option value="low">낮음</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="deadline">마감일</label>
          <input 
            type="date" 
            id="deadline" 
            v-model="form.deadline"
          />
        </div>
        
        <div class="form-actions">
          <Button variant="btn-primary" @click="resetForm">
            초기화
          </Button>
          <Button variant="primary">
            요구사항 제출
          </Button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRequirementStore } from '@/store/modules/requirement.store';
  
  const requirementStore = useRequirementStore();
  
  const form = ref({
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
  });
  
  const submitRequirement = async () => {
    try {
      await requirementStore.submitRequirement(form.value);
      resetForm();
    } catch (error) {
      console.error('요구사항 제출 중 오류 발생:', error);
    }
  };
  
  const resetForm = () => {
    form.value = {
      title: '',
      description: '',
      priority: 'medium',
      deadline: '',
    };
  };
  </script>
  
  <style scoped>
  .requirement-form {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 1.2rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  textarea {
    resize: vertical;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  </style>