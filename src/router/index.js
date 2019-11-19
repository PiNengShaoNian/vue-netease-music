import Vue from 'vue'
import VueRouter from 'vue-router'

const Discovery = () => import('@/page/discovery')
const PlaylistDetail = () => import('@/page/playlist-detail')
const PlayLists = () => import('@/page/playlists')
const Songs = () => import('@/page/songs')
const Mvs = () => import('@/page/mvs')
const Mv = () => import('@/page/mv')
const SearchSongs = () => import('@/page/search/songs')
const Search = () => import('@/page/search')
const SearchMvs = () => import('@/page/search/mvs')
const SearchPlaylists = () => import('@/page/search/playlists')

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
      props: route => ({ id: +route.params.id })
    },
    {
      path: '/search/:keywords',
      name: 'search',
      component: Search,
      props: true,
      children: [
        {
          path: '/',
          redirect: 'songs'
        },
        {
          path: 'songs',
          name: 'searchSongs',
          component: SearchSongs
        },
        {
          path: 'mvs',
          name: 'searchMvs',
          component: SearchMvs
        },
        {
          path: 'playlists',
          name: 'searchPlaylists',
          component: SearchPlaylists
        }
      ]
    },
    ...menuRoutes
  ]
})
