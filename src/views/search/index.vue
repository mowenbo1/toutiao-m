<template>
  <div class="search-container">
      <!-- 搜索栏 -->
    <!--
      Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
     -->
    <form class="search-form" action="/">
        <van-search
          v-model="searchText"
          show-action
          placeholder="请输入搜索关键词"
          background="#3296fa"
          @search="onSearch"
          @cancel="onCancel"
          @focus = "isResultShow = false"
        />
    </form>
     <!-- /搜索栏 -->
     <!-- 搜索结果组件 -->
    <SearchResult 
        v-if="isResultShow"
        :q = "searchText"
    ></SearchResult>
    <!-- 搜索结果组件 -->
      <!-- 搜索建议组件 -->
    <SearchSuggestion 
        v-else-if="searchText"
        :searchText = "searchText"
        @search = "onSearch"
    ></SearchSuggestion>
     <!-- 搜索建议组件 -->
     <!-- 搜索历史组件 -->
     <SearchHistory 
        v-else
        :searchHistories = " searchHistories"
        @clearSearchHistorier = "searchHistories = []"
        @search = "onSearch"
     >
     </SearchHistory>
     <!-- 搜索历史组件 -->
    
   
  </div>
</template>

<script>
import SearchHistory from './components/search-history.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchResult from './components/search-result.vue'
import { setItem, getItem } from '@/utils/storage'

export default {
  name:'SearchIndex',
  components: {
      SearchHistory,
      SearchSuggestion,
      SearchResult
  },
  props: {},
  data() {
    return {
         searchText: '',
         isResultShow: false,//控制搜索结果的展示
         searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] //搜索的历史记录数据
    };
  },
  watch: {
      searchHistories (value) {
          setItem('TOUTIAO_SEARCH_HISTORIES',value)
      }

  },
  computed: {},
  methods: {
    onSearch(val) {
    // 这里是让在点击搜索建议的时候能够使搜索框内的文本变为点击的文本
    // 更新文本框的内容
     this.searchText = val
    //  存储搜索历史记录
    // 要求：不要有重复的历史记录，最新的排在前面
    const index = this.searchHistories.indexOf(val)
    if(index !== -1) { 
        this.searchHistories.splice(index,1)
    }
    this.searchHistories.unshift(val)
    //  渲染显示搜索结果
     this.isResultShow = true
    },
    onCancel() {
        // 这里需要注意，要是打印该函数，需要'cancel'
     this.$router.back()
    }, 
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>
.search-container {
    padding-top: 108px;
    .van-search__action {
        color: #fff;
    }
    .search-form {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }
}
</style>