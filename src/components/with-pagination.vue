<template>
  <div class="with-pagination">
    <slot />
    <div class="pagination-wrap">
      <Pagination
        :current-page.sync="currentPage"
        :page-size="limit"
        :total="total"
        @current-change="onPageChange"
        class="pagination"
      />
    </div>
  </div>
</template>

<script>
import { getPageOffset, scrollInto } from '@/utils'
export default {
  props: {
    getData: {
      type: Function,
      required: true
    },
    getDataParams: {
      type: Object,
      default: () => ({})
    },
    limit: {
      type: Number,
      default: 10
    },
    scrollTarget: {
      type: HTMLElement
    },
    total: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.onPageChange(this.currentPage)
  },
  data() {
    return {
      currentPage: 1
    }
  },
  methods: {
    async onPageChange() {
      try {
        const result = await this.getData({
          limit: this.limit,
          offset: getPageOffset(this.currentPage, this.limit),
          ...this.getDataParams
        })
        this.$emit('getDataSuccess', result)
        if (this.scrollTarget) {
          scrollInto(this.scrollTarget)
        }
      } catch (error) {
        this.$emit('getDataError', error)
      }
    }
  },
  watch: {
    getDataParams: {
      deep: true,
      handler() {
        this.currentPage = 1
        this.onPageChange(1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-wrap {
  margin-top: 16px;
}
</style>
