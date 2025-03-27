<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FormProgress from '../components/FormProgress.vue'
import FormStep from '../components/FormStep.vue'
import FormNavigation from '../components/FormNavigation.vue'
import SlideModal from '../components/SlideModal.vue'
import { generateSlideImage } from '../utils/imgGenerator'
import { loadHymnLyrics } from '../utils/hymnLoader'
import { downloadImagesAsZip, downloadImagesAsPPT } from '../utils/downloadAssets'

const isDownloading = ref(false)
const downloadAssets = async () => {
  try {
    isDownloading.value = true
    await downloadImagesAsZip(slides.value)
    await downloadImagesAsPPT(slides.value)
  } catch (error) {
    console.error('ZIP 다운로드 실패:', error)
  } finally {
    isDownloading.value = false
  }
}

const router = useRouter()
const route = useRoute()
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['sunday', 'wednesday'].includes(value),
  },
})

// 예배 유형별 스텝 정의
const worshipTypes = {
  wednesday: [
    { id: 'prayer', type: 'text', question: '기도' },
    { id: 'hymn', type: 'search', question: '찬송가 선택' },
    { id: 'sermon', type: 'text', question: '설교' },
    { id: 'scripture', type: 'text', question: '본문' },
    { id: 'title', type: 'text', question: '제목' },
  ],
  sunday: [
    { id: 'worship', type: 'search', question: '경배 찬양 선택' },
    { id: 'call', type: 'text', question: '예배부름' },
    { id: 'gloria', type: 'search', question: '송영 찬송가 선택' },
    { id: 'creed', type: 'text', question: '신앙고백' },
    { id: 'praise1', type: 'search', question: '찬양 선택' },
    { id: 'prayer', type: 'text', question: '기도' },
    { id: 'praise2', type: 'search', question: '찬양 선택' },
    { id: 'offering', type: 'text', question: '봉헌' },
    { id: 'news', type: 'text', question: '교회소식' },
    { id: 'scripture', type: 'text', question: '성경봉독' },
    { id: 'sermon', type: 'text', question: '말씀' },
    { id: 'praise3', type: 'search', question: '찬양 선택' },
    { id: 'benediction', type: 'text', question: '축도' },
  ],
}

const formSteps = computed(() => worshipTypes[props.type] || [])
const currentStep = computed(() => {
  if (formSteps.value.length === 0) return null
  return formSteps.value[currentStepIndex.value]
})
const hasCurrentStepData = computed(() => {
  if (!currentStep.value) return false
  const currentData = formData.value[currentStep.value.id]
  return !!currentData && currentData.trim() !== '' // 빈 문자열도 체크
})
const currentStepIndex = ref(0)
const formData = ref({})

// 슬라이드 관련 변수
const slides = ref([])
const selectedSlide = ref(null)
const showModal = ref(false)

onMounted(() => {
  const type = route.query.type

  if (!type || !worshipTypes[type]) {
    router.push('/')
    return
  }
})

const nextStep = async () => {
  if (!hasCurrentStepData.value) return

  const currentData = formData.value[currentStep.value.id]
  if (currentData) {
    if (currentStep.value.type === 'search') {
      try {
        const hymnId = currentData.split('.')[0].trim()
        const hymnData = await loadHymnLyrics(hymnId)

        if (hymnData) {
          const verses = hymnData.split('\n\n').map((verse) => verse.trim())

          // 찬송가의 각 절마다 슬라이드 생성
          slides.value[currentStepIndex.value] = {
            id: currentStepIndex.value,
            title: currentStep.value.question,
            song_title: currentData,
            type: 'hymn',
            imageUrls: [], // 각 절의 이미지 URL을 저장할 배열
          }

          // 각 절마다 이미지 생성
          const imagePromises = verses.map(async (verse) => {
            const imageUrl = await generateSlideImage(verse, {
              textColor: '#FFFFFF',
              fontSize: '64px',
            })
            return imageUrl
          })
          slides.value[currentStepIndex.value].imageUrls = await Promise.all(imagePromises)
        }
      } catch (error) {
        console.error('찬송가 데이터 처리 실패:', error)
      }
    } else {
      // 일반 슬라이드인 경우 기존 로직
      slides.value[currentStepIndex.value] = {
        id: currentStepIndex.value,
        title: currentStep.value.question,
        song_title: '',
        content: currentData,
        type: 'normal',
      }

      // 일반 슬라이드 이미지 생성
      const imageUrl = await generateSlideImage(currentData, {
        textColor: '#FFFFFF',
        fontSize: '64px',
      })
      slides.value[currentStepIndex.value].imageUrl = imageUrl
    }
  }

  if (currentStepIndex.value < formSteps.value.length - 1) {
    currentStepIndex.value++
  }
}
const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}
const updateFormData = (value) => {
  if (currentStep.value) {
    formData.value[currentStep.value.id] = value
  }
}
const handleStepComplete = (value) => {
  if (currentStep.value) {
    formData.value[currentStep.value.id] = value
  }
}
const openSlide = (slide) => {
  selectedSlide.value = slide
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
  selectedSlide.value = null
}
</script>

