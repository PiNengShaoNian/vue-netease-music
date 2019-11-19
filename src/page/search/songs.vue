<template>
  <div class="search-songs">
    <WithPagination
      :getData="getSearch"
      :getDataParams="searchParams"
      :limit="30"
      :scrollTarget="searchRoot.$refs && searchRoot.$refs.header"
      :total="songCount"
      @getDataSuccess="onGetSearch"
    >
      <div class="table">
        <SongTable
          :highlightText="keywords"
          :renderNameDesc="renderNameDesc"
          :songs="songs"
          :stripe="true"
        />
      </div>
    </WithPagination>
  </div>
</template>

<script>
import { getSearch } from '@/api'
import SongTable from '@/components/song-table'
import WithPagination from '@/components/with-pagination'
import { createSong } from '@/utils'

export default {
  inject: ['searchRoot'],
  components: {
    SongTable,
    WithPagination
  },
  created() {
    this.getSearch = getSearch
  },
  data() {
    return {
      songs: [],
      songCount: 0,
      currentPage: 1
    }
  },
  computed: {
    keywords() {
      return this.searchRoot.keywords
    },
    searchParams() {
      return { keywords: this.keywords }
    }
  },
  methods: {
    renderNameDesc(scope) {
      const { alias } = scope.row
      return alias.map(desc => (
        <HighlightText class="name-desc" text={desc} highlightText={this.keywords} />
      ))
    },
    onGetSearch(result) {
      const {
        result: { songs, songCount }
      } = result
      this.songs = songs.map(song => {
        const { id, mvid, name, alias, artists, duration, album } = song
        return createSong({
          id,
          name,
          alias,
          artists,
          duration,
          mvId: mvid,
          albumName: album.name,
          albumId: album.id
        })
      })

      this.songCount = songCount
      this.searchRoot.onUpdateCount(songCount)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-songs {
  .table {
    .name-desc {
      display: block;
      margin-top: 8px;
      color: var(--font-color-grey-shallow);
      @include text-ellipsis;
    }
  }

  .pagination {
    margin-top: 16px;
    text-align: right;
  }
}
</style>
