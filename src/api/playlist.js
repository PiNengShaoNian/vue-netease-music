import { request } from '@/utils'

export const getTopPlaylists = params =>
  request.get('/top/playlist/highquality', { params })

export const getPlaylists = params => request.get('/top/playlist', { params })
