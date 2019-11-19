<template>
  <div class="mini-player" id="mini-player">
    <div class="song">
      <template v-if="hasCurrentSong">
        <div class="img-wrap" @click="togglePlayerShow">
          <div class="mask" />
          <img :src="$utils.genImgUrl(currentSong.img, 80)" class="blur" alt />
          <div class="player-control">
            <Icon :size="24" :type="playControlIcon" color="white" />
          </div>
        </div>
        <div class="content">
          <div class="top">
            <p class="name">{{ currentSong.name }}</p>
            <p class="split">-</p>
            <p class="artists">{{ currentSong.artistsText }}</p>
          </div>
          <div class="time">
            <span class="played-time">{{
              $utils.formatTime(currentTime)
            }}</span>
            <span class="split">/</span>
            <span class="total-time">{{
              $utils.formatTime(currentSong.duration / 1000)
            }}</span>
          </div>
        </div>
      </template>
    </div>
    <div class="control">
      <Icon :size="24" @click="prev" class="icon" type="prev" />
      <el-popover
        :value="isPlayErrorPromptShow"
        placement="top"
        trigger="manual"
        width="160"
      >
        <p>请开始播放</p>
        <div class="play-icon" @click="togglePlaying" slot="reference">
          <Icon :size="24" :type="playIcon" />
        </div>
      </el-popover>
      <Icon :size="24" @click="next" class="icon" type="next" />
    </div>

    <div class="mode">
      <Share :shareUrl="shareUrl" class="mode-item" v-show="hasCurrentSong" />
      <el-popover placement="top" trigger="hover" width="160">
        <p>{{ playModeText }}</p>
        <Icon
          :size="20"
          :type="modeIcon"
          @click="onChangePlayMode"
          class="mode-item"
          slot="reference"
        />
      </el-popover>

      <el-popover
        :value="isPlaylistPromptShow"
        placement="top"
        trigger="manual"
        width="160"
      >
        <p>已更新歌单</p>
        <Icon
          :size="20"
          @click="togglePlaylistShow"
          class="mode-item"
          slot="reference"
          type="playlist"
        />
      </el-popover>

      <div class="volume-item">
        <Volume :volume="volume" @volumeChange="onVolumeChange" />
      </div>

      <div class="progress-bar-wrap">
        <ProgressBar
          :disable="!hasCurrentSong"
          :percent="playedPercent"
          @percentChange="onProgressChange"
        />
      </div>
      <audio
        :src="currentSong.url"
        @canplay="ready"
        @ended="end"
        @timeupdate="updateTime"
        ref="audio"
      />
    </div>
  </div>
</template>

<script>
import Storage from 'good-storage'
import { mapState, mapMutations, mapGetters, mapActions } from '@/store/helper/music'
import { isDef, playModeMap, VOLUME_KEY } from '@/utils'
import Share from '@/components/share'

const DEFAULT_VOLUME = 0.75

export default {
  components: {
    Share
  },
  data() {
    return {
      songReady: false,
      isPlayErrorPromptShow: false,
      volume: Storage.get(VOLUME_KEY, DEFAULT_VOLUME)
    }
  },
  computed: {
    hasCurrentSong() {
      return isDef(this.currentSong.id)
    },
    currentMode() {
      return playModeMap[this.playMode]
    },
    playControlIcon() {
      return this.isPlayerShow ? 'shrink' : 'open'
    },
    shareUrl() {
      return `${window.location.origin}?shareMusicId=${this.currentSong.id}`
    },
    playModeText() {
      return this.currentMode.name
    },
    modeIcon() {
      return this.currentMode.icon
    },
    playIcon() {
      return this.playing ? 'pause' : 'play'
    },
    playedPercent() {
      const { durationSecond } = this.currentSong
      return Math.min(this.currentTime / durationSecond, 1) || 0
    },
    audio() {
      return this.$refs.audio
    },
    ...mapState([
      'currentSong',
      'isPlayerShow',
      'currentTime',
      'playing',
      'playMode',
      'isPlaylistShow',
      'isPlaylistPromptShow'
    ]),
    ...mapGetters(['prevSong', 'nextSong'])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        this.audio.pause()
        this.audio.currentTime = 0
        return
      }

      if (oldSong && newSong.id === oldSong.id) {
        this.setCurrentTime(0)
        this.audio.currentTime = 0
        this.play()
        return
      }

      this.songReady = false
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.play()
      }, 1000)
    },
    playing(newPlaying) {
      this.$nextTick(() => {
        newPlaying ? this.play() : this.pause()
      })
    }
  },
  methods: {
    async play() {
      if (this.songReady) {
        try {
          await this.audio.play()
          if (this.isPlayErrorPromptShow) {
            this.isPlayErrorPromptShow = false
          }
        } catch (error) {
          this.isPlayErrorPromptShow = true
          this.setPlayingState(false)
        }
      }
    },
    togglePlayerShow() {
      this.setPlayerShow(!this.isPlayerShow)
    },
    ready() {
      this.songReady = true
    },
    end() {
      this.next()
    },
    togglePlaying() {
      if (!this.currentSong.id) {
        return
      }
      this.setPlayingState(!this.playing)
    },
    updateTime(e) {
      const time = e.target.currentTime
      this.setCurrentTime(time)
    },
    next() {
      if (this.songReady) {
        this.startSong(this.nextSong)
      }
    },
    pause() {
      this.audio.pause()
    },
    prev() {
      if (this.songReady) {
        this.startSong(this.prevSong)
      }
    },
    onProgressChange(percent) {
      this.audio.currentTime = this.currentSong.durationSecond * percent
    },
    onChangePlayMode() {
      const modeKeys = Object.keys(playModeMap)
      const currentModeIndex = modeKeys.findIndex(
        key => playModeMap[key].code === this.playMode
      )
      const nextIndex = (currentModeIndex + 1) % modeKeys.length
      const nextModeKey = modeKeys[nextIndex]
      const nextMode = playModeMap[nextModeKey]
      this.setPlayMode(nextMode.code)
    },
    togglePlaylistShow() {
      this.setPlaylistShow(!this.isPlaylistShow)
    },
    onVolumeChange(percent) {
      this.audio.volume = percent
      Storage.set(VOLUME_KEY, percent)
    },
    ...mapMutations([
      'setPlayerShow',
      'setPlayingState',
      'setPlaylistShow',
      'setCurrentTime',
      'setPlayMode'
    ]),
    ...mapActions(['startSong'])
  }
}
</script>

<style lang="scss" scoped>
.mini-player {
  position: relative;
  position: fixed;
  z-index: $mini-player-z-index;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  height: $mini-player-height;
  padding: 8px 16px;
  padding-right: 24px;
  background: var(--body-bgcolor);

  .song {
    display: flex;
    flex: 4;
    overflow: hidden;

    .img-wrap {
      position: relative;
      margin-right: 8px;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      @include img-wrap(40px);

      img {
        &.blur {
          filter: blur(2px);
        }
      }

      .player-control {
        @include abs-center;
      }

      .mask {
        @include abs-stretch;
        background: rgba(0, 0, 0, 0.2);
      }
    }

    .content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .top {
        display: flex;
        align-items: flex-end;
        white-space: nowrap;

        .name {
          color: var(--font-color-white);
          @include text-ellipsis;
        }

        .split {
          font-size: $font-size-xs;
          margin: 0 4px;
        }

        .artists {
          font-size: $font-size-xs;
          @include text-ellipsis;
        }
      }

      .time {
        font-size: $font-size-xs;
        color: var(--font-color-grey);

        .split {
          margin: 0 4px;
        }
      }
    }
  }

  .control {
    position: absolute;
    height: 100%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    @include flex-center();

    .play-icon {
      @include flex-center();
      position: relative;
      width: 45px;
      height: 45px;
      margin: 0 16px;
      border-radius: 50%;
      background: $theme-color;
      cursor: pointer;

      i {
        color: #fff;
      }
      .icon-play {
        transform: translateX(1px);
      }
    }

    .icon {
      color: $theme-color;
    }
  }

  .mode {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 6;

    .mode-item {
      display: block;
      margin-right: 16px;
      width: 22px;
    }

    .volume-item {
      margin-right: 22px;
    }
  }

  .progress-bar-wrap {
    position: absolute;
    left: 0;
    right: 0;
    top: -14px;
  }
}

.icon {
  color: var(--font-color);
  cursor: pointer;
}
</style>
