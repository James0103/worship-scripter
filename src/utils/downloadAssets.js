import JSZip from 'jszip'
import PptxGenJS from 'pptxgenjs'
import { saveAs } from 'file-saver'

// Base64 이미지 URL을 Blob으로 변환
async function base64ToBlob(base64Url) {
  const response = await fetch(base64Url)
  const blob = await response.blob()
  return blob
}

// PNG 이미지들을 ZIP 파일로 압축
export async function downloadImagesAsZip(slides) {
  const zip = new JSZip()
  const imgFolder = zip.folder('worship_slides')

  // 모든 슬라이드의 이미지를 처리
  const promises = slides.flatMap((slide, index) => {
    // console.log(slide)
    if (slide.type === 'hymn') {
      return slide.imageUrls.map(async (imageUrl, verseIndex) => {
        const blob = await base64ToBlob(imageUrl)
        const fileName = `${String(index + 1).padStart(2, '0')}_${slide.title}_${verseIndex + 1}.png`
        // console.log(fileName)
        imgFolder.file(fileName, blob)
      })
    } else {
      return [
        async () => {
          // console.log('일반 슬라이드 in async')
          if (slide.imageUrl) {
            // imageUrl이 있는지 확인
            const blob = await base64ToBlob(slide.imageUrl)
            const fileName = `${String(index + 1).padStart(2, '0')}_${slide.title}.png`
            // console.log(fileName)
            imgFolder.file(fileName, blob)
          }
        },
      ]
    }
  })

  await Promise.all(promises.map((p) => (typeof p === 'function' ? p() : p)))

  // ZIP 파일 생성 및 다운로드
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'worship_slides.zip')
}

// 이미지들로 PPT 생성
export async function downloadImagesAsPPT(slides) {
  const pptx = new PptxGenJS()

  // PPT 기본 설정
  pptx.layout = 'LAYOUT_16x9'
  pptx.author = 'Worship Scripter'

  // 모든 슬라이드의 이미지를 처리
  for (const slide of slides) {
    if (slide.type === 'hymn') {
      // 찬송가의 경우 여러 이미지 처리
      for (const imageUrl of slide.imageUrls) {
        const pptSlide = pptx.addSlide()
        pptSlide.background = { color: '000000' } // 검은 배경

        // 이미지를 슬라이드에 추가
        pptSlide.addImage({
          data: imageUrl,
          x: 0,
          y: 0,
          w: '100%',
          h: '100%',
        })
      }
    } else {
      const pptSlide = pptx.addSlide()
      pptSlide.background = { color: '000000' } // 검은 배경

      pptSlide.addImage({
        data: slide.imageUrl,
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
      })
    }
  }

  // PPT 파일 다운로드
  pptx.writeFile({ fileName: 'worship_slides.pptx' })
}
