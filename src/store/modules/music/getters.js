import { playModeMap } from '@/utils/config'

const getRandomIndex = (playlist, currentIndex) => {
  if (playlist.length === 1) {
    return currentIndex
  }
  let index = Math.round(Math.random() * (playlist.length - 1))
  if (index === currentIndex) {
    index = getRandomIndex(playlist, currentIndex)
  }

  return index
}

export const currentIndex = state => {
  const { currentSong, playlist } = state
  return playlist.findIndex(({ id }) => id === currentSong.id)
}

export const nextSong = (state, getters) => {
  const { playlist, playMode } = state
  const getSequenceNextIndex = () => {
    let nextIndex = getters.currentIndex + 1
    if (nextIndex > playlist.length - 1) {
      nextIndex = 0
    }
    return nextIndex
  }

  const getLoopNextIndex = () => {
    return getters.currentIndex
  }

  const getRandomNextIndex = () => {
    return getRandomIndex(playlist, getters.currentIndex)
  }

  const nextStratMap = {
    [playModeMap.sequence.code]: getSequenceNextIndex,
    [playModeMap.loop.code]: getLoopNextIndex,
    [playModeMap.random.code]: getRandomNextIndex
  }
  const getNextStrat = nextStratMap[playMode]
  const index = getNextStrat()
  return playlist[index]
}

export const prevSong = (state, getters) => {
  const { playlist, playMode } = state
  const getSequencePrevIndex = () => {
    let prevIndex = getters.currentIndex - 1
    if (prevIndex < 0) {
      prevIndex = playlist.length - 1
    }
    return prevIndex
  }
  const getLoopPrevIndex = () => {
    return getters.currentIndex
  }
  const getRandomPrevIndex = () => {
    return getRandomIndex(playlist, getters.currentIndex)
  }
  const prevStratMap = {
    [playModeMap.sequence.code]: getSequencePrevIndex,
    [playModeMap.loop.code]: getLoopPrevIndex,
    [playModeMap.random.code]: getRandomPrevIndex
  }

  const getPrevStrat = prevStratMap[playMode]
  const index = getPrevStrat()
  return playlist[index]
}
