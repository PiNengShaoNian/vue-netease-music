<template>
  <Icon
    :data-clipboard-text="shareUrl"
    :size="20"
    @click="onSharePromptClick"
    class="mode-item"
    ref="shareIcon"
    slot="reference"
    type="share"
  />
</template>

<script>
import Clipboard from 'clipboard'
export default {
  props: ['shareUrl'],
  mounted() {
    this.initShareIcon()
  },
  methods: {
    initShareIcon() {
      new Clipboard(this.$refs.shareIcon.$el)
    },
    onSharePromptClick() {
      confirm('分享已经复制到剪切板，去分享吧')
    }
  }
}
</script>