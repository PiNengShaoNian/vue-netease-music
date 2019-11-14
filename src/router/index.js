import Vue from 'vue'
import VueRouter from 'vue-router'

const Discovery = () => import('@/page/discovery')

Vue.use(VueRouter)

export const menuRoutes = [
  {
    path: '/discovery',
    name: 'discovery',
    component: Discovery,
    meta: {
      title: '发现音乐',
      icon: 'music'
    }
  }
]

export const layoutCenterNames = ['discovery', 'playlists', 'songs', 'mvs']

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/discovery'
    },
    ...menuRoutes
  ]
})
