import { request } from '@/utils'

export const getSongUrl = id => request.get(`/song/url?id=${id}`)
