import { createMemoryHistory, createRouter } from 'vue-router'
import Analytics from '../views/Analytics.vue'
import Quiz from '../views/Quiz.vue'
import Leaderboard from '../views/Leaderboard.vue'

const routes = [
    { path: '/', component: Quiz },
    { path: '/analytics', component: Analytics },
    { path: '/leaderboard', component: Leaderboard },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router