<template>
  <div class="worship-form-container">
    <!-- 사이드바 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>스크립트 이미지</h2>
      </div>
      <div class="slides-list">
        <div v-for="slide in slides" :key="slide.id" class="slide-item" @click="openSlide(slide)">
          <div class="slide-info">
            <p>{{ slide.title }}</p>
          </div>
          <div class="slide-preview">
            <div v-if="slide.imageUrl" class="image-preview">
              <img :src="slide.imageUrl" :alt="slide.title" />
            </div>
            <div v-else class="song-title-image">
              <p>{{ slide.song_title }}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
    <!-- 메인 콘텐츠 -->
    <main class="main-content">
      <div class="form-header">
        <button @click="downloadAssets" :disabled="isDownloading">Export</button>
      </div>
      <div class="form-container">
        <div class="form-content" v-if="currentStep">
          <FormProgress :current-step="currentStepIndex + 1" :total-steps="formSteps.length" />
          <div class="form-step-content">
            <FormStep
              v-if="currentStep"
              :step="currentStep"
              :value="formData[currentStep.id]"
              @update:value="updateFormData"
              @complete="handleStepComplete"
            />
            <FormNavigation
              :can-go-back="currentStepIndex > 0"
              :can-go-forward="hasCurrentStepData"
              @prev="previousStep"
              @next="nextStep"
            />
            <!-- <div class="debug-info" style="margin-top: 20px; padding: 10px; background: #f5f5f5">
              <p>현재 스텝: {{ currentStep?.id }}</p>
              <p>현재 데이터: {{ formData[currentStep?.id] }}</p>
              <p>다음 버튼 활성화: {{ hasCurrentStepData }}</p>
              <p>전체 데이터: {{ formData }}</p>
              <p>슬라이드 배열: {{ slides }}</p>
            </div> -->
          </div>
        </div>
      </div>
    </main>

    <SlideModal :show="showModal" :slide="selectedSlide" @close="closeModal" />
  </div>
</template>

<!-- 슬라이드바 영역 -->
<style scoped>
.worship-form-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}
.sidebar {
  width: 300px;
  background-color: #f3f4f6;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  height: 65px;
  text-align: center;
}
.sidebar-header h2 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}
.slides-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}
.slide-item {
  background-color: white;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.slide-item:hover {
  transform: translateY(-2px);
}
.song-title-image {
  background-color: black;
  height: 120px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
}
.song-title-image p {
  font-size: 16px;
}
.image-preview img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  background-color: black;
}
.slide-info {
  text-align: center;
}
.slide-info p {
  font-size: 16px;
  font-weight: bold;
  color: #6b7280;
  margin: 4px 0;
}
/* 메인 스타일 */
</style>
<!-- 메인 컨텐츠 영역 -->
<style scoped>
.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}
.form-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0.5rem 1rem;
  height: 65px;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
}
.form-container {
  flex: 1;
}
.form-content {
  width: 100%;
  height: 100%;
}
.form-step-content {
  min-height: 540px;
  box-sizing: border-box;
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
</style>
