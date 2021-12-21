<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
         />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate | relativeTime}}</div>
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            :loading="loadingFollow"
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
            :loading="loadingFollow"
            @click="onFollow"
          >关注</van-button> -->
          
           <!--
            模板中的 $event 是事件参数
            当我们传递给子组件的数据既要使用还要修改。
              传递：props
                :is-followed="article.is_followed"
              修改：自定义事件
                @update-is_followed="article.is_followed = $event"
            简写方式：在组件上使用 v-model
              value="article.is_followed"
              @input="article.is_followed = $event"  -->


          <!-- <FollowUser
            class="follow-btn"
            :isFollowed = "article.is_followed"
            :userID = "article.aut_id"
            @update-isFollowed= "article.is_followed = $event"
          ></FollowUser> -->

          <FollowUser
            class="follow-btn"
            v-model="article.is_followed"
            :userID = "article.aut_id"
          ></FollowUser>
          <!-- @update-isFollowed= "article.is_followed = $event"子传父函数，只修改一个值，所以这里直接写一句话就可以了
          $event就是一个值，子传父给传过来的值  -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容  文章内容可以利用markdown-body样式 进行ref选择里面的节点 -->
        <div 
          class="article-content markdown-body" 
          v-html="article.content"
          ref="article-content"
          ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表模块 -->
        <CommentList
         :source="article.art_id"
         :list="commentList"
         @onload-success="totalCommentCount = $event.total_count"
         @reply-click="onReplyClick"
        ></CommentList>
        <!-- /文章评论模块 -->
         <!-- 底部区域 -->
        <div class="article-bottom">
          <!-- 这里注意，不要写this -->
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
          >写评论</van-button>
          <!-- 评论的弹出层 -->
          <van-popup
            v-model="isPostShow"
            position="bottom"
          >
            <CommentPost
              :target="article.art_id"
              @onpost-success="onPostSuccess"
            ></CommentPost>
          </van-popup>
          <!-- 评论的弹出层 -->
          <!-- 这里一定要绑定数据 -->
          <van-icon
            name="comment-o"
            :info="totalCommentCount"
            color="#777"
          />
          <!-- 收藏文章 -->
          <!-- <van-icon
            color="#777"
            name="star-o"
          /> -->
          <!-- <CollectArticle
             class="btn-item"
             v-model="article.is_collected"
             :articleId="article.aut_id"
          ></CollectArticle>  错误原因，应该找art-id-->
           <CollectArticle
             class="btn-item"
             v-model="article.is_collected"
             :articleId="article.art_id"
           >
           </CollectArticle>
        <!-- 点赞文章 -->
          <!-- <van-icon
            color="#777"
            name="good-job-o"
          /> -->
           <LikeArticle
             class="btn-item"
             v-model="article.attitude"
             :articleId="article.art_id"
           ></LikeArticle>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
          </div>
          <!-- /加载完成-文章详情 -->

          <!-- 加载失败：404 -->
          <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
          </div>
          <!-- /加载失败：404 -->

          <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
          <div v-else class="error-wrap">
            <van-icon name="failure" />
            <p class="text">内容加载失败！</p>
            <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
          </div>
          <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
        </div>

    <!-- 点击评论里的回复的弹出层 -->
    <!-- 弹出层是懒渲染的，只有在第一次展示的时候才会展示里面的内容，之后它的关闭和显示都是在切换内容的隐藏和显示-->
     <van-popup
       v-model="isReplyShow"
       position="bottom"
       style="height: 100%;"
     >
     <!-- v-if来控制commentreply的渲染，这样可以改变弹出层的内容，每次都是打开的内容 -->
       <CommentReply
        v-if="isReplyShow"
        :comment="currentReply"
        @close="isReplyShow = false"
       ></CommentReply>
     </van-popup>
    <!-- /点击评论里的回复的弹出层 -->
   
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
// 这里引入图片预览的组件
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply 
  },
  // 给所有后代组件传递公共的数据
  // 注意：不要滥用
  provide: function(){
    return {
      articleId: this.articleId}
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, //用于接收文章详情
      loading: true, //控制文章的加载状态
      errStatus: 0,
      loadingFollow: false ,//按钮点击时有个等待的状态
      totalCommentCount: 0,
      isPostShow: false,
      commentList:[],//评论列表数组，为了让父组件使用list，可以将这个数组与子组件中的数组list绑定在一起
      isReplyShow: false,
      currentReply: {}//当前回复的评论列表
    }
  },
  computed: {},
  watch: {},
  created () {
      this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle() {
      // 刚开始让loading为true
          this.loading = true
        try {
          const { data } = await getArticleById (this.articleId)
          // console.log(data);
        // 模拟失败请求
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsankljdnskaljndlkjsa')
        // }
          this.article = data.data

          // 获取数据成功，就去获取  相关的节点,  进行初始化
          // console.log(this.$refs['article-content']); 这样是获取不到节点的，因为不是数据和视图不是同步更新的
          // this.$nextTick(()=>{
          //   console.log(this.$refs['article-content']);
          // })    为什么不能用  this.nextTick()
          setTimeout(()=>{
            // console.log(this.$refs['article-content']);检查相应的节点是否拿到
            this.previewImage()
          },0)
        } catch (err) {
          if(err.response && err.response.status === 404) {
            this.errStatus = 404
          }
            console.log('获取数据失败',err);
        }
        // 请求无论成功还是失败，都需要关闭这个loading的状态
        this.loading = false
    },
    // 这里在遍历的时候就可以注册点击事件了
    previewImage() {
      // 得到所有的img节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // console.log(imgs);
      const images = []//保存图片的src地址
      imgs.forEach((img,index) => {
        images.push(img.src)
        img.onclick = ()=>{
          ImagePreview({
            images,
            // 起始位置，从当前的index开始
            startPosition: index
          });
        }
      })
      // console.log(images);
    },
    onPostSuccess (data) {
      this.isPostShow = false
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick (comment) {
      this.isReplyShow = true
      // console.log(comment);
      this.currentReply = comment
    }
  //  async onFollow () {
  //    this.loadingFollow = true  //展开关注按钮的loading状态
  //    try {
  //      if(this.article.is_followed){
  //       //  已关注，取消用户
  //      await deleteFollow(this.article.aut_id)
    
  //      } else {
  //       //  没有关注，添加关注
  //        await addFollow(this.article.aut_id)

  //      }
  //     //  更新视图状态
  //      this.article.is_followed = !this.article.is_followed
  //    }catch (err) {
  //      let message = '操作失败，请重试！'
  //      if(err.response && err.response.status === 400)
  //       message = '你不能关注你自己'
  //      this.$toast(message)
  //    }
  //    this.loadingFollow = false  //关闭关注按钮的loading状态
  //  }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';//导入markdown的样式

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
        // 该处样式的含义是把
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/.van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>

