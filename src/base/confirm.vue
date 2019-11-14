<template>
  <el-dialog
    :modal="false"
    :visible.sync="visible"
    :width="$utils.toRem(320)"
    class="confirm-dialog"
  >
    <div slot="title">{{title || '提示'}}</div>
    <div class="confirm-body">{{text}}</div>
    <span class="dialog-footer" slot="footer">
      <el-button @click="confirmAndClose">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
const Confirm = {
  name: 'Confirm',
  props: ['visible', 'text', 'title', 'onConfirm'],
  methods: {
    confirmAndClose() {
      this.onConfirm && this.onConfirm()
      this.visible = false
    }
  }
}
export default Confirm

let instanceCache

export const confirm = (text, title, onConfirm = () => { }) => {
  if (typeof title === 'function') {
    onConfirm = title
    title = undefined
  }

  const ConfirmCtor = Vue.extend(Confirm)
  const getInstance = () => {
    if (!instanceCache) {
      instanceCache = new ConfirmCtor({
        propsData: {
          text,
          title,
          onConfirm
        }
      })

      instanceCache.$mount()
      document.body.appendChild(instanceCache.$el)
    }
    else {
      instanceCache.text = text
      instanceCache.title = title
      instanceCache.onConfirm = onConfirm
    }
    return instanceCache
  }
  const instance = getInstance()

  Vue.nextTick(() => {
    instance.visible = true
  })
}
</script>

<style lang="scss" scoped>
.confirm-dialog {
  /deep/.el-dialog__body {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .confirm-body {
    line-height: 20px;
  }
  .confirm-btn {
    width: 100%;
  }
}
</style>