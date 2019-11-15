import Vue from 'vue'
import VueRouter from 'vue-router'

const Discovery = () => import('@/page/discovery')
const PlaylistDetail = () => import('@/page/playlist-detail')
const PlayLists = () => import('@/page/playlists')

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
  },
  {
    path: '/playlists',
    name: 'playlists',
    component: PlayLists,
    meta: {
      title: '推荐歌单',
      icon: 'playlist-menu'
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
    {
      path: '/playlist/:id',
      name: 'playlist',
      component: PlaylistDetail
    },
    ...menuRoutes
  ]
})
