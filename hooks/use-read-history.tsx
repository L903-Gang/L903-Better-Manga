import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'read_history'

export interface ReadHistory {
  slug: string
  name: string
  image?: string
  chapterName?: string
  chapterApi?: string
  updatedAt: string
}

// lấy ra
export const getReadHistory = async (): Promise<ReadHistory[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY)
    const data: ReadHistory[] = json ? JSON.parse(json) : []

    // Sort theo thời gian giảm dần (mới nhất trước)
    const sorted = data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return sorted
  } catch (e) {
    console.error('Lỗi khi đọc lịch sử:', e)
    return []
  }
}

const saveReadHistory = async (list: ReadHistory[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.error('Lỗi khi lưu lịch sử:', e)
  }
}

export const addOrUpdateHistory = async (item: Omit<ReadHistory, 'updatedAt'>): Promise<void> => {
  const { slug } = item
  if (!slug) return

  const history = await getReadHistory()
  const existingIndex = history.findIndex(h => h.slug === slug)
  const updatedAt = new Date().toISOString()

  if (existingIndex !== -1) {
    // Cập nhật truyện đã có
    history[existingIndex] = {
      ...history[existingIndex],
      ...item,
      updatedAt
    }
  } else {
    // Thêm mới
    history.unshift({ ...item, updatedAt })
  }

  // Giới hạn 50 cái
  const trimmed = history.slice(0, 50)
  await saveReadHistory(trimmed)
}

export const updateChapterInfoIfExists = async (
  slug: string,
  chapterName: string,
  chapterApi: string
): Promise<void> => {
  if (!slug) return

  const history = await getReadHistory()
  const existingIndex = history.findIndex(h => h.slug === slug)
  if (existingIndex === -1) return // Không có thì bỏ qua

  const updatedAt = new Date().toISOString()

  history[existingIndex] = {
    ...history[existingIndex],
    chapterName,
    chapterApi,
    updatedAt
  }

  await saveReadHistory(history)
}

export const removeHistoryItem = async (slug: string) => {
  const history = await getReadHistory()
  const filtered = history.filter(h => h.slug !== slug)
  await saveReadHistory(filtered)
}
