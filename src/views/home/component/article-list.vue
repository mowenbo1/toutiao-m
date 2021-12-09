<template>
  <div class="article-list">
    <!-- 绑定数据看情况啊，人家都有等号，你也要把等号加上 -->
    <van-pull-refresh 
      v-model="isRefreshLoading"
      :success-duration="1500"
      :success-text="isRefreshText"
      @refresh="onRefresh"
      >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
      <ArticleItem
          v-for="(article,index) in list" 
          :key="index" 
          :article = article
      ></ArticleItem>
      </van-list>
    </van-pull-refresh>
    
  </div>
</template>

<script>
// 引入某一个方法一定是要加{}
import {getAticleList} from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name:'ArticleList',
  components: {
    ArticleItem
  },
  props: {
      channel:{
          required:true,
          type:Object
      }
  },
  data() {
    return {
       list: [],
       loading: false,
       finished: false,
       timestamp:null,
       error: false,//错误提示
       isRefreshText:'刷新成功',
       isRefreshLoading: false,//下拉刷新组件控制
    };
  },
  watch: {},
  computed: {},
  methods: {
    // onLoad() {
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
    // },
    async onLoad() {
      // 异步更新数据
       try{
         const {data} = await getAticleList({
            channel_id:this.channel.id,
             // 你可以把 timestamp 理解为页码
          // 如果请求第1页数据：当前最新时间戳 Date.now
          // 如果请求之后的数据，使用本次接口返回的数据中的 pre_timestamp
            timestamp:this.timestamp || Date.now(),// 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
            with_top:1
       })

        // 模拟随机失败的情况
        // if (Math.random() > 0.2) {
        //   JSON.parse('dsnajndjsa')
        // }

       //console.log(data)
       const { results } = data.data
        // 数组的展开操作符，它会把数组元素一个一个拿出来
       this.list.push(...results)
       this.loading = false
       if(results.length) {
         this.timestamp = data.data.pre_timestamp
       } else {
         this.finished = true
       }
       }catch(err){
         this.loading = false//加载失败，关闭loading函数
         this.error = true;
       }
    },
     async onRefresh() {
        try{
          const {data} = await getAticleList({
             channel_id:this.channel.id,
             timestamp:Date.now(),//此时一定是当前的时间戳
             with_top:1
          })
          const {results} = data.data
          this.list.unshift(...results)//这里是向list数组中头部添加对象
          this.isRefreshLoading = false
          //更新下拉刷新成功的提示文本
          this.isRefreshText = `刷新成功，更新了${results.length}条数据`
        }catch(err){
          this.isRefreshText = '更新失败'
          this.isRefreshLoading = false
        }   
    },
  
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>
  .article-list {
    height: 79vh;
    overflow-y: auto;
  }
</style>