<script setup>
import { useRouter } from 'vue-router'
import SettingsModal from '../components/SettingsModal.vue'

const router = useRouter()

const navigateToForm = (type) => {
  if (type === 'custom') {
    router.push('/custom')
  } else {
    router.push({
      path: '/worship-form',
      query: { type },
    })
  }
}
</script>

<template>
  <div class="main-page flex three center">
    <div>
      <span>
        <button class="main-page-button worship" @click="navigateToForm('wednesday')">
          <h2>수요예배</h2>
          <p class="main-page-button-description">기도 - 찬송 - 설교 - 본문 - 제목</p>
        </button>
      </span>
    </div>
    <div>
      <span>
        <button class="main-page-button worship" @click="navigateToForm('sunday')">
          <h2>주일예배</h2>
          <p class="main-page-button-description">
            경배 찬양 - 예배부름 - 송영 - 신앙고백 - 찬양 - 기도 - 찬양 - 봉헌 - 교회소식 - 성경봉독
            - 말씀 - 찬양 - 축도
          </p>
        </button>
      </span>
    </div>
    <div>
      <span>
        <button class="main-page-button worship">
          <h2>순서생성</h2>
          <p class="main-page-button-description">찬양 순서를 직접 지정해서 만들수 있어요</p>
        </button>
      </span>
    </div>
    <div class="full">
      <span>
        <label for="setting_modal" class="button main-page-button setting warning">
          스크립트 설정
        </label>
      </span>
    </div>
    <!-- modal -->
    <div class="modal">
      <input id="setting_modal" type="checkbox" />
      <label for="setting_modal" class="overlay"></label>
      <article>
        <SettingsModal />
      </article>
    </div>
  </div>
</template>

<style scoped>
.main-page {
  width: 100%;
  height: 100%;
  padding: 15rem 10rem;
}
.main-page-button {
  width: 100%;
  height: 100%;
}
.main-page-button.worship {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 48px;
}
.main-page-button.setting {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.main-page-button-description {
  font-size: 14px;
}
article {
  min-width: 720px;
}
</style>
