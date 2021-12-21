<template>
  <div class="search-result">
    <van-list
        v-model="loading"
        :finished="finished"
        :error.sync='error'
        errpr-text="加载失败，请点击重试"
        finished-text="没有更多了"
        @load="onLoad"
    >
      <van-cell 
        v-for="(article,index) in list" 
        :key="index" 
        :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name:'SearchResult',
  components: {},
  props: {
    q:{
      // 搜索关键词参数
      type:String,
      required:true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false
    };
  },
  watch: {},
  computed: {},
  methods: {
    //    onLoad() {
    //   // 异步更新数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1);
    //     }

    //     // 加载状态结束
    //     this.loading = false;

    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       this.finished = true;
    //     }
    //   }, 1000)
    // }
    async onLoad() {
      try{
        const { data } = await getSearchResult({
        page: this.page,
        per_page: this.perPage,
        q:this.q
      })
        const { results } = data.data
        //console.log(data);
        this.list.push(...results)
        this.loading = false
        if(results.length) {
          this.page++ //更新获取下一页额数据的页码
        } else {
          this.finished = true
        }
        }catch(err){
          // 展示加载失败的提示状态
          this.error = true
          // 加载失败了，loading 也要关闭
          this.loading = false
          this.$toast('获取列表失败，请稍后重试')
        }
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>
  .search-result {
    height: 90vh;
    overflow-y: auto;
  }
</style>