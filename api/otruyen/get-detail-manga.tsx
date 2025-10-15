import { ResponseData, BaseData } from './common/response'
import { request } from '@/utils/request'
import { otruyen } from '@/utils/env'
import { queryOptions } from '@tanstack/react-query'
import { Category, Chapter } from './common/type'

type Chapters = {
  server_name: string
  server_data: Chapter[]
}

export interface Item {
  _id: string
  name: string
  slug: string
  origin_name: string[]
  content: string
  status: string
  thumb_url: string
  sub_docquyen: boolean
  author: string
  category: Category[]
  chapters: Chapters[]
  updatedAt: string // ISO date
}

export interface ItemsResponse {
  items: Item[]
}

type Params = {
  slug: string
  crawl_check_url: string
}

type SeoSchema = {
  // "@context": string,
  // "@type": string,
  name: string
  url: string
  image: string
  director: string
}

type SeoOnPage = {
  og_type: string
  titleHead: string
  descriptionHead: string
  seoSchema: SeoSchema
}

type GetDetailMangaRequest = {
  slug: string
}

export interface MangaResponseData extends BaseData {
  seoOnPage: SeoOnPage
  params: Params
  item: Item
  breadCrumb: string[]
}
export const getDetailManga = ({ slug }: GetDetailMangaRequest) => {
  return queryOptions({
    queryKey: ['get-detail-manga', slug],
    queryFn: () => request<ResponseData<MangaResponseData>>(`v1/api/truyen-tranh/${slug}`, 'GET', {}, {}, otruyen),
    staleTime: 0
  })
}
