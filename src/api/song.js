import { request } from '@/utils'

export const getSongUrl = id => request.get(`/song/url?id=${id}`)

export const getSongDetail = ids => request.get(`/song/detail/?ids=${ids}`)

export const getTopSongs = type => request.get(`/top/song?type=${type}`)
