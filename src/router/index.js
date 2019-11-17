import Vue from 'vue'
import VueRouter from 'vue-router'

const Discovery = () => import('@/page/discovery')
const PlaylistDetail = () => import('@/page/playlist-detail')
const PlayLists = () => import('@/page/playlists')
const Songs = () => import('@/page/songs')
const Mvs = () => import('@/page/mvs')
const Mv = () => import('@/page/mv')

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
  },
  {
    path: '/songs',
    name: 'songs',
    component: Songs,
    meta: {
      title: '最新音乐',
      icon: 'yinyue'
    }
  },
  {
    path: '/mvs',
    name: 'mvs',
    component: Mvs,
    meta: {
      title: '最新MV',
      icon: 'mv'
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
    {
      path: '/mv/:id',
      name: 'searchMvs',
      component: Mv,
      props: (route) => ({id: +route.params.id})
    },
    ...menuRoutes
  ]
})
