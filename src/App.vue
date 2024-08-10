<template>
    <Toaster />
    <Loading v-show="loadingStore.loading" />
    <Navbar />
    <RouterView />
    <span class="footer"
        >© 2024 Powered by
        <a href="https://opentdb.com/" target="_blank">Open Trivia Database</a>.
        Coded by
        <a href="https://molina.digital" target="_blank"
            >molina.digital</a
        ></span
    >
</template>

<script lang="ts" setup>
import { Toaster } from '@steveyuowo/vue-hot-toast'
import '@steveyuowo/vue-hot-toast/vue-hot-toast.css'
import Navbar from './components/Navbar.vue'
import { onMounted } from 'vue'
import { auth } from './services/firebase'
import { useUserStore } from './stores/user'
import { useAnalyticsStore } from './stores/analytics'
import Loading from '@/components/Loading.vue'
import { useLoadingStore } from './stores/loading'
import { useGameStore } from '@/stores/game'

const userStore = useUserStore()
const analyticsStore = useAnalyticsStore()
const loadingStore = useLoadingStore()
const gameStore = useGameStore()

onMounted(() => {
    auth.onAuthStateChanged((currentUser) => {
        loadingStore.setLoading(true)
        userStore.setUser(currentUser)
        if (!currentUser) {
            analyticsStore.setPersonalBest(0)
            analyticsStore.setAnalyticsTracking(false)
        } else {
            if (currentUser?.email) {
                analyticsStore.fetchPersonalBest(
                    currentUser.email,
                    gameStore.isTimedMode
                )
                analyticsStore.setAnalyticsTracking(true)
            }
        }
        loadingStore.setLoading(false)
    })
})
</script>

<style scoped lang="scss">
.footer {
    margin-top: auto;
    padding: 32px;
    text-align: center;
    font-size: 12px;
}
</style>
