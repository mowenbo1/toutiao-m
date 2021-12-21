// 封装axios请求模块
import axios from "axios"
import store from '@/store'
import JSONBig from 'json-bigint'
// JSON.parse()
// JSON.stringify()
// const jsonStr = '{"art_id": 1235953273786007552 }'
// console.log(JSON.parse(jsonStr)); //art_id: 1235953273786007600
// // JSONBig 可以处理数据中超出 JavaScript 安全整数范围的问题
// // JSONBig.parse()   转为javascript对象
// console.log(JSONBig.parse(jsonStr))
//     // 使用的时候把BigNumber转换为字符串来使用
// console.log(JSONBig.parse(jsonStr).art_id.toString());
// //  JSONBig.stringify() 转为JSON格式的字符串
// console.log(JSONBig.stringify(JSONBig.parse(jsonStr)));
const request = axios.create({
    baseURL: "http://toutiao-app.itheima.net/", //基础路径
    // 自定义后端返回的原始数据
    // data: 后端返回的原始数据，说白了就是 JSON 格式的字符串
    transformResponse: [function(data) {
        try {
            // 把数字转成对象解决数字过大转换错误
            return JSONBig.parse(data)
        } catch (err) {
            return data
        }

        // axios 默认会在内部这样来处理后端返回的数据
        // return JSON.parse(data)
    }]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function(config) {
    // 请求发起会经过这里
    // config：本次请求的请求配置对象
    // 结构出来的user
    // {user:{
    //       token:sdfafd
    //        reftoken:adfaf
    //}

    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    // console.log(config);
    // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
    return config
}, function(error) {
    // 如果请求出错了（还没有发出去）会进入这里,这部分代码一般不用动就可以了
    return Promise.reject(error)
})


export default request