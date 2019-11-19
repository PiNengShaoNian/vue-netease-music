<template>
  <div id="app">
    <Layout />
    <Player />
    <MiniPlayer />
    <Playlist />
    <ShareReader />
  </div>
</template>

<script>
import Layout from '@/layout'
import Player from '@/components/player'
import MiniPlayer from '@/components/mini-player'
import Playlist from '@/components/playlist'
import ShareReader from '@/components/share-reader'

export default {
  metaInfo() {
    return {
      title: '欢迎来到sshPlayer'
    }
  },
  components: { Layout, Player, MiniPlayer, Playlist, ShareReader }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  background-color: var(--body-bgcolor);
  font-size: $font-size;
}
</style>
