<template>
  <div class="comment-list">
    <!-- 这里immediate-check是不让自动调loading，因为我们在created里面已经调用了loading函数  -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error="error"
      error-text="加载失败，请点击重试"
      :immediate-check="false"
      @load="onLoad"
    >
    <!-- 这里面的reply-click函数是子组件传递过来的 -->
    <CommentItem
        v-for="(item,index) in list"
        :key="index"
        :comment="item"
        @reply-click="$emit('reply-click', $event)"
    ></CommentItem>
      
    </van-list>
  </div>
</template>

<script>
import { getComments} from '@/api/comment'
import CommentItem from '../comment-item/index.vue'
export default {
  name:'CommentList',
  components: {
      CommentItem
  },
  props: {
      source:{
          type: [Number,String,Object],
          required: true
      },
      list:{
          type:Array,
          default:()=>[]
      },
      type:{
        type:String,
        validator(value) {
          return ['a','c'].includes(value)
        },
        default:'a',

        
      }
  },
  data() {
    return {
    //   list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      error:false
    };
  },
  watch: {},
  computed: {},
  methods: {
    //   onLoad() {
    //   // 异步更新数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1);
    //     }

    //     // 加载状态结束
    //     this.loading = false

    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       this.finished = true
    //     }
    //   }, 1000)
    // }
    async onLoad () {
        try{
            // 1. 请求获取数据
          const { data } = await getComments({
          type: this.type, //  评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id toString 避免错误 不然id超出了js的安全整数范围，axios拼接错误多了个"号
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // 这里解构一定要准确，results
         const { results } = data.data
        //  
         this.list.push(...results)
         // 把文章评论的总数量传递到外部
        this.$emit('onload-success', data.data)
        this.loading = false
        // results一定要准确
         if(results.length) {
             // 有就更新获取下一页的数据页码  ,这里的数据是data.data
             this.offset = data.data.last_id
         } else {
             this.finished = true
         }
        }catch(err){
            this.error = true
            this.loading = false
        }
    }
  },
  created() {
    //   刚开始的地方执行这个函数，底下的评论就不会是0
      // 当你手动初始 onLoad 的话，它不会自动开始初始的 loading
    // 所以我们要手动的开启初始 loading
    this.loading = true
    //  提前调用才能拿到评论总数
    this.onLoad()
  },
  mounted() {}
};
</script>
<style lang="less" scoped>

</style>