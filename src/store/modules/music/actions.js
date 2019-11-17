import { PLAY_HISTORY_KEY, notify, getSongImg } from '@/utils'
import { getSongUrl } from '@/api'
import storage from 'good-storage'

async function checkCanPlay(id) {
  const { data } = await getSongUrl(id)
  const [resultSong] = data
  return !!resultSong.url
}

export default {
  async startSong({ commit, state, dispatch }, rawSong) {
    const song = Object.assign({}, rawSong)
    if (!song.img) {
      if (song.albumId) {
        song.img = await getSongImg(song.id, song.albumId)
      }
    }

    commit('setCurrentSong', song)
    commit('setPlayingState', true)

    const { playHistory } = state
    const playHistoryCopy = playHistory.slice()
    const findedIndex = playHistoryCopy.findIndex(({ id }) => song.id === id)
    if (findedIndex !== -1) {
      playHistoryCopy.splice(findedIndex, 1)
    }
    playHistoryCopy.unshift(song)
    commit('setPlayHistory', playHistoryCopy)
    storage.set(PLAY_HISTORY_KEY, playHistoryCopy)

    const canPlay = await checkCanPlay(song.id)
    if (!canPlay) {
      notify(`${song.name}播放失败`)
      dispatch('clearCurrentSong')
    }
  },
  clearCurrentSong({ commit }) {
    commit('setCurrentSong', {})
    commit('setPlayingState', false)
    commit('setCurrentTime', 0)
  }
}