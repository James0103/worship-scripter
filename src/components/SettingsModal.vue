<template>
  <div class="modal-content" @click.stop>
    <div class="modal-header">
      <h2 class="modal-title">스크립트 설정</h2>
    </div>

    <div class="modal-body">
      <div class="setting-group">
        <h3>폰트 설정</h3>
        <div class="setting-item">
          <label for="fontFamily">폰트</label>
          <select id="fontFamily" v-model="settings.fontFamily">
            <option value="Noto Sans KR">Noto Sans KR</option>
            <option value="Nanum Gothic">나눔고딕</option>
            <option value="Nanum Myeongjo">나눔명조</option>
          </select>
        </div>
        <div class="setting-item">
          <label for="fontSize">폰트 크기</label>
          <input type="number" id="fontSize" v-model="settings.fontSize" min="12" max="72" />
        </div>
      </div>

      <div class="setting-group">
        <h3>색상 설정</h3>
        <div class="setting-item">
          <label for="textColor">텍스트 색상</label>
          <div class="color-picker">
            <input type="color" id="textColor" v-model="settings.textColor" />
          </div>
        </div>
      </div>

      <div class="setting-group">
        <h3>출력 설정</h3>
        <div class="setting-item">
          <label for="fontFamily">형식</label>
          <select id="fontFamily" v-model="settings.exportMethod">
            <option value="png">이미지로 출력(png)</option>
            <option value="ppt">ppt 파일 출력</option>
            <option value="both">이미지, ppt 파일 동시 출력</option>
          </select>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="save-button" @click="saveSettings">저장</button>
      <button class="cancel-button" @click="closeModal">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['update:modelValue', 'save'])

const settings = ref({
  fontFamily: 'Noto Sans KR',
  fontSize: 48,
  textColor: '#000000',
  backgroundColor: '#FFFFFF',
  exportMethod: 'png',
})

const closeModal = () => {
  emit('update:modelValue', false)
}

const saveSettings = () => {
  emit('save', settings.value)
  closeModal()
}
</script>

<style scoped>
.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.modal-body {
  padding: 1rem;
}

.setting-group {
  margin-bottom: 1.5rem;
}

.setting-group h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #374151;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.setting-item label {
  flex: 1;
  margin-right: 1rem;
}

.setting-item input,
.setting-item select {
  flex: 2;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}
.color-picker {
  width: 36px;
}
#textColor {
  padding: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.save-button,
.cancel-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.cancel-button {
  background-color: #e5e7eb;
  border: none;
}

.save-button:hover {
  background-color: #2563eb;
}

.cancel-button:hover {
  background-color: #d1d5db;
}
</style>
