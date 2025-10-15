import { ResponseData, BaseData } from '../common/response'
import { request } from '@/utils/request'
import { otruyen } from '@/utils/env'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Category, Chapter } from '../common/type'

export interface ChapterLatest {
  filename: string
  chapter_name: string
  chapter_title: string
  chapter_api_data: string
}

type Chapters = {
  server_name: string
  server_data: Chapter[]
}

export interface Item {
  _id: string
  name: string
  slug: string
  origin_name: string[]
  status: string
  thumb_url: string
  sub_docquyen: boolean
  category: Category[]
  chapters: Chapters[]
  updatedAt: string // ISO date
  chaptersLatest: ChapterLatest[]
}

export interface ItemsResponse {
  items: Item[]
}

type Pagination = {
  totalItems: number
  totalItemsPerPage: number
  currentPage: number
  pageRanges: number
}

type Params = {
  type_slug: string
  filterCategory: string[]
  sortField: string
  pagination: Pagination
  itemsUpdateInDay: number
}

type SeoOnPage = {
  og_type: string
  titleHead: string
  descriptionHead: string
  og_image: string[]
  og_url: string
}

// map với tất cả đống ở trên
export interface ItemsResponseData extends BaseData {
  seoOnPage: SeoOnPage
  params: Params
  items: Item[]
  breadCrumb: string[]
  titlePage: string
}

export const fetchListByKeyword = async (page: number, keyword: string, limit: number) => {
  const res = await request<ResponseData<ItemsResponseData>>(
    `v1/api/tim-kiem`,
    'GET',
    { page, keyword, limit: 20 },
    {},
    otruyen
  )
  return res
}

type SearchRequest = {
  keyword: string
  limit?: number
}

export function useInfiniteKeywordList({ keyword: keyword, limit = 20 }: SearchRequest) {
  return useInfiniteQuery({
    queryKey: ['get-list-by-keyword', keyword],
    queryFn: ({ pageParam }) => fetchListByKeyword(pageParam, keyword, limit),
    getNextPageParam: lastPage => {
      const pagination = lastPage.data.params.pagination
      if (pagination.currentPage < pagination.pageRanges) {
        return pagination.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: keyword?.trim().length > 0
  })
}
