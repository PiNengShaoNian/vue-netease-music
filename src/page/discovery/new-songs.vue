<template>
  <div class="new-songs" v-if="list.length">
    <Title>最新音乐</Title>

    <div class="list-wrap">
      <div class="list" :key="listIndex" v-for="(list, listIndex) in thunkedList">
        <SongCard
          :key="item.id"
          :order="getSongOrder(listIndex, index)"
          @click.native="onClickSong(listIndex, index)"
          class="song-card"
          v-bind="nomalizeSong(item)"
          v-for="(item, index) in list"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from '@/store/helper/music'
import { getNewSongs } from '@/api'
import { createSong } from '@/utils'
import SongCard from '@/components/song-card'
const songLimit = 10

export default {
  components: {
    SongCard
  },
  data() {
    return {
      chunkLimit: Math.ceil(songLimit / 2),
      list: []
    }
  },
  computed: {
    nomalizedSongs() {
      return this.list.map(song => this.nomalizeSong(song))
    },
    thunkedList() {
      return [
        this.list.slice(0, this.chunkLimit),
        this.list.slice(this.chunkLimit, this.list.length)
      ]
    }
  },
  async created() {
    const { result } = await getNewSongs()
    this.list = result
  },
  methods: {
    getSongOrder(listIndex, index) {
      return listIndex * this.chunkLimit + index + 1
    },
    nomalizeSong(song) {
      const {
        id,
        name,
        song: {
          mvid,
          artists,
          album: { blurPicUrl },
          duration
        }
      } = song
      return createSong({
        id,
        name,
        img: blurPicUrl,
        artists,
        duration,
        mvId: mvid
      })
    },
    onClickSong(listIndex, index) {
      const nomalizedSongIndex = this.getSongOrder(listIndex, index) - 1
      const nomalizedSong = this.nomalizedSongs[nomalizedSongIndex]
      this.startSong(nomalizedSong)
      this.setPlaylist(this.nomalizedSongs)
    },
    ...mapMutations(['setPlaylist']),
    ...mapActions(['startSong'])
  }
}
</script>

<style lang="scss" scoped>
.new-songs {
  margin-bottom: 36px;
  .list-wrap {
    display: flex;

    .list {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>