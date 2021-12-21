import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: "/login",
        name: 'login',
        component: () =>
            import ('@/views/login')
    },
    {
        path: '/search',
        name: 'search',
        component: () =>
            import ('@/views/search')
    },
    {
        path: '/article/:articleId',
        name: 'article',
        component: () =>
            import ('@/views/article'),
        props: true
    },
    {
        // 这里差个斜杠
        path: '/user/profile',
        name: 'user-profile',
        component: () =>
            import ('@/views/user-profile')
    },
    {
        path: "/",
        // name: "layout", 如果父路由有默认的子路由，他的name没有意义
        component: () =>
            import ('@/views/layout'),
        children: [{
                path: '', //默认子路由，只能有一个，这样的话就是打开之后默认在home页面，类似于redirect
                name: 'home',
                component: () =>
                    import ('@/views/home')
            },
            {
                path: '/qa',
                name: 'qa',
                component: () =>
                    import ('@/views/qa')
            },
            {
                path: '/video',
                name: 'video',
                component: () =>
                    import ('@/views/video')
            },
            {
                path: '/my',
                name: 'my',
                component: () =>
                    import ('@/views/my')
            },

        ]
    },
]

const router = new VueRouter({
    routes
})

export default router