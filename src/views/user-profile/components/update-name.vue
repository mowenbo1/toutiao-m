<template>
  <div class="update-name">
      <!-- 导航栏 -->
      <van-nav-bar
        title="设置昵称"
        left-text="取消"
        right-text="完成"
        @click-left="$emit('close')"
        @click-right="onConfirm"
      />
      <!-- 输入框 -->
    <div class="field-wrap">
        <!-- 这里输入框不去直接绑定value，因为我们还要修改这个值，而修改这个值是在父组件中进行的，或者准确的说是v-modle在修改数据，不在本组件中进行，所以用其他变量代替 ，再把该变量绑定  value-->
      <van-field
        v-model.trim="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
    <!-- /输入框 -->
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name:'updateName',
  components: {},
  props: {
      value: {
          type: String,
          required: true
      }
  },
  data() {
    return {
        localName: this.value
    };
  },
  watch: {},
  computed: {},
  methods: {
   async onConfirm() {
      this.$toast.loading({
      message: '保存中...',
      forbidClick: true, // 禁止背景点击
      duration: 0 // 持续展示
    })
      try {
        const localName = this.localName
        if(!localName.length) {
            this.$toast('昵称不能为空')
            return
        }
        // 发送更改请求
        await updateUserProfile({
            name: localName
        })
        // 更新视图
        this.$emit('input',localName)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch(err) {
          this.$toast.fail('修改失败')
      }
    },
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>
.field-wrap {
  padding: 20px;
}
</style>