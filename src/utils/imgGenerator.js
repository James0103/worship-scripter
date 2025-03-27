export async function generateSlideImage(content, options = {}) {
  const {
    width = 1920,
    height = 1080,
    backgroundColor = null,
    textColor = '#FFFFFF',
    fontSize = '64px',
    fontFamily = 'Arial',
    padding = 40,
    bottomMargin = 40,
  } = options

  // Canvas 생성
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // 배경 설정
  ctx.clearRect(0, 0, width, height)
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
  }

  // 텍스트 스타일 설정
  ctx.fillStyle = textColor
  ctx.font = `${fontSize} ${fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'

  // // 텍스트 줄바꿈 처리
  // const words = content.split(' ')
  // let lines = []
  // let currentLine = words[0]

  // for (let i = 1; i < words.length; i++) {
  //   const word = words[i]
  //   const width = ctx.measureText(currentLine + ' ' + word).width
  //   if (width < canvas.width - padding * 2) {
  //     currentLine += ' ' + word
  //   } else {
  //     lines.push(currentLine)
  //     currentLine = word
  //   }
  // }
  // lines.push(currentLine)
  // 먼저 \n으로 줄바꿈을 분리
  const paragraphs = content.split('\n')
  let lines = []

  // 각 문단에 대해 너비에 따른 줄바꿈 처리
  paragraphs.forEach((paragraph) => {
    const words = paragraph.split(' ')
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const testLine = currentLine + ' ' + word
      const testWidth = ctx.measureText(testLine).width

      if (testWidth < canvas.width - padding * 2) {
        currentLine = testLine
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)
  })

  // 텍스트 그리기
  const lineHeight = parseInt(fontSize) * 1.5
  // const totalHeight = lines.length * lineHeight
  // const startY = (height - totalHeight) / 2

  lines.forEach((line, index) => {
    // ctx.fillText(line, width / 2, startY + index * lineHeight)
    ctx.fillText(
      line,
      width / 2, // 가로 중앙
      height - bottomMargin + (index - lines.length) * lineHeight, // 하단 기준 위치
    )
  })

  // Canvas를 이미지로 변환
  return canvas.toDataURL('image/png')
}
