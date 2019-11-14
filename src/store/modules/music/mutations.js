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
  setPlayHistory(state, history) {
    state.playHistory = history
  },
  setCurrentTime(state, time) {
    state.currentTime = time
  }
}
