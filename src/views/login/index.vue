<template>
  <div class="login-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
       class="page-nav-bar"
       title="登录"
    />

      <van-form @submit="onSubmit" ref="loginForm">
        <van-cell-group>
          <van-field
           v-model="user.mobile"
           name="mobile"
           placeholder="请输入手机号"
           :rules="userFormRules.mobile"
           type="number"
           maxlength="11"
           >
           <i slot="left-icon" class="iconfont icon-shouji"></i>
         </van-field>
         <van-field
           v-model="user.code"
           name="code"
           placeholder="请输入验证码"
           :rules="userFormRules.code"
           type="number"
           maxlength="6"
          >
           <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
           <template #button>
             <!-- 将倒计时组件放到和“发送验证码同一个位置处” -->
             <van-count-down 
               v-if="isCountDownShow"
               :time="1000*5" 
               format="ss s" 
               @finish ="isCountDownShow = false"
             />
             <van-button 
             v-else
             round 
             class="send-sms-btn" 
             size="small" 
             type="default"
             native-type="button"
             @click="onSendSms"
             >发送验证码</van-button>
           </template>
          </van-field>
        </van-cell-group>
         <div class="login-btn-wrap">
           <van-button class="login-btn" block type="info" native-type="submit">登录</van-button>
         </div>
      </van-form>
  </div>
</template>

<script>
import { login ,sendSms } from '@/api/user'
export default {
  name:'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user:{
        mobile:'',
        code:''
      },
      // 手机号和验证码校验规则
      userFormRules:{
        mobile:
           [{ 
               required:true, 
               message: '手机号不能为空'
            }, {
               pattern:/^1[3|5|7|8]\d{9}$/,
               message:'手机号格式错误'
            }],
        code:[{ 
               required:true, 
               message: '验证码不能为空'
            }, {
               pattern:/^\d{6}$/,
               message:'验证码格式错误'
            }]
      },
      // 倒计时是否开启的变量
      isCountDownShow:false
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 点击按钮，进行登录
    async onSubmit() {
      // 为了更好的用户体验，我们引入轻提示，告诉用户登录中，登陆成功，登录失败
     this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
        });
      try{
        const {data} = await login(this.user)
        // console.log('登录成功',res)
        this.$store.commit('setUser',data.data)
        this.$toast.success('登录成功')
      }catch(err){
        if(err.response.status === 400){
            console.log('登录失败',err)
            this.$toast.fail('登录失败，手机号或验证码错误')
      }else {
            this.$toast.fail('登陆失败，请稍后重试')
      }
        }  
    },
    async onSendSms(){
      // 1.发送验证码，首先校验手机号是否正确 注意，这里是写表单的名称，而且返回对象时promise，所以要用到try  catch
      try{
        await this.$refs.loginForm.validate('mobile')
        console.log('验证通过');
      }catch(err){
        console.log("验证失败",err);
      }
      // 2验证通过  显示倒计时
      this.isCountDownShow = true

      // 3 请求发送验证码  在  onSendSms方法中去使用sendSms方法
      try {
        // 这里的参数要写成  this.user.mobile
        await sendSms(this.user.mobile)
        this.$toast.success('发送成功')
      }catch(err){
        // 发送失败  关闭倒计时
        this.isCountDownShow = false
        if(err.response.status === 429){
          this.$toast('发送太频繁了，请稍后再试')
        }else{
           this.$toast('发送失败，请稍后再试')
        }
      }
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>
  .login-container {
    .iconfont {
      font-size: 37px;
      padding-right: 5px;
    }
    .send-sms-btn {
      width: 156px;
      height: 46px;
      line-height: 46px;
      background-color: #ededed;
      font-size: 22px;
      color: #666;
    }
    .login-btn-wrap {
      padding: 55px 30px;
      .login-btn {
      background-color: #6db4fb;
      font-size: 30px;
      border: none;
      border-radius: 10px;
      }
    }
  
  }
</style>