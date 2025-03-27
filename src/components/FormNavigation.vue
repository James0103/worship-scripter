<script setup>
defineProps({
  canGoBack: {
    type: Boolean,
    default: false,
  },
  canGoForward: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['prev', 'next'])
</script>

<template>
  <div class="navigation-container">
    <button @click="$emit('prev')" :disabled="!canGoBack" class="button button-secondary">
      이전
    </button>
    <button @click="$emit('next')" :disabled="!canGoForward" class="button">다음</button>
  </div>
</template>

<style scoped>
.navigation-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.button {
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.button-secondary:not(:disabled):hover {
  background-color: #d1d5db;
}

.button-primary {
  background-color: #2563eb;
  color: white;
}

.button-primary:not(:disabled):hover {
  background-color: #1d4ed8;
}
</style>
