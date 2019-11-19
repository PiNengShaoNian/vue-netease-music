<template>
  <transition name="slide">
    <div class="player" :class="getPlayerShowCls()">
      <div class="content">
        <div class="song">
          <div class="left">
            <img
              src="@/assets/image/play-bar-support.png"
              alt
              class="play-bar-support"
            />
            <img
              src="@/assets/image/play-bar.png"
              :class="{ playing }"
              class="play-bar"
              alt
            />
            <div class="img-outer-border" ref="disc">
              <div
                class="img-outer"
                :class="{ paused: !playing }"
                ref="discRotate"
              >
                <div class="img-wrap">
                  <img :src="$utils.genImgUrl(currentSong.img, 400)" alt />
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="name-wrap">
              <p class="name">{{ currentSong.name }}</p>
              <span @click="onGoMv" class="mv-tag" v-if="currentSong.mvId"
                >MV</span
              >
            </div>
            <div class="desc">
              <div class="desc-item">
                <span class="label">歌手：</span>
                <div class="value">{{ currentSong.artistsText }}</div>
              </div>
            </div>
            <empty v-if="nolyric">还没有歌词喔~</empty>
            <Scroller
              :data="lyric"
              :options="{ disableTouch: true }"
              @init="onInitScroller"
              class="lyric-wrap"
              ref="scroller"
              v-else
            >
              <div>
                <div
                  class="lyric-item"
                  :class="getActiveCls(index)"
                  :key="index"
                  ref="lyric"
                  v-for="(l, index) in lyricWithTranslation"
                >
                  <p
                    class="lyric-text"
                    :key="contentIndex"
                    v-for="(content, contentIndex) in l.contents"
                  >
                    {{ content }}
                  </p>
                </div>
              </div>
            </Scroller>
          </div>
        </div>
        <div class="bottom">
          <div class="left">
            <Comments
              :id="currentSong.id"
              ref="comments"
              v-if="currentSong.id"
            />
          </div>
          <div class="right" v-if="simiPlaylists.concat(simiSongs).length">
            <Loading :loading="simiLoading" v-if="simiLoading" />
            <div v-else>
              <div class="simi-playlists" v-if="simiPlaylists.length">
                <p class="title">包含这首歌的歌单</p>
                <div
                  class="simi-item"
                  :key="simiPlaylist.id"
                  v-for="simiPlaylist in simiPlaylists"
                >
                  <Card
                    :img="simiPlaylist.coverImgUrl"
                    :name="simiPlaylist.name"
                    @click="onClickPlaylist(simiPlaylist.id)"
                  >
                    <template v-slot:desc>
                      <div class="desc">
                        <Icon :size="12" color="shallow" type="play" />
                        <p class="count">
                          {{ $utils.formatNumber(simiPlaylist.playCount) }}
                        </p>
                      </div>
                    </template>
                  </Card>
                </div>
              </div>
              <div class="simi-songs" v-if="simiSongs.length">
                <p class="title">相似歌曲</p>
                <div
                  class="simi-item"
                  :key="simiSong.id"
                  v-for="simiSong in simiSongs"
                >
                  <Card
                    :desc="simiSong.artistsText"
                    :img="simiSong.img"
                    :name="simiSong.name"
                    @click="onClickSong(simiSong)"
                  >
                    <template v-slot:img-mask>
                      <PlayIcon class="play-icon" />
                    </template>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapActions, mapMutations } from '@/store/helper/music'
import { isDef, goMvWithCheck, createSong, debounce } from '@/utils'
import { getLyric, getSimiPlaylists, getSimiSongs } from '@/api'
import lyricParser from '@/utils/lrcparse'
import Comments from '@/components/comments'
const WHEEL_TYPE = 'wheel'
const SCROLL_TYPE = 'scroll'
const AUTO_SCROLL_RECOVER_TIME = 1000

