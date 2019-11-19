import { request, requestWithoutLoading } from '@/utils'

export const getTopPlaylists = params =>
  request.get('/top/playlist/highquality', { params })

export const getPlaylists = params => request.get('/top/playlist', { params })

export const getSimiPlaylists = (id, option) =>
  requestWithoutLoading.get(`/simi/playlist?id=${id}`, option)
