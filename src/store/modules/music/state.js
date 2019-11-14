import storage from 'good-storage'
import { PLAY_HISTORY_KEY } from '@/utils'
// import { playModeMap } from '@/utils/config'

export default {
  isPlayerShow: false,
  playlist: [],
  isMenuShow: true,
  currentSong: {},
  playing: false,
  playHistory: storage.get(PLAY_HISTORY_KEY, []),
  currentTime: 0
}
