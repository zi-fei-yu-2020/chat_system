import { createRouter, createWebHashHistory } from "vue-router";
import Home from "/src/pages/Home.vue"
import Login from "/src/pages/Login.vue"
import NotFound from "/src/pages/NotFound.vue"



const routes = [
    {
        path: '/',
        name: 'home',
        redirect: "/home",
        component: Home,
        children: [
            {
                path: '/home',
                name: 'home',
                component: Home,
                meta: {
                    isShow: true,
                    title: '首页'
                }
            }
        ]
    },
    {
        path: "/login",
        component: Login,
        name: "login"
    },
    {
        path: '/:catchAll(.*)',
        component: NotFound,
    }]




const router = createRouter({
    history: createWebHashHistory(),
    routes,  //routes:routes的缩写
});


export default router;