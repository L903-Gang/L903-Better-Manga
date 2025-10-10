export type Category = {
  id: string
  name: string
  slug: string
}

export type Chapter = {
  filename: string
  chapter_name: string
  chapter_title: string
  chapter_api_data: string
}

export interface Manga {
  _id: string
  name: string
  slug: string
  origin_name: string[]
  status: string
  thumb_url: string
  sub_docquyen: boolean
  category: Category[]
  updatedAt: string // ISO date
  chaptersLatest: ChapterLatest[]
}

export interface ChapterLatest {
  filename: string
  chapter_name: string
  chapter_title: string
  chapter_api_data: string
}
