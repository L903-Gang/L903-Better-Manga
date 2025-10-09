export interface BaseData {
  seoOnPage: unknown 
  breadCrumb: unknown
  params: unknown
  items: unknown
  APP_DOMAIN_CDN_IMAGE: string
  APP_DOMAIN_FRONTEND: string
  [key: string]: any 
}

// generic
export type ResponseData<T extends BaseData = BaseData> = {
  status: string
  message: string
  data: T
}
