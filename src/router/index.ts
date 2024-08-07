import { createWebHistory, createRouter } from 'vue-router'
import Analytics from '@/views/Analytics.vue'
import Quiz from '@/views/Quiz.vue'
import Leaderboard from '@/views/Leaderboard.vue'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { authGuard } from '@/router/authGuard'

const routes = [
    { path: '/', name: 'Quiz', component: Quiz },
    {
        path: '/analytics',
        name: 'Analytics',
        component: Analytics,
        meta: { requiresAuth: true },
    },
    {
        path: '/leaderboard',
        name: 'Leaderboard',
        component: Leaderboard,
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
