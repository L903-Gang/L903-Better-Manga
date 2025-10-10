import { ResponseData, BaseData } from '../common/response'
import { request } from '@/utils/request'
import { otruyen } from '@/utils/env'
import { queryOptions } from '@tanstack/react-query'
import { Category } from '../common/type'

export interface ChapterLatest {
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

type GetListByTypeRequest = {
  page: number
  type: string
  limit?: number
}

// Available values : truyen-moi, sap-ra-mat, dang-phat-hanh, hoan-thanh
// Default value : truyen-moi

export const getListByType = ({ page = 1, type, limit = 4 }: GetListByTypeRequest) => {
  return queryOptions({
    queryKey: ['get-list-by-type', page, type],
    queryFn: () =>
      request<ResponseData<ItemsResponseData>>(
        `v1/api/danh-sach/${type}`,
        'GET',
        {
          page: page,
          limit: limit
        },
        {},
        otruyen
      )
  })
}
