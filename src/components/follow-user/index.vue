<template>
    <van-button
        v-if=" isFollowed"
        class="follow-btn"
        round
        size="small"
        :loading="loading"
        @click="onFollow"
      >已关注</van-button>
      <van-button
        v-else
        class="follow-btn"
        type="info"
        color="#3296fa"
        round
        size="small"
        icon="plus"
        :loading="loading"
        @click="onFollow"
      >关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name:'FollowUser',
  components: {},
  // 自定义 v-model 的数据名称
  model: {
    prop: 'isFollowed', // 默认是 value
    event: 'update-is_followed' // 默认是 input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userID: {
      type: [Number, String, Object],
      required: true
    }
  },
//   props: {
//       value: {
//           type: Boolean,
//           required: true
//       },
//       userID: {
//           type: [Number, String, Object],
//           required: true
//       }
//   },
  data() {
    return {
        loading: false
    };
  },
  watch: {},
  computed: {},
  methods: {
       async onFollow () {
        this.loading = true  //展开关注按钮的loading状态
        try {
          if(this.isFollowed){
           //  已关注，取消用户
          await deleteFollow(this.userID)
        
          } else {
           //  没有关注，添加关注
            await addFollow(this.userID)

          }
         //  更新视图状态
        //   this.article.is_followed = !this.article.is_followed
        // 子传父更改状态
        // this.$emit('update-value',!this.value)
        // this.$emit('input',!this.value)
        this.$emit('update-is_followed',!this.isFollowed)
        }catch (err) {
          let message = '操作失败，请重试！'
          if(err.response && err.response.status === 400)
           message = '你不能关注你自己'
          this.$toast(message)
        }
        this.loading = false  //关闭关注按钮的loading状态
   }       
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>

</style>