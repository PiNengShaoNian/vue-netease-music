<template>
  <div class="playlist-detail" v-if="playlist.id">
    <DetailHeader :playlist="playlist" :songs="songs" />
    <div class="tabs-wrap">
      <Tabs :tabs="tabs" type="theme" v-model="activeTab" />
      <el-input
        :class="getInputCls()"
        @blur="onInputBlur"
        @focus="onInputFocus"
        class="input"
        placeholder="搜索歌单音乐"
        prefix-icon="el-icon-search"
        v-model="searchValue"
        v-show="activeTab === SONG_IDX"
      />
    </div>
    <div class="empty" v-if="searchValue && !filteredSongs.length">
      未能找到和
      <span class="keyword">”{{searchValue}}“</span>
      相关的任何音乐
    </div>
    <SongTable
      :highlightText="searchValue"
      :songs="filteredSongs"
      class="table"
      v-show="activeTab === SONG_IDX"
    />
    <div class="comments" v-show="activeTab === COMMENT_IDX">
      <Comments :id="id" @update="onCommentsUpdate" type="playlist" />
    </div>
  </div>
</template>

<script>
import DetailHeader from './header'
import SongTable from '@/components/song-table'
import Comments from '@/components/comments'
import { getListDetail, getSongDetail } from '@/api'
import { createSong } from '@/utils'

const SONG_IDX = 0
const MAX = 500
const COMMENT_IDX = 1

export default {
  components: {
    DetailHeader,
    SongTable,
    Comments
  },
  computed: {
    id() {
      return Number(this.$route.params.id)
    },
    filteredSongs() {
      return this.songs.filter(({ name, artistsText, albumName }) =>
        `${name}${artistsText}${albumName}`
          .toLowerCase()
          .includes(this.searchValue.toLowerCase())
      )
    }
  },
  data() {
    return {
      playlist: {},
      songs: [],
      inputFocus: false,
      searchValue: '',
      activeTab: SONG_IDX,
      tabs: ['歌曲列表', '评论']
    }
  },
  metaInfo() {
    return {
      title: this.playlist.name
    }
  },
  watch: {
    id: {
      handler() {
        this.searchValue = ''
        this.init()
      },
      immediate: true
    }
  },
  async created() {
    this.SONG_IDX = SONG_IDX
    this.COMMENT_IDX = COMMENT_IDX
  },
  methods: {
    async init() {
      const { playlist } = await getListDetail({ id: this.id })
      this.playlist = playlist
      this.genSonglist(playlist)
    },
    async genSonglist(playlist) {
      const trackIds = playlist.trackIds.map(({ id }) => id)
      const songDetails = await getSongDetail(trackIds.slice(0, MAX))
      const songs = songDetails.songs.map(({ id, name, al, ar, mv, dt }) =>
        createSong({
          id,
          name,
          artists: ar,
          duration: dt,
          mvId: mv,
          albumName: al.name,
          img: al.picUrl
        })
      )
      this.songs = songs
    },
    onCommentsUpdate({ total }) {
      this.tabs.splice(COMMENT_IDX, 1, `评论(${total})`)
    },
    getInputCls() {
      return !this.inputFocus ? 'inactive' : ''
    },
    onInputBlur() {
      this.inputFocus = false
    },
    onInputFocus() {
      this.inputFocus = true
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist-detail {
  width: 100%;

  .tabs-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 24px;
    border-bottom: 1px solid var(--border);

    .input {
      width: 125px;

      &:not(:hover) {
        &.inactive {
          /deep/.el-input__inner {
            background: transparent !important;
          }
        }
      }
    }
  }

  .empty {
    @include flex-center;
    height: 200px;

    .keyword {
      color: $blue;
    }
  }

  .comments {
    padding: 16px 32px;
  }
}
</style>
