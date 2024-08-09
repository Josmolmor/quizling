<template>
    <div class="leaderboard-container">
        <h1>Leaderboard</h1>
        <p v-if="isLoading">Loading leaderboards...</p>
        <ul v-else-if="leaderboard.length">
            <li
                v-for="(user, index) in leaderboard"
                :key="user.id"
                class="leaderboard-entry"
            >
                <span v-if="user.lastUpdated">{{
                    formatTimestamp(user.lastUpdated.toDate())
                }}</span>
                <span v-if="!user.lastUpdated && user.createdAt">{{
                    formatTimestamp(user.createdAt.toDate())
                }}</span>
                <span
                    >{{ user.name }}: {{ user.score }}
                    <span v-if="index === 0">🏅</span
                    ><span v-if="index === 1">🥈</span
                    ><span v-if="index === 2">🥉</span></span
                >
            </li>
        </ul>
        <p v-else>No scores submitted yet</p>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { auth, collection, db } from '../services/firebase'
import { getDocs, limit, orderBy, query } from 'firebase/firestore'
import { format } from 'date-fns'
import { useLoadingStore } from '@/stores/loading'

const store = useLoadingStore()
const isLoading = computed(() => store.loading)
const leaderboard = ref<any[]>([])

const fetchLeaderboard = async () => {
    store.setLoading(true)
    try {
        const q = query(
            collection(db, 'leaderboard'),
            orderBy('score', 'desc'),
            limit(10)
        )
        const snapshot = await getDocs(q)
        leaderboard.value = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as any
        )
    } catch (error) {
        console.error('Failed to fetch leaderboard', error)
    } finally {
        store.setLoading(false)
    }
}

const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'PPpp')
}

onMounted(() => {
    fetchLeaderboard()
    auth.onAuthStateChanged((currentUser) => {
        fetchLeaderboard()
    })
})
</script>

<style lang="scss" scoped>
.leaderboard-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
    align-items: center;

    h2 {
        margin: 0 auto 24px;
    }

    ul {
        padding: 0;
        margin: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;

        .leaderboard-entry {
            text-align: left;
            list-style: none;
            display: flex;
            flex-direction: column;

            > span:first-child {
                text-transform: uppercase;
                font-size: 12px;
                font-weight: bold;
                opacity: 0.5;
            }
        }
    }
}
</style>