export default {
  components: {
    Comments
  },
  created() {
    this.lyricScrolling = {
      [WHEEL_TYPE]: false,
      [SCROLL_TYPE]: false
    }
    this.lyricTimer = {
      [WHEEL_TYPE]: null,
      [SCROLL_TYPE]: null
    }
  },
  data() {
    return {
      nolyric: false,
      lyric: [],
      simiLoading: false,
      simiPlaylists: [],
      simiSongs: []
    }
  },
  computed: {
    lyricWithTranslation() {
      let ret = []
      const lyricFiltered = this.lyric.filter(({ content }) => Boolean(content))
      if (lyricFiltered.length) {
        lyricFiltered.forEach(l => {
          const { time, content } = l
          const lyricItem = { time, content, contents: [content] }
          const sameTimeLyric = this.tlyric.find(
            ({ time: tLyricTime }) => tLyricTime === time
          )

          if (sameTimeLyric) {
            const { content: tLyricContent } = sameTimeLyric
            if (content) {
              lyricItem.contents.push(tLyricContent)
            }
          }
          ret.push(lyricItem)
        })
      } else {
        ret = lyricFiltered.map(({ time, content }) => ({
          time,
          content,
          contents: [content]
        }))
      }
      return ret
    },
    activeLyricIndex() {
      return this.lyricWithTranslation
        ? this.lyricWithTranslation.findIndex((l, index) => {
            const nextLyric = this.lyricWithTranslation[index + 1]
            return (
              this.currentTime >= l.time &&
              (nextLyric ? this.currentTime < nextLyric.time : true)
            )
          })
        : -1
    },
    ...mapState(['currentSong', 'currentTime', 'playing', 'isPlayerShow'])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        this.setPlayerShow(false)
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }

      if (this.isPlayerShow) {
        this.updateSong()
      } else {
        this.updateLyric()
      }
    },
    isPlayerShow(show) {
      if (show) {
        this.updateSimi()
        this.addResizeListener()
        this.$nextTick(() => {
          this.scrollToActiveLyric()
        })
      } else {
        this.removeResizeListener()
      }
    },
    activeLyricIndex(newIndex, oldIndex) {
      if (
        newIndex !== oldIndex &&
        !this.lyricScrolling[WHEEL_TYPE] &&
        !this.lyricScrolling[SCROLL_TYPE]
      ) {
        this.scrollToActiveLyric()
      }
    },
    $route() {
      this.setPlayerShow(false)
    }
  },
  methods: {
    async updateSong() {
      this.updateSimi()
      this.updateLyric()
    },
    async updateSimi() {
      this.simiLoading = true
      const [simiPlaylists, simiSongs] = await Promise.all([
        getSimiPlaylists(this.currentSong.id),
        getSimiSongs(this.currentSong.id)
      ]).finally(() => {
        this.simiLoading = false
      })

      this.simiPlaylists = simiPlaylists.playlists
      this.simiSongs = simiSongs.songs.map(song => {
        const {
          id,
          name,
          artists,
          mvid,
          album: { picUrl },
          duration
        } = song
        return createSong({
          id,
          name,
          artists,
          duration,
          img: picUrl,
          mvId: mvid
        })
      })
    },
    onClickSong(song) {
      this.startSong(song)
      this.addToPlaylist(song)
    },
    onClickPlaylist(id) {
      if (id === Number(this.$route.params.id)) {
        this.setPlayerShow(false)
      } else {
        this.$router.push(`/playlist/${id}`)
      }
    },
    getActiveCls(index) {
      return this.activeLyricIndex === index ? 'active' : ''
    },
    resizeScroller: debounce(() => {
      this.$refs.scroller.getScroller().refresh()
    }, 500),
    addResizeListener() {
      window.addEventListener('resize', this.resizeScroller)
    },
    removeResizeListener() {
      window.removeEventListener('resize', this.resizeScroller)
    },
    getPlayerShowCls() {
      return this.isPlayerShow ? 'show' : 'hide'
    },
    scrollToActiveLyric() {
      if (this.activeLyricIndex !== -1) {
        const { scroller, lyric } = this.$refs
        if (lyric && lyric[this.activeLyricIndex]) {
          scroller
            .getScroller()
            .scrollToElement(lyric[this.activeLyricIndex], 200, 0, true)
        }
      }
    },
    onInitScroller(scroller) {
      const onScrollStart = type => {
        this.clearTimer(type)
        this.lyricScrolling[type] = true
      }
      const onScrollEnd = type => {
        this.clearTimer(type)
        this.lyricTimer[type] = setTimeout(() => {
          this.lyricScrolling[type] = false
        }, AUTO_SCROLL_RECOVER_TIME)
      }

      scroller.on('scrollStart', onScrollStart.bind(null, SCROLL_TYPE))
      scroller.on('mousewheelStart', onScrollStart.bind(null, WHEEL_TYPE))

      scroller.on('scrollEnd', onScrollEnd.bind(null, SCROLL_TYPE))
      scroller.on('mousewheelEnd', onScrollEnd.bind(null, WHEEL_TYPE))
    },
    clearTimer(type) {
      this.lyricTimer[type] && clearTimeout(this.lyricTimer[type])
    },
    async updateLyric() {
      const result = await getLyric(this.currentSong.id)
      // this.nolyric = !isDef(result.src) || !result.lrc.lyric
      isDef()
      this.nolyric = !result.lrc || !result.lrc.lyric
      if (!this.nolyric) {
        const { lyric, tlyric } = lyricParser(result)
        this.lyric = lyric
        this.tlyric = tlyric
      }
    },
    onGoMv() {
      this.setPlayerShow(false)
      goMvWithCheck(this.currentSong.mvId)
    },
    ...mapActions(['startSong', 'addToPlaylist']),
    ...mapMutations(['setPlayerShow'])
  }
}
</script>

