<template>
  <div class="layout-container">
    <router-view />
      <van-tabbar class="layout-tabbar" route >
        <van-tabbar-item replace to="/">
          <i slot="icon" class="iconfont icon-shouye"></i>
          <span class="text">首页</span>
        </van-tabbar-item>
        <van-tabbar-item replace to="/qa">
          <i slot="icon" class="iconfont icon-wenda"></i>
          <span class="text">问答</span>
        </van-tabbar-item><van-tabbar-item replace to="/video">
          <i slot="icon" class="iconfont icon-shipin"></i>
          <span class="text">视频</span>
        </van-tabbar-item><van-tabbar-item replace to="/my">
          <i slot="icon" class="iconfont icon-wode"></i>
          <!-- 这里用来调整用户登录和未登录过程中  底部tab栏的显示，是未登录还是我的 -->
          <span class="text">{{this.$store.state.user?'我的':'未登录'}}</span>
        </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name:'LayoutIndex',
  components: {},
  props: {},
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
    .layout-container {
        .iconfont {
            font-size: 40px;
        }
        span.text {
            font-size: 20px;
        }
    }
</style>