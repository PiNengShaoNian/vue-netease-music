<template>
  <div class="user">
    <div class="login-trigger" @click="onOpenModal" v-if="!isLogin">
      <i class="user-icon iconfont icon-yonghu" />
      <p class="user-name">未登录</p>
    </div>

    <div class="logined-user" @click="onLogout" v-else>
      <img :src="$utils.genImgUrl(user.avatarUrl, 80)" class="avatar" alt />
      <p class="user-name">{{user.nickname}}</p>
    </div>

    <el-dialog :modal="false" :visible.sync="visible" :width="$utils.toRem(320)">
      <p slot="title">登录</p>
      <div class="login-body">
        <el-input class="input" placeholder="请输入你的网易云uid" v-model="uid" />
        <div class="login-help">
          <p class="help">
            1、请
            <a href="http://music.163.com" target="_blank">点我(http://music.163.com)</a>打开网易云音乐官网
          </p>
          <p class="help">2、点击页面右上角的“登录”</p>
          <p class="help">3、点击您的头像，进入我的主页</p>
          <p class="help">4、复制浏览器地址栏 /user/home?id= 后面的数字（网易云 UID）</p>
        </div>
      </div>
      <div class="dialog-footer" slot="footer">
        <el-button :loading="loading" @click="onLogin(uid)" class="login-btn" type="primary">登录</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import storage from 'good-storage'
import { confirm } from '@/base/confirm'
import { UID_KEY, isDef } from '@/utils'
import {
  mapActions as mapUserActions,
  mapState as mapUserState,
  mapGetters as mapUserGetters
} from '@/store/helper/user'

export default {
  data() {
    return {
      visible: false,
      loading: false,
      uid: ''
    }
  },
  computed: {
    ...mapUserState(['user']),
    ...mapUserGetters(['isLogin'])
  },
  created() {
    const uid = storage.get(UID_KEY)
    if (isDef(uid)) {
      this.onLogin(uid)
    }
  },
  methods: {
    onOpenModal() {
      this.visible = true
    },
    onCloseModal() {
      this.visible = false
    },
    async onLogin(uid) {
      this.loading = true
      const success = await this.login(uid).finally(() => {
        this.loading = false
      })
      if (success) {
        this.onCloseModal()
      }
    },
    onLogout() {
      confirm('确定要注销吗？', () => {
        this.logout()
      })
    },
    ...mapUserActions(['login', 'logout'])
  }
}
</script>

<style lang="scss" scoped>
.user {
  padding: 16px;
  padding-bottom: 0;
  margin-bottom: 12px;

  .login-trigger {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .user-icon {
    font-size: 24px;
  }

  .user-name {
    margin-left: 8px;
  }

  .logout {
    transform: translateY(1px);
    margin-left: 8px;
    color: var(--font-color-shallow-grey);
  }

  .login-body {
    .input {
      margin-bottom: 16px;
    }

    .login-help {
      .help {
        margin-bottom: 4px;
      }
    }
  }

  .login-btn {
    width: 100%;
    padding: 8px 0;
  }

  .logined-user {
    display: flex;
    align-items: center;
    cursor: pointer;

    .avatar {
      @include round(40px);
    }
  }
}
</style>

