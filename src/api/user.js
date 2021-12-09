import request from '@/utils/request'
// import store from '@/store'
export const login = data => {
    return request({
        method: 'POST',
        url: '/v1_0/authorizations',
        data
    })
}

// 给用户发送验证码
export const sendSms = mobile => {
    return request({
        method: 'GET',
        url: `/v1_0/sms/codes/${mobile}`,
    })
}

// 获取用户自己的信息
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user'
            // headers: {
            //     // 注意：该接口需要授权才能访问
            //     // token的数据格式：Bearer token数据，注意 Bearer 后面有个空格  这里一定要引入store
            //     Authorization: `Bearer ${store.state.user.token}`

        // }可以进行优化了，在axios请求中同一配置就好了，拦截器
    })
}

/* 获取用户频道列表
 */
export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user/channels'
    })
}