import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOKEN_USER'


export default new Vuex.Store({
    state: {
        user: getItem(TOKEN_KEY)
    },
    mutations: {
        setUser(state, data) {
            state.user = data
                //为了使页面刷新时该数据依然有效，需进行本地存存储
            setItem(TOKEN_KEY, state.user)
        }


    },
    actions: {},
    modules: {}
})