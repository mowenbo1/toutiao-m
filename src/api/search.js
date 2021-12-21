// 搜索模块请求封装
import request from '@/utils/request'

// 用户请求搜索
// 这里参数为q是因为接口就是这样规定的
export const getSearchSuggestions = q => {
    return request({
        method: 'GET',
        url: '/v1_0/suggestion',
        params: {
            q
        }
    })
}

export const getSearchResult = params => {
    return request({
        method: 'GET',
        url: '/v1_0/search',
        params
    })
}