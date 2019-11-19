<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress" />
      <div class="progress-btn-wrapper" ref="progressBtn">
        <div class="progress-btn" :class="{ show: alwaysShowBtn }" />
      </div>
    </div>
  </div>
</template>

<script>
import { toCurrentRem, prefixStyle } from '@/utils'
const transform = prefixStyle('transform')
export default {
  name: 'ProgressBar',
  props: {
    percent: {
      type: Number,
      default: 0
    },
    alwaysShowBtn: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.touch = {}
  },
  mounted() {
    if (this.percent > 0) {
      this.setProgressOffset(this.percent)
    }
  },
  watch: {
    percent(newPercent) {
      this.setProgressOffset(newPercent)
    }
  },
  methods: {
    setProgressOffset(percent) {
      if (percent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth
        const offsetWidth = percent * barWidth
        this._offset(offsetWidth)
      }
    },
    _offset(offsetWidth) {
      const offsetRem = toCurrentRem(offsetWidth)
      this.$refs.progress.style.width = `${offsetRem}`
      this.$refs.progressBtn.style[
        transform
      ] = `translate3d(${offsetRem}, 0, 0)`
    },
    progressClick(e) {
      if (!this.disabled) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = Math.max(
          0,
          Math.min(e.pageX - rect.left, this.$refs.progressBar.clientWidth)
        )
        this._offset(offsetWidth)
        this._triggerPercent()
      }
    },
    _triggerPercent() {
      this.$emit('percentChange', this._getPercent())
    },
    _getPercent() {
      const barWidth = this.$refs.progressBar.clientWidth
      return this.$refs.progress.clientWidth / barWidth
    }
  }
}
</script>

<style scoped lang="scss">
.progress-bar {
  height: 30px;
  cursor: pointer;

  .bar-inner {
    position: relative;
    top: 14px;
    height: 2px;
    background: var(--progress-bgcolor);

    .progress {
      position: absolute;
      height: 100%;
      background: $theme-color;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -15px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        display: none;
        position: relative;
        top: 8px;
        left: 9px;
        box-sizing: border-box;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: $theme-color;

        &.show {
          display: block;
        }
      }
    }
  }

  &:hover {
    .progress-btn {
      display: block !important;
    }
  }
}
</style>
