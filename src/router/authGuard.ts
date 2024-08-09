import type { NavigationGuard } from 'vue-router'
import { auth } from '@/services/firebase'

export const authGuard: NavigationGuard = async (to, from, next) => {
    auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
            next()
        } else {
            next('/')
        }
    })
}
