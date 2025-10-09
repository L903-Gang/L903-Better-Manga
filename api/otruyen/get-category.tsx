import { ResponseData, BaseData } from './common/response'
import { request } from '@/utils/request'
import { otruyen } from '@/utils/env'
import { queryOptions } from '@tanstack/react-query'
import { Category } from './common/type'

type Item = {
  data: Category[]
}

export interface ItemsResponseData extends BaseData {
  items: Item[]
}

export const getCategory = () => {
  return queryOptions({
    queryKey: ['get-category'],
    queryFn: () => request<ResponseData<ItemsResponseData>>(`v1/api/the-loai`, 'GET', {}, {}, otruyen)
  })
}
