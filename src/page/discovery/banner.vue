<template>
  <el-carousel :interval="4000" class="banner-carousel" type="card">
    <el-carousel-item :key="banner.scm" v-for="banner in banners">
      <img :src="$utils.genImgUrl(banner.imageUrl, 1000, 400)" class="banner-img" alt />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { getBanner } from '@/api'
export default {
  async created() {
    const { banners } = await getBanner()
    this.banners = banners
  },
  data() {
    return {
      banners: []
    }
  }
}
</script>