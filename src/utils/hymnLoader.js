export async function loadHymnLyrics(id) {
  try {
    const response = await fetch(`/src/data/${id}.json`)
    const data = await response.json()
    return data['lyrics']
  } catch (error) {
    console.error(`찬송가 ${id} 로드 실패:`, error)
    return null
  }
}
