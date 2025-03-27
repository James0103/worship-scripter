<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  slide: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['close'])

const currentVerseIndex = ref(0)

// slide가 변경될 때 currentVerseIndex 초기화
watch(
  () => props.slide,
  () => {
    currentVerseIndex.value = 0
  },
)

const nextVerse = () => {
  if (props.slide?.imageUrls && currentVerseIndex.value < props.slide.imageUrls.length - 1) {
    currentVerseIndex.value++
  }
}

const prevVerse = () => {
  if (currentVerseIndex.value > 0) {
    currentVerseIndex.value--
  }
}
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ slide.title || '' }}</h2>
        </div>
        <div class="modal-body">
          <div v-if="slide.type === 'hymn'" class="hymn-slides">
            <div class="verse-indicator" v-if="slide?.imageUrls?.length">
              {{ currentVerseIndex + 1 }} / {{ slide.imageUrls.length }}
            </div>
            <div class="verse-image">
              <button
                class="nav-button prev"
                @click="prevVerse"
                :disabled="currentVerseIndex === 0"
              >
                &lt;
              </button>
              <div class="slide-img-body">
                <img
                  :src="slide?.imageUrls?.[currentVerseIndex]"
                  :alt="`${slide?.title || ''} - ${currentVerseIndex + 1}절`"
                />
              </div>
              <button
                class="nav-button next"
                @click="nextVerse"
                :disabled="!slide?.imageUrls || currentVerseIndex === slide.imageUrls.length - 1"
              >
                &gt;
              </button>
            </div>
          </div>
          <div v-else class="text-slides">
            <div v-if="slide?.imageUrl" class="image-container">
              <img :src="slide.imageUrl" :alt="slide.title" />
            </div>
            <div v-else class="text-container">
              <p>{{ slide?.content }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="button" @click="$emit('close')">미리보기 닫기</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  padding: 16px;
  width: 90%;
  max-width: 1200px; /* 최대 너비 증가 */
  height: 90vh; /* 높이 설정 */
  position: relative;
  display: flex; /* Flexbox 사용 */
  flex-direction: column;
  overflow: hidden; /* 내용이 넘치지 않도록 */
}

.modal-header {
  padding: 1rem;
  height: 56px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* 내용이 넘치지 않도록 */
}
.hymn-slides {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 90%;
}
.verse-indicator {
  height: 24px;
}
.verse-image {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.slide-img-body {
  max-width: 80%;
  max-height: 80%;
  margin: 16px;
  object-fit: contain; /* 이미지 비율 유지 */
  background-color: black;
}
.slide-img-body img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 이미지 비율 유지 */
  background-color: black;
}
.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.image-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 이미지 비율 유지 */
  background-color: black;
}
.slide-image {
  margin-bottom: 1rem;
}
.placeholder-image {
  background-color: #e5e7eb;
  height: 70vh;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #6b7280;
}

.slide-details {
  padding: 1rem;
}

.modal-footer {
  height: 56px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 트랜지션 애니메이션 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
