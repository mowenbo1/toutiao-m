<template>
  <div class="comment-post">
      <!-- v-modee.trim可以去除空格，按钮的disable属性可以使其禁用 -->
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      class="post-btn"
      @click="onPost"
      :disabled="!message.length"
    >发布</van-button>
  </div>
</template>

<script>
// 这里引入的是方法，需要加上{}
import { addComment }from '@/api/comment'
export default {
  name: 'CommentPost',
  components: {},
  // 通过inject函数接收父组件给所有后代组件注入的参数
  inject:{
    articleId:{
      type: [Number, String, Object],
      default: null
    }
  },
  props: {
      target:{
          type: [Number, String, Object],
          reqired:true
      }
  },
  data () {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
     async onPost (){
          this.$toast.loading({
           message: '发布中...',
           forbidClick: true, // 禁用背景点击
           duration: 0 // 持续时间，默认 2000，0 表示持续展示不关闭
         })
         try{
           const {data} =  await addComment({
                target:this.target.toString(),// 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
                content:this.message,// 评论内容
                art_id: this.articleId? this.articleId.toString(): this.articleId// 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
             })
             console.log(data);
            //  发布成功，需要重置输入框
            this.message = ''
            // 关闭输入框

            // 更新列表
            // 上述两个事件放到父组件中，根据自定义事件进行操作处理
            this.$emit('onpost-success',data.data)
            this.$toast.success('发布成功')
         }catch(err) {
             this.$toast.fail('发布失败，请重试')
         }
      }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
