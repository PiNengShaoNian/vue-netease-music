import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import musicModule from './modules/music'
import globalModule from './modules/global'
import userModule from './modules/user'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    music: musicModule,
    global: globalModule,
    user: userModule
  },
  plugins: debug ? [createLogger()] : []
})
