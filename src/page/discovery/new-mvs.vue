<template>
  <div class="new-mvs" v-if="mvs.length">
    <Title>推荐MV</Title>
    <ul class="list-wrap">
      <li class="list-item" :key="mv.id" v-for="mv in mvs">
        <MvCard
          :author="mv.artistName"
          :id="mv.id"
          :img="mv.picUrl"
          :name="mv.name"
          :playCount="mv.playCount"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { getPersonalizedMv } from '@/api'
import MvCard from '@/components/mv-card'

export default {
  data() {
    return {
      mvs: []
    }
  },
  created() {
    this.getMvs()
  },
  methods: {
    async getMvs() {
      const { result } = await getPersonalizedMv()
      this.mvs = result
    }
  },
  components: { MvCard }
}
</script>

<style lang="scss" scoped>
.new-mvs {
  @include list(25%);
}
</style>
