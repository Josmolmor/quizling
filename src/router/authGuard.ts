import { useUserStore } from '@/stores/user'
import type { NavigationGuard } from 'vue-router'

export const authGuard: NavigationGuard = async (to, from, next) => {
    const userStore = useUserStore()
    if (userStore.user) {
        next()
    } else {
        next('/')
    }
}
