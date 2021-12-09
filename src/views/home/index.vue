<template>
  <div class="home-container">
    <!-- 导航栏   给固定定位，让其不再变化-->
    <van-nav-bar class="page-nav-bar">
     <van-button
      class="search-btn"
      slot="title"
      type="info"
      size="small"
      round
      icon="search"
     >搜索</van-button>
    </van-nav-bar>
    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <!-- placeholder占位符，为了使最后一个选择框显示出来 -->
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow = true">
        <i class="iconfont icon-gengduo"></i>
      </div>
      <van-tab 
      v-for="channel in channels"
      :key="channel.id"
      :title="channel.name"
      >
      <!-- 获取文章的列表 -->
      <ArticleList 
        :channel="channel"
      ></ArticleList>
      <!-- 获取文章的列表 -->

      </van-tab>
     
    </van-tabs>
    <!-- 频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
     v-model="isChannelEditShow"
     closeable
     close-icon-position="top-left"
     position="bottom"
     :style="{ height: '100%' }"
    >
      <ChannelEdit 
       :myChannels = "channels"
       :active="active"
       @updateActive = "onUpdateActive"
       ></ChannelEdit>
       <!-- 子组件向父组件传值，需要绑定事件，用@函数名，而不是 :函数名 -->
    </van-popup>
    <!-- 频道编辑弹出层 -->
  </div>
</template>

<script>
import ArticleList from './component/article-list.vue'
import { getUserChannels } from '@/api/user'
import ChannelEdit from './component/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from "@/utils/storage";
export default {
  name:'',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data() {
    return {
      active: 0,
      channels: [],
      // 此处一定是:
      isChannelEditShow: false
    };
  },
  watch: {},
  computed: {
    ...mapState(['user'])
  },
  methods: {
   async loadChannels(){
      // const {data} =await getUserChannels()
      // this.channels = data.data.channels
      // console.log(this.channels);
      try {
        let channels = []
        if(this.user) {
          const {data} = await getUserChannels()
          channels = data.data.channels
        } else{
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if(localChannels) {
            channels = localChannels
          } else {
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      }catch(err) {
        this.$toast('获取频道数据失败')
      }

    },
    onUpdateActive(index,isChannelEditShow = true){
      //console.log('home',index);测试是否绑定成功
      this.active = index
      // 该处的意思是如果isChannelEditShow没有给值，就自己有个默认值true,否则是false
      this.isChannelEditShow = isChannelEditShow
    }
  },
  created() {
    this.loadChannels()
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
    // .home-container {
    //   padding-top: 174px;
    //   padding-bottom: 100px;
    //   // 这里面审查元素知道 van-button宽度显示不出来，父亲元素设置了 max-width属性，利用unset不设置即可，但是需要使用deep属性
    //   /deep/.van-nav-bar__title {
    //     max-width: unset;
    //   }
    //   .search-btn {
    //     width: 555px;
    //     height: 64px;
    //     background-color: #5babfb;
    //     border: none;
    //     font-size: 28px;
    //     .van-icon {
    //       font-size: 32px;
    //     }
    //   }
    //   // 固定定位  频道列表
    //   // .van-tabs__wrap {
    //   //   position: fixed;
    //   //   top: 92px;
    //   //   left: 0;
    //   //   z-index: 1;
    //   // }
    //   /deep/.channel-tabs {
    //     .van-tabs__wrap {
    //       // position: absolute;
    //       // top: 100px;
    //       // left: 0;
    //       height: 82px;

    //   }
    //     .van-tab {
    //       min-width: 200px;
    //       border-right: 1px solid #edeff3;
    //       font-size: 30px;
    //       color: #777777;
    //     }
    //     .van-tab--active {
    //       color: #333333;
    //     }
    //     .van-tabs__line {
    //       position: absolute;
    //       bottom: 8px;
    //       width: 31px;
    //       height: 6px;
    //       background-color: #3296fa;
    //     }
    //     .van-tabs__nav--line {
    //       // 这里面要把属性设为0
    //       padding-bottom: 0;
    //     }
    //   }
    //   .placeholder {
    //     // 使这个盒子不受flex布局影响
    //     flex-shrink: 0;
    //     width: 66px;
    //     height: 82px;
    //   }
    //   .hamburger-btn {
    //     position: fixed;
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    //     right: 0;
    //     width: 59px;
    //     height: 82px;
    //     // font-size: 33px;  这里是给字体图标设置大小
    //     background-color: #fff;
    //     opacity: 0.902;
    //     .iconfont {
    //       font-size: 33px;
    //     }
    //     &:before {
    //       content: "";
    //       position: absolute;
    //       left: 0;
    //       width: 1px;
    //       height: 58px;
    //       background:url('~@/assets/gradient-gray-line.png');
    //       // 这个主要是让这个渐变色的条显示出来，利用szie属性即可
    //       background-size: contain;
    //     }
    //   }
    // }
    .home-container {
  // 让它取消最大宽度 unset可以理解为不设置的意思
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }

  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      background-color: rgba(255, 255, 255, 0.902);
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>