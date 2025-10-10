import { ResponseData, BaseData } from '../common/response'
import { request } from '@/utils/request'
import { otruyen } from '@/utils/env'
import { queryOptions } from '@tanstack/react-query'
import { Category } from '../common/type'

interface ChapterLatest {
  filename: string
  chapter_name: string
  chapter_title: string
  chapter_api_data: string
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
  titleHead: string
  descriptionHead: string
  og_type: string
  og_image: string[]
}

// map với tất cả đống ở trên
export interface ItemsResponseData extends BaseData {
  seoOnPage: SeoOnPage
  params: Params
  items: Item[]
  breadCrumb: string[]
}

type GetListByCategoryeRequest = {
  page: number
  slug: string
}

// Available values : Category
export const getListByCategory = ({ page = 1, slug }: GetListByCategoryeRequest) => {
  return queryOptions({
    queryKey: ['get-list-by-category', page, slug],
    queryFn: () =>
      request<ResponseData<ItemsResponseData>>(
        `v1/api/the-loai/${slug}`,
        'GET',
        {
          page: page
        },
        {},
        otruyen
      )
  })
}
