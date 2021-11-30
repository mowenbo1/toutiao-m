module.exports = {
    plugins: {
        // 此插件vue-cli已经配置过了，不需要再重复配置了，这里会发处警告，但是不会报错的
        // 'autoprefixer': { 
        //     browsers: ['Android >= 4.0', 'iOS >= 8']
        // },
        'postcss-pxtorem': {
            // lib-flexible 的 REM 适配方案：把一行分为 10 份，每份就是十分之一
            // 所以 rootValue 应该设置为你的设计稿宽度的十分之一
            // 我们的设计稿是 750，所以应该设置为 750 / 10 = 75
            // 但是 Vant 建议设置为 37.5，为什么？因为 Vant 是基于 375 写的
            // 所以必须设置为 37.5，唯一的缺点就是使用我们设计稿的尺寸都必须 / 2
            // 有没有更好的办法？
            //   如果是 Vant 的样式，就按照 37.5 来转换
            //   如果是 我们自己 的样式，就按照 75 来转换
            // 通过查阅文档，我们发现 rootValue 支持两种类型：
            //    数字：固定的数值
            //    函数：可以动态处理返回
            //          postcss-pxtorem 处理每个 CSS 文件的时候都会来调用这个函数
            //          它会把被处理的 CSS 文件相关的信息通过参数传递给该函数
            // 这里面要注意是通过函数得到的rootValue的值，是通过一个函数得到的，含有vant组件的就是37.5,不含vant的就是设计稿的尺寸/10
            // rootValue: 37.5,
            rootValue({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75
            },
            propList: ['*']
        }
    }
}