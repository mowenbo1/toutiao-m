<template>
  <div class="my-container">
      <!-- 登录用户的界面 -->
    <div v-if="user" class="header userinfo">
      <div class="base-info">
        <div class="left">
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="userInfo.photo"
          />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button
            size="mini"
            round
            to="user/profile"
            >
          编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div> 
    <!-- 用户未登录 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" />
        <span class="text">登录/注册</span>
      </div>
    </div>
  
    <!-- 宫格导航  grid导航 -->
      <van-grid :column-num="2" class="grid-nav" clickable>
        <van-grid-item class="grid-item">
          <i slot="icon" class="iconfont icon-shoucang"></i>
          <span slot="text" class="text">收藏</span>
        </van-grid-item>
        <van-grid-item class="grid-item">
          <!-- 为了使这个地方文字能够书写大小，需要把span里面的文字给个类名 text -->
          <i slot="icon" class="iconfont icon-lishi"></i>
          <span slot="text" class="text">历史</span>
        </van-grid-item>
      </van-grid>
    <!-- 宫格导航  grid导航 -->
    <!-- 小智同学 -->
      <van-cell title="消息通知" is-link/>
      <van-cell title="小智同学" is-link/>
      <!-- 这里的退出按钮也是要等到有登录信息才会显示的 clickable是为了增加用户的体验效果，有一个点击的动作-->
      <van-cell v-if="user" title="退出登录" class="logou-btn" @click="onLogout" clickable/>
    <!-- 小智同学 -->
  </div>
</template>

<script>
// 这里要是显示用户的登录信息等内容，应该是获取state状态就可以了
import {mapState} from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name:'',
  components: {},
  props: {},
  data() {
    return {
      userInfo:{}//用户信息，用于接收返回来的数据，只需要提前知道 返回来的参数类型
    };
  },
  watch: {},
  computed: {
    ...mapState(['user'])
  },
  created() {
    // 用户登录的时候需要获取信息   而且数据都是在created周期中渲染的
    if(this.user) {
      this.loadUserInfo()//渲染加载数据
    }
  },
  mounted() {},
  methods: {
    onLogout(){
      // console.log('onLogout'); 这个方法用于检验该事件是否绑定成功
      // 退出登录  清除邓丽状态（容器中的user + 本地存储中的user） 使用组件时，使用this.$dialog
      this.$dialog.confirm({
          title: '确认退出吗？',
        })
          .then(() => {
            // console.log('确认执行这里');
            this.$store.commit('setUser',null)
          })
          .catch(() => {
            console.log('退出执行这里')
          })
            },
    async loadUserInfo() {
      try{
        const {data} =await getUserInfo()
        // console.log(data)
        this.userInfo = data.data
      }
      catch(err){
        console.log(err);
        this.$toast('获取数据失败，请稍后再试')
      }
    }
  },
  
  
};
</script>
<style lang="less" scoped>
  .header {
    height: 361px;
    // 此处是使用~@是在CSS当中快速定位到src路径下
    background:url('~@/assets/banner.png');
    background-size: cover;
  }
  // 此处注意不要在header里面写样式
   .not-login {
      display: flex;
      justify-content: center;
      align-items: center;
      .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      }
      .mobile-img {
        width:132px;
        height:132px;
        margin-bottom: 15px;
      }
      span.text {
        font-size: 28px;
        color: #fff;
      }
    }
    .userinfo{
      .base-info{
        height: 231px;
        padding: 76px 32px 23px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left{
          display: flex;
          align-items: center;
          .avatar {
            width: 132px;
            height: 132px;
            border: 4px solid #fff;
            margin-right: 23px;
          }
          .name {
            font-size: 30px;
            color: #fff;
          }
        }
      }
      .data-stats {
        display: flex;
        align-items: center;
        .data-item {
          height: 130px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #fff;
          .count {
            font-size: 36px;
            margin-bottom: 11px;
          }
          .text {
            font-size: 23px;
          }
        }
      }

    }

    .grid-nav {
      .grid-item {
         height: 141px;
        i.iconfont{
          font-size: 48px!important;
        }
        .icon-shoucang{
          color: #eb5253;
        }
        .icon-lishi {
          color: #ff9d1d;
        }
        span.text {
          font-size: 28px!important;
        }
      }
    }
    .logou-btn {
      text-align: center;
      color: #d86262;
      margin-top: 15px;
    }
</style>