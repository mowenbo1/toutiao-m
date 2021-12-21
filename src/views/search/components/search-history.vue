<template>
  <div class="search-history">
      <van-cell title="搜索历史">
        <div v-if="isDeleteShow">
          <!-- <span @click="searchHistories = []">全部删除</span> 该方法是会报错的，因为我们对子组件的prop参数进行了赋值操作，这是不允许的，会给警告，应该子传父，在父组件中进行修改-->
          <span @click="$emit('clearSearchHistorier')">全部删除</span>
          &nbsp;
          &nbsp;
          <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon 
           name="delete" 
           v-else 
           @click="isDeleteShow = true">
        </van-icon>
      </van-cell>
      <van-cell 
        :title="item"
        v-for="(item,index) in  searchHistories"
        :key="index"
        @click="onSearchItemClick(item,index)"
      >
          <van-icon name="close" v-if="isDeleteShow"></van-icon>
      </van-cell>
  </div>
</template>

<script>
export default {
  name:'SearchHistory',
  components: {},
  props: {
    // Prop 数据
    //  Prop 是受父组件数据影响的
    //    如果是普通数据（数字、字符串、布尔值）绝对不能修改
    //    即便改了也不会传导给父组件
    //
    //    如果是引用类型数据（数组、对象）
    //        可以修改，例如 [].push(xxx)，对象.xxx = xxx
    //        不能重新赋值, xxx = []
    searchHistories: {
      type: Array,
      required:true
    }
  },
  data() {
    return {
      isDeleteShow:false //控制删除显示状态
    };
  },
  watch: {},
  computed: {},
  methods: {
    onSearchItemClick(item,index) {
      if(this.isDeleteShow){
        // 删除操作
        this.searchHistories.splice(index,1)
      }else {
        // 点击进入页面
        this.$emit('search',item)
      }
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>

</style>