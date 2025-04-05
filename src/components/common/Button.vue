<!-- src/components/common/Button.vue -->
<template>
    <button 
      :class="[
        'inline-flex items-center justify-center px-4 py-2 rounded font-medium transition-colors',
        variant === 'primary' ? 'bg-primary text-white hover:bg-primary-dark' : '',
        variant === 'secondary' ? 'bg-secondary text-white hover:bg-secondary-dark' : '',
        variant === 'danger' ? 'bg-danger text-white hover:bg-danger-dark' : '',
        variant === 'outline' ? 'border border-gray-300 text-gray-700 hover:bg-gray-100' : '',
        size === 'sm' ? 'text-sm py-1 px-3' : '',
        size === 'lg' ? 'text-lg py-3 px-6' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ]"
      :disabled="disabled"
      @click="$emit('click')"
    >
      <slot></slot>
    </button>
  </template>
  
  <script setup>
  defineProps({
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'danger', 'outline'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  });
  
  defineEmits(['click']);
  </script>