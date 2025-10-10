export interface ChapterImage {
  image_page: number
  image_file: string
}

export interface ChapterItem {
  _id: string
  comic_name: string
  chapter_name: string
  chapter_title: string
  chapter_path: string
  chapter_image: ChapterImage[]
}

export interface ChapterData {
  domain_cdn: string
  item: ChapterItem
}

export interface ChapterResponse {
  status: 'success' | 'error'
  message: string
  data: ChapterData | null
}

export async function fetchChapterData(url: string): Promise<ChapterResponse> {
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } })

    if (!response.ok) {
      const text = await response.text()
      return {
        status: 'error',
        message: `Request failed: ${response.status} - ${text}`,
        data: null
      }
    }

    const data = (await response.json()) as ChapterData

    return {
      status: 'success',
      message: '',
      data
    }
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Unknown error',
      data: null
    }
  }
}
