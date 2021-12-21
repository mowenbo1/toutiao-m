<template>
  <div class="user-profile">
      <!-- 导航栏 -->
    <van-nav-bar 
    class="page-nav-bar"
    title="个人信息" 
    left-arrow 
    right-text="保存" 
    @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <!-- 点击头像需要弹出选择上传文件夹的选项，进行事件委托，隐藏一个file类型的输入栏，并且给输入栏一个节点 -->
    <input
      type="file"
      hidden ref="file" 
      @change="onChange"
    />
    <!-- 个人信息 -->
      <van-cell 
        title="头像" 
        is-link
        @click="$refs.file.click()"
      >
        <van-image
          class="avatar"
          round
          fit="cover"
          :src="user.photo"
        />
      </van-cell>
      <van-cell 
        title="昵称" 
        :value="user.name" 
        is-link
        @click="isUpdateNameShow = true" 
      />
      <van-cell 
        title="性别" 
        :value="user.gender === 1? '女' :'男'" 
        is-link 
        @click="isUpdateGenderShow = true"
      />
      <van-cell 
        title="生日" 
        :value="user.birthday" 
        is-link 
        @click="isUpdateBirthdayShow = true"
      />
    <!-- /个人信息 -->

    <!-- 修改个人信息 -->
    <!-- 弹出层 -->
    <!-- 编辑昵称 van-popup弹出层 bottom从底往上弹-->
    <van-popup
      v-model="isUpdateNameShow"
      position="bottom"
      style="height: 100%"
    >
      <updateName
        v-if="isUpdateNameShow"
        v-model="user.name"
        @close="isUpdateNameShow = false"
      ></updateName>
    </van-popup>
    <!-- 编辑昵称 -->
      <!-- 编辑性别 van-popup弹出层 bottom从底往上弹-->
      <van-popup
        v-model="isUpdateGenderShow"
        position="bottom"
      >
        <updateGender
          v-if="isUpdateGenderShow"
          v-model="user.gender"
          @close="isUpdateGenderShow = false"
        ></updateGender>
      </van-popup>
      <!-- /编辑性别 -->
       <!-- 编辑生日 van-popup弹出层 bottom从底往上弹-->
      <van-popup
        v-model="isUpdateBirthdayShow"
        position="bottom"
      >
        <updateBirthday
          v-if="isUpdateBirthdayShow"
          v-model="user.birthday"
          @close="isUpdateBirthdayShow = false"
        ></updateBirthday>
      </van-popup>
      <!-- /编辑生日 -->
       <!-- 编辑头像 van-popup弹出层 bottom从底往上弹-->
      <van-popup
        v-model="isUpdatePhotoShow"
        position="bottom"
        style="height: 100%"
      >
        <updatePhoto
          v-if="isUpdatePhotoShow"
          :img="img"
          @close="isUpdatePhotoShow = false"
          @update-photo="user.photo=$event"
        ></updatePhoto>
      </van-popup>
      <!-- /编辑生日 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import updateName from './components/update-name.vue'
import updateGender from './components/update-gender.vue'
import updateBirthday from './components/update-birthday.vue'
import updatePhoto from './components/update-photo.vue'
export default {
  name:'UserProfileIndex',
  components: {
      updateName,
      updateGender,
      updateBirthday,
      updatePhoto
  },
  props: {},
  data() {
    return {
        user: {}, //用户个人信息
        isUpdateNameShow: false,
        isUpdateGenderShow: false,
        isUpdateBirthdayShow: false,
        isUpdatePhotoShow: false,
        img: null //修改头像时的图片
    };
  },
  watch: {},
  computed: {},
  methods: {
     async laodUserProfile () {
         try {
            const { data } = await getUserProfile()
            // console.log(data);
            this.user = data.data
         } catch (err) {
             this.$toast.fail('获取用户信息失败，请稍后重试')
         }
     },
     onChange () {
        // 获取文件对象
      const file = this.$refs.file.files[0]

      // 基于文章对象获取 blob 数据
       this.img = window.URL.createObjectURL(file)
      // console.log(data)
      // 展示图片的弹出层
      this.isUpdatePhotoShow = true
      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决办法就是每次使用完毕，把它的 value 清空
      this.$refs.file.value = ''
     }
  },
  created() {
      this.laodUserProfile()
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
   .van-popup {
    background-color: #f5f7f9;
  }
}
</style>