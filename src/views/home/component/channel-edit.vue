<template>
  <div class="channel-edit">
    <!-- 这里面cell里面只有button，title，并没有grid -->
     <van-cell :border="false">
       <div slot="title" class="title">我的频道</div>
       <van-button 
        class="edit-btn"
        slot="default"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >
       {{ isEdit? '完成':'编辑'}}
       </van-button>
     </van-cell>
     <van-grid :gutter="10" class="my-grid">
         <van-grid-item
           class="grid-item"
           v-for="(channel,index) in myChannels" 
           :key="index"
           @click="onMyChannelClick(channel,index)"
           >
          <van-icon 
            v-show="isEdit && !fixedChannel.includes(channel.id)"
            slot="icon" 
            name="clear">
          </van-icon>
          <div 
            slot="text" 
            class="text"
            :class="{active: active === index}"
          >
            <span>{{channel.name}}</span>
          </div>
         </van-grid-item>
     </van-grid>
    

     <!-- 频道推荐 -->
      <van-cell :border="false">
       <div slot="title" class="title">频道推荐</div>
     </van-cell>
     <van-grid :gutter="10" class="recommend-grid">
       <van-grid-item
          class="grid-item" 
          icon="plus"
          v-for="(channel,index) in recommendChannels" 
          :key="index"  
          :text="channel.name" 
          @click="onAddChannel(channel)"
       />
      </van-grid>
     <!-- /频道推荐 -->
  </div>
</template>

<script>
import { getAllchannels , addUserChannel , deleteUserChannel} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name:'ChannelEdit',
  components: {},
  props: {
    // 这里要注意，父向子传值，需要在props属性里接收
     myChannels:{
        type:Array,
        required:true
      },
     active:{
       type:Number,
       required:true
     }
  },
  data() {
    return {
      allChannels:[],//获取所有的数组
      isEdit:false,//控制clear（删除图标是否出现的）
      fixedChannel:[0]
    };
  },
  watch: {},
  computed: {
    // 计算属性会观测内部依赖数据的变化，如果依赖的数据发生变化，则计算属性会重新执行
    // recommendChannels () {
    //   const channels = []//定义一个空数组
    // 这里书写错误  allChannels  写成了  Allchannels
    //   this.AllChannels.forEach(channel=>{
    //     const res = this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })
    //      if(!res) {
    //     // 这里定义了channel就不要再写this.了
    //     channels.push(channel)
    //   }
    //   })
     
    //   // 把计算结果返回   这里务必要有返回值
    //   return channels
    // }
    // 简化写法
    recommendChannels () {
     return this.allChannels.filter(channel=>{
        return !this.myChannels.find(myChannel=>myChannel.id === channel.id)
      })
    },
    ...mapState(['user'])

    // recommendChannels () {
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    //     // find 遍历数组，找到满足条件的元素项
    //     const ret = this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })

    //     // 如果我的频道中不包括该频道项，则收集到推荐频道中
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })

    //   // 把计算结果返回
    //   return channels
    // }

  },
  methods: {
   async loadAllChannels(){
      try {
        const { data } = await getAllchannels()
        this.allChannels = data.data.channels
      }catch(err) {
        console.log(err)
        this.$toast('获取所有频道数据失败')
      }
    },
  //  async onAddChannel(channel) {
    // 少了一个s ,seq:this.myChannel.length
  //     this.myChannels.push(channel)
  //     // 数据持久化处理
  //     if(this.user){
  //       try{
  //         await addUserChannel({
  //           id:channel.id,//频道ID
  //           seq:this.myChannel.length//序号，即我的频道的长度
  //       })
  //       }catch(err){
  //         this.$toast('保存失败，请稍后再试')
  //       }
       
  //     }else {
  //       setItem('TOUTIAO_CHANNELS',this.myChannels)
  //     }
  //     // 未登录，把数据存储到本地
  //     // 已登录，把数据请求接口放到线上

  //   },

     async onAddChannel (channel) {
      this.myChannels.push(channel)

      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录，把数据请求接口放到线上
          await addUserChannel({
            id: channel.id, // 频道ID
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick(channel,index){
      // console.log(channel,index);该语句用于判断是否将事件注册成功
      if(this.isEdit){
        // 如果是固定频道，则不删除
        if(this.fixedChannel.includes(channel.id)) {
          return
        }
        // 解决激活的频道索引值问题，删除当前索引频道的前一个小时，让索引减1，可以使激活状态改变
        if(index <= this.active){
          this.$emit('updateActive',this.active-1,true)
        }
        // 编辑状态，执行删除频道
        // 利用数组的splice方法
        this.myChannels.splice(index,1)

        // 4 处理持久化
        this.deleteChannel(channel)
      }else{
        this.$emit('updateActive', index, false)
      }
    },
    async deleteChannel(channel){
      try{
        if(this.user){
           // 已登录，则将数据更新到线上
         await deleteUserChannel(channel.id)
      }else{
        // 未登录，将数据更新到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
      }catch(err){
        this.$toast('删除数据失败，请稍后重试')
      }
    }
  },
  created() {
    this.loadAllChannels()
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
  .channel-edit {
    padding: 58px 0;
    .title {
      font-size: 32px;
      color: #333;
    }

    .edit-btn {
      width: 106px;
      height: 47px;
      font-size: 27px;
      color:#fdd1d1;
      border-color: #fdd1d1;
    }
    /deep/ .my-grid {
      .grid-item {
        .van-icon-clear {
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 30px;
          color: #cacaca;
          z-index: 2;
              }
      }
    }

    /deep/.grid-item {
      width: 160px;
      height: 86px;
      .van-grid-item__content {
        // 不让文字折行
        white-space: nowrap;
        background-color: #f4f5f6;
        .van-grid-item__text, .text {
          font-size: 28px;
          color: #222;
          margin-top: 0;
        }
        .active {
          color: red;
        }
        .van-grid-item__icon-wrapper {
          position: unset;
        }
      }
    }
    /deep/.recommend-grid {
      .grid-item {
        .van-grid-item__content {
          flex-direction: row;
          .van-icon-plus {
            font-size: 26px;
            margin-right: 6px;
          }
          .van-grid-item__text {
            margin-top: 0;
          }
        }
      }
    }
  }
</style>