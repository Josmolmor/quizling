import { createWebHistory, createRouter } from 'vue-router'
import Quiz from '@/views/Quiz.vue'
import { authGuard } from '@/router/authGuard'

const routes = [
    { path: '/', name: 'Quiz', component: Quiz },
    {
        path: '/analytics',
        name: 'Analytics',
        component: () => import('@/views/Analytics.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/leaderboard',
        name: 'Leaderboard',
        component: () => import('@/views/Leaderboard.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        authGuard(to, from, next)
    } else {
        next()
    }
})

export default router
