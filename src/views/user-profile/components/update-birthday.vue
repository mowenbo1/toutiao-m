<template>
  <div class="update-birthday">
      <!--
      currentDate 双向绑定了日期选择器
        设置日期选择器的默认值
        同步日期选择器选择的日期
      min-date: 可选的最小日期
      max-date: 可选的最大日期
     -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
// 这里直接引入dayjs
// import dayjs from '@/utils/dayjs'
import dayjs from 'dayjs'
export default {
  name:'updateBirthday',
  components: {},
  props: {
      value:{
          type: String,
          required: true
      }
  },
  data() {
    return {
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    };
  },
  watch: {},
  computed: {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })

      try {
        const currentData = dayjs(this.currentData).format('YYYY-MM-DD')

        await updateUserProfile({
          birthday: currentData
        })

        // 更新视图
        this.$emit('input', currentData)

        // 关闭弹层
        this.$emit('close')

        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    },
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>

</style>