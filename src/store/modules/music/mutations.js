import { shallowEqual } from '@/utils'

export default {
  setPlayerShow(state, show) {
    state.isPlayerShow = show
  },
  setCurrentSong(state, song) {
    state.currentSong = song
  },
  setPlayingState(state, playing) {
    state.playing = playing
  },
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  setPlayHistory(state, history) {
    state.playHistory = history
  },
  setCurrentTime(state, time) {
    state.currentTime = time
  },
  setPlaylist(state, playlist) {
    const { isPlaylistShow, playlist: oldPlaylist } = state

    state.playlist = playlist
    if (!isPlaylistShow && !shallowEqual(oldPlaylist, playlist, 'id')) {
      state.isPlaylistPromptShow = true
      setTimeout(() => {
        state.isPlaylistPromptShow = false
      }, 2000)
    }
  },
  setMenuShow(state, show) {
    state.isMenuShow = show
  },
  setPlaylistShow(state, show) {
    state.isPlaylistShow = show
  }
}