<style lang="scss" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(1turn);
  }
}

$img-left-padding: 36px;
$img-outer-border-d: 320px;
$img-outer-d: 300px;

.player {
  position: fixed;
  top: $header-height;
  bottom: $mini-player-height;
  left: 0;
  right: 0;
  padding: 0 36px;
  background: var(--player-bgcolor);
  z-index: $song-detail-z-index;
  overflow: hidden;
  overflow-y: auto;
  transition: transform 0.5s;

  &.hide {
    transform: translateY(105%);
  }

  &.show {
    transform: none;
  }

  .content {
    max-width: 870px;
    margin: auto;

    .song {
      display: flex;

      .left {
        position: relative;
        padding: 80px 70px 0 $img-left-padding;
        display: flex;
        justify-content: center;

        $support-d: 30px;
        $support-d-half: $support-d / 2;
        .play-bar-support {
          position: absolute;
          left: $img-left-padding + $img-outer-border-d / 2 - $support-d / 2;
          top: -$support-d-half;
          width: $support-d;
          height: $support-d;
          z-index: 2;
        }

        .play-bar {
          $w: 100px;
          $h: 146px;
          position: absolute;
          top: 0;
          left: $img-left-padding + $img-outer-border-d / 2 - 6px;
          width: $w;
          height: $h;
          z-index: 1;
          transform-origin: 0 0;
          transform: rotate(-30deg);
          transition: all 0.3s;

          &.playing {
            transform: rotate(5deg);
          }
        }

        .img-outer-border {
          @include round($img-outer-border-d);
          @include flex-center;
          background: var(--song-shallow-grey-bg);

          .img-outer {
            @include round($img-outer-d);
            @include flex-center;
            background: $black;
            background: linear-gradient(-45deg, #333540, #070708, #333540);
            animation: rotate 20s linear infinite;

            &.paused {
              animation-play-state: paused;
            }

            .img-wrap {
              @include img-wrap(200px);

              img {
                border-radius: 50%;
              }
            }
          }
        }
      }

      .right {
        flex: 1;
        padding-top: 45px;
        .name-wrap {
          display: flex;
          align-items: center;
          margin-bottom: 16px;

          .name {
            font-size: $font-size-title-lg;
            color: var(--font-color-white);
          }

          .mv-tag {
            display: inline-block;
            margin-left: 8px;
            padding: 2px;
            border: 1px solid currentColor;
            border-radius: 2px;
            color: $theme-color;
            cursor: pointer;
          }
        }

        .artists {
          margin-bottom: 16px;
        }

        .desc {
          display: flex;
          font-size: $font-size-sm;
          margin-bottom: 30px;

          .desc-item {
            display: flex;
            margin-right: 32px;
            .label {
              display: inline-block;
              margin-right: 4px;
            }

            .value {
              color: $blue;
            }
          }
        }

        .lyric-wrap {
          width: 380px;
          height: 350px;
          mask-image: linear-gradient(
            180deg,
            hsla(0, 0%, 100%, 0) 0,
            hsla(0, 0%, 100%, 0.6) 15%,
            #fff 25%,
            #fff 75%,
            hsla(0, 0%, 100%, 0.6) 85%,
            hsla(0, 0%, 100%, 0)
          );

          .lyric-item {
            margin-bottom: 16px;
            font-size: $font-size-sm;

            &.active {
              font-size: $font-size;
              color: var(--font-color-white);
              font-weight: $font-weight-bold;
            }

            .lyric-text {
              margin-bottom: 8px;
            }
          }
        }
      }
    }

    .bottom {
      display: flex;
      margin-top: 48px;
      margin-bottom: 36px;

      .left {
        flex: 1;
      }

      .right {
        padding-left: 36px;
        width: 28%;
        overflow: hidden;

        .simi-playlists {
          margin-bottom: 36px;
        }

        .simi-songs {
          .play-icon {
            @include abs-center;
          }
        }

        .simi-item {
          margin-bottom: 6px;
        }

        .title {
          font-size: $font-size-lg;
          font-weight: $font-weight-bold;
          margin-bottom: 12px;
        }

        .desc {
          display: flex;
          align-items: center;

          .count {
            margin-left: 4px;
          }
        }
      }
    }
  }
}
</style>
