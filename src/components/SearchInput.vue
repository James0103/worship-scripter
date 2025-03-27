<template>
  <div class="search-container">
    <input
      type="text"
      v-model="searchQuery"
      :placeholder="placeholder"
      class="search-input"
      @input="handleSearch"
    />
    <div v-if="showResults && filteredResults.length > 0" class="search-results">
      <div
        v-for="hymn in filteredResults"
        :key="hymn.id"
        class="search-result-item"
        @click="selectResult(hymn)"
      >
        {{ hymn.fullTitle }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import hymnsData from '../data/hymns.json'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '찬송가 번호나 제목을 입력하세요',
  },
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref(props.modelValue)
const showResults = ref(false)

// props.modelValue가 외부에서 변경될 때 searchQuery 업데이트
watch(
  () => props.modelValue,
  (newValue) => {
    searchQuery.value = newValue
  },
)

const filteredResults = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return hymnsData.hymns.filter(
    (hymn) =>
      hymn.fullTitle.toLowerCase().includes(query) ||
      hymn.id.includes(query) ||
      hymn.title.toLowerCase().includes(query),
  )
})

const handleSearch = () => {
  showResults.value = true
  emit('update:modelValue', searchQuery.value)
}

// const loadLyrics = async (hymnId) => {
//   try {
//     const response = await fetch(`/src/data/${hymnId}.json`)
//     const data = await response.json()
//     console.log('찬송가 가사:', data)
//     return data
//   } catch (error) {
//     console.error('가사 로딩 실패:', error)
//     return null
//   }
// }

const selectResult = async (hymn) => {
  searchQuery.value = hymn.fullTitle
  emit('update:modelValue', hymn.fullTitle)
  showResults.value = false

  // 선택된 찬송가의 가사 데이터 로드
  // await loadLyrics(hymn.id)
}
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.search-result-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-result-item:hover {
  background-color: #f3f4f6;
}
</style>
