export const currentIndex = state => {
  const { currentSong, playlist } = state
  return playlist.findIndex(({ id }) => id === currentSong.id)
}
