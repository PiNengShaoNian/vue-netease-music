import axios from 'axios'
import { Loading } from 'element-ui'
import { confirm } from '@/base/confirm'
import store from '@/store'

const BASE_URL = '/netease-api'
const SET_AXIOS_LOADING = 'global/setAxiosLoading'
let loading
let loadingCount = 0
const handleError = e => {
  confirm(e.message, '出错啦')
}

const handleResponse = response => {
  return response.data
}

const createBaseInstance = () => {
  const instance = axios.create({
    baseURL: BASE_URL
  })

  instance.interceptors.response.use(handleResponse, handleError)
  return instance
}

const mixinLoading = interceptors => {
  const loadingRequestInterceptor = config => {
    if (!loading) {
      loading = Loading.service({
        target: 'body',
        background: 'transparent',
        text: '载入中'
      })
      store.commit(SET_AXIOS_LOADING, true)
    }
    loadingCount++

    return config
  }
  const handleResponseLoading = () => {
    loadingCount--
    if (loadingCount === 0) {
      loading.close()
      loading = null
      store.commit(SET_AXIOS_LOADING, false)
    }
  }

  const loadingResponseInterceptor = response => {
    handleResponseLoading()
    return response
  }

  const loadingResponseErrorInterceptor = e => {
    handleResponseLoading()
    throw e
  }
  interceptors.request.use(loadingRequestInterceptor)
  interceptors.response.use(
    loadingResponseInterceptor,
    loadingResponseErrorInterceptor
  )
}

export const requestWithoutLoading = createBaseInstance()
export const request = createBaseInstance()
mixinLoading(request.interceptors)
