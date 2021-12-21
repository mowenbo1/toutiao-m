<template>
  <van-button
   :icon="value === 1 ? 'good-job': 'good-job-o'"
   :class="{
       liked: value === 1
       }"
   style="border: none"
   :loading="loading"
   @click="onLoad"
  ></van-button>
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name:'LikeArticle',
  components: {},
  props: {
      value:{
          type: Number,
          required: true
      },
      articleId: {
          type: [Number,String,Object],
          required: true
      }
  },
  data() {
    return {
        loading: false
    };
  },
  watch: {},
  computed: {},
  methods: {
     async onLoad () {
         this.loading = true
        try {
         let status = 1
         if(this.value === -1) {
            //  未点赞
            await addLike(this.articleId)
         }else{
        //    已点赞
           await deleteLike(this.articleId)
           status = -1
         }
        
        this.loading = false
        this.$emit('input',status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
        }catch(err) {
            this.$toast.fail('点赞失败，请重试')
        }
     }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>