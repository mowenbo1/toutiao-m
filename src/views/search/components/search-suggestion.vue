<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(text,index) in suggestions"
      :key="index" 
      icon="search"
      @click="$emit('search',text)" 
    >
    <!-- 此处的$emit事件是在点击搜索框底下的建议文字时，也能进行搜索 -->
     <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
     <!-- 双花括号绑定会直接输出纯文本内容 -->
    <!-- <div>{{htmlStr}}</div> -->
    <!-- 使用 v-html 指令可以绑定渲染带有 HTML 标签的字符串 -->
    <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 按需加载 防抖函数
import { debounce } from 'lodash'
export default {
  name:'SearchSuggestion',
  components: {},
  props: {
      searchText:{
          type:String,
          required:true
      }
  },
  data() {
    return {
        suggestions: [],//联想建议数据列表
         htmlStr: 'Hello <span style="color: red">World</span>'
    };
  },
  watch: {
       //   由于我们要监测searchText的变化，因此在监听事件中监听变化
       //   注意：handler函数名称是固定的
       searchText:{
        //    handler (value) {
        //        this.loadSearchSuggestions(value)
        //    },
        // 使用防抖函数
         // debounce 函数
      // 参数1：一个函数
      // 参数2：延迟时间，单位是毫秒
      // 返回值：防抖之后的函数
            handler:debounce(function(value){
               this.loadSearchSuggestions(value)
            },200),
           immediate: true //该回调函数会在监听之后立即调用
       }
  },
  computed: {},
  methods: {
      async loadSearchSuggestions (q) {
          try {
             const {data} =  await getSearchSuggestions(q)
             this.suggestions = data.data.options
          }catch(err){
              console.log(err)
              this.$toast('搜索建议数据获取失败，请稍后重试')
          }
      },
       // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //    参数2：匹配模式，要写到字符串中
      highlight (text) {
          const highlightStr = `<span class= "active">${this.searchText}</span>`
          const reg = new RegExp(this.searchText,'gi')
          return text.replace(reg,highlightStr)
      }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>
    .search-suggestion {
       /deep/ span.active {
            color: #3296fa;
        }
    }
</style>