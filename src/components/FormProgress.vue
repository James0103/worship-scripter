<template>
  <div class="progress-container">
    <div class="progress-header">
      <span class="progress-text"> Step {{ currentStep }} of {{ totalSteps }} </span>
      <span class="progress-text"> {{ Math.round((currentStep / totalSteps) * 100) }}% </span>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: (currentStep / totalSteps) * 100 + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
  totalSteps: {
    type: Number,
    required: true,
  },
})
</script>

<style scoped>
.progress-container {
  width: 100%;
  margin-bottom: 2rem;
  padding: 2rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.progress-bar-container {
  width: 100%;
  height: 0.625rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
}

.progress-bar {
  height: 100%;
  background-color: #2563eb;
  border-radius: 9999px;
  transition: width 0.3s ease;
}
</style>
