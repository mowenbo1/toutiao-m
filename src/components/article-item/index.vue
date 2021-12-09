<template>
      <van-cell class="article-item">
        <div slot="title" class="title">{{article.title}}</div>
        <div slot="label">
            <!-- 这个地方如果我们想让图片循环三次，我们需要利用div把van-img抱起来，这样的话才可以循环，不要直接循环图片 -->
          <div v-if="article.cover.type === 3" class="cover-wrap">
           <div 
           class="cover-item"
           v-for="(img,ind) in article.cover.images"
           :key="ind"
           >
              <van-image
                 class="cover-item-img"
                 fit="cover"
                 :src="img"
              /> 
           </div>
          </div>
          <div class="lable-info-wrap">
            <span>{{article.aut_name}}</span>
            <span>{{article.comm_count}}评论</span>
            <span>{{article.pubdate | relativeTime}}</span>
          </div>
        </div>
        <van-image
          v-if="article.cover.type === 1"
          class="right-cover"
          slot="default"
          fit="cover"
          :src="article.cover.images[0]"
        />
      </van-cell>
</template>

<script>
export default {
  name:'ArticleItem',
  components: {},
  props: {
      article:{
          type:Object,
          required:true
      }
  },
  data() {
    return {
    };
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>
    .article-item {
        .title {
            font-size: 32px;
            color: #3a3a3a;
        }
        .lable-info-wrap span {
            font-size: 23px;
            color: #b4b4b4;
            margin-right: 23px;
        }
        .right-cover {
            width: 218px;
            height: 149px;
            background-size: cover;
        }
        .van-cell__value {
            flex: unset;
            width: 218px;
            height: 149px;
        }
        // 三个图片的样式
        .cover-wrap {
            display: flex;
            padding: 30px 0;
            .cover-item {
                flex: 1;
                height: 146px;
                // 设置除最后一个的样式
                &:not(:last-child){
                    padding-right: 4px;
                }
            }
            .cover-item-img {
                width: 100%;
                height: 146px;
            }
        }

    }
</style>