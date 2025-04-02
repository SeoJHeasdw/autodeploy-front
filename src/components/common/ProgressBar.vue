<template>
    <div class="progress-container">
      <div v-if="showLabel" class="progress-label">
        <slot name="label">
          <span>{{ label }}</span>
        </slot>
        <span v-if="showPercentage">{{ value }}%</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${value}%` }"
          :class="{
            'progress-animated': animated,
            [`progress-${color}`]: color
          }"
        ></div>
      </div>
      <slot name="info"></slot>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    value: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0 && value <= 100
    },
    color: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'success', 'danger', 'warning', 'info'].includes(value)
    },
    label: {
      type: String,
      default: ''
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    showPercentage: {
      type: Boolean,
      default: true
    },
    animated: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '0.5rem'
    }
  });
  </script>
  
  <style scoped>
  .progress-container {
    width: 100%;
    margin: var(--space-md) 0;
  }
  
  .progress-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-sm);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--gray-600);
  }
  
  .progress-bar {
    height: v-bind('height');
    background-color: var(--gray-200);
    border-radius: var(--radius-full);
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width var(--transition-normal);
  }
  
  .progress-primary {
    background-color: var(--primary);
  }
  
  .progress-success {
    background-color: var(--success);
  }
  
  .progress-danger {
    background-color: var(--danger);
  }
  
  .progress-warning {
    background-color: var(--warning);
  }
  
  .progress-info {
    background-color: var(--info);
  }
  
  .progress-animated {
    background-image: linear-gradient(45deg, 
      rgba(255, 255, 255, 0.15) 25%, 
      transparent 25%, 
      transparent 50%, 
      rgba(255, 255, 255, 0.15) 50%, 
      rgba(255, 255, 255, 0.15) 75%, 
      transparent 75%, 
      transparent);
    background-size: 1rem 1rem;
    animation: progress-animation 1s linear infinite;
  }
  
  @keyframes progress-animation {
    0% { background-position: 1rem 0; }
    100% { background-position: 0 0; }
  }
  </style>