<script setup>
import { ref, watch } from 'vue'
import SearchInput from './SearchInput.vue'

const props = defineProps({
  step: {
    type: Object,
    required: true,
  },
  value: {
    type: [String, Number, Array],
    default: '',
  },
})

const emit = defineEmits(['update:value', 'complete'])

const localValue = ref(props.value)
// value prop이 변경될 때 localValue 업데이트
watch(
  () => props.value,
  (newValue) => {
    if (newValue !== localValue.value) {
      localValue.value = newValue
    }
  },
)

watch(localValue, (newValue) => {
  emit('update:value', newValue)
  emit('complete', newValue)
})

const handleInput = (event) => {
  const value = event?.target?.value ?? event
  localValue.value = value
}
</script>

<template>
  <div class="form-area w-full max-w-2xl mx-auto p-6">
    <Transition name="fade" mode="out-in">
      <div :key="step.id" class="space-y-4">
        <h2 class="question-title">{{ step.question }}</h2>
        <div class="space-y-2">
          <input
            v-if="step.type === 'text'"
            v-model="localValue"
            type="text"
            class="w-full"
            @input="handleInput"
          />
          <SearchInput
            v-else-if="step.type === 'search'"
            v-model="localValue"
            @update:modelValue="handleInput"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.form-area {
  width: 100%;
  min-height: 120px;
}
.question-title {
  text-align: center;
  font-size: 20px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
