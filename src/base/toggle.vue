<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { hasParent } from '@/utils'

export default {
  name: 'Toggle',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    reserveDoms: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    clickEvent(e) {
      const triggerElement = e.target
      const firstChildEle = this.$slots.default[0].elm
      const defaultReserveDoms = Array.from(
        document.querySelectorAll('.el-loading-mask, .el-loading-spinner')
      )
      const reserves = defaultReserveDoms.concat(firstChildEle)
      if (!hasParent(triggerElement, reserves.concat(this.reserveDoms))) {
        this.$emit('update:show', false)
      }
    },
    bindClick() {
      document.addEventListener('mousedown', this.clickEvent)
    },
    removeClick() {
      document.removeEventListener('mousedown', this.clickEvent)
    }
  },
  watch: {
    show(newShow) {
      setTimeout(() => {
        if (newShow) {
          this.bindClick()
        }
        else {
          this.removeClick()
        }
      }, 0)
    }
  },
  beforeDestroy() {
    this.removeClick()
  }
}
</script>