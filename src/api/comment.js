import { requestWithoutLoading } from '@/utils'

export const getSongComment = params =>
  requestWithoutLoading.get(`/comment/music`, { params })
export const getPlaylistComment = params =>
  requestWithoutLoading('/comment/playlist', { params })
export const getHotComment = params =>
  requestWithoutLoading('/comment/hot', { params })
export const getMvComment = params =>
  requestWithoutLoading('/comment/mv', { params })
