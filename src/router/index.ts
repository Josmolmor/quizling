import { createWebHistory, createRouter } from 'vue-router'
import Analytics from '@/views/Analytics.vue'
import Quiz from '@/views/Quiz.vue'
import Leaderboard from '@/views/Leaderboard.vue'

const routes = [
    { path: '/', name: 'Quiz', component: Quiz },
    { path: '/analytics', name: 'Analytics', component: Analytics },
    { path: '/leaderboard', name: 'Leaderboard', component: Leaderboard },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
