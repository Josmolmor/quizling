<template>
    <div class="leaderboard-container">
        <h1>Leaderboard</h1>
        <div class="leaderboards-layout">
            <div>
                <h3>Normal</h3>
                <p v-if="isLoading">Loading normal leaderboard</p>
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
                            >{{ user.name }}: {{ user.normalScore }}
                            <span v-if="index === 0">🏅</span
                            ><span v-if="index === 1">🥈</span
                            ><span v-if="index === 2">🥉</span></span
                        >
                    </li>
                </ul>
                <p v-else>No scores submitted yet</p>
            </div>
            <div>
                <h3>Timed</h3>
                <p v-if="isLoading">Loading timed leaderboard</p>
                <ul v-else-if="timedLeaderboard.length">
                    <li
                        v-for="(user, index) in timedLeaderboard"
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
                            >{{ user.name }}: {{ user.timedScore }}
                            <span v-if="index === 0">🏅</span
                            ><span v-if="index === 1">🥈</span
                            ><span v-if="index === 2">🥉</span></span
                        >
                    </li>
                </ul>
                <p v-else>No scores submitted yet</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { auth, collection, db } from '@/services/firebase'
import { getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { format } from 'date-fns'
import { useLoadingStore } from '@/stores/loading'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const store = useLoadingStore()
const isLoading = computed(() => store.loading)
const leaderboard = ref<any[]>([])
const timedLeaderboard = ref<any[]>([])

const fetchNormalLeaderboard = async (timed = false) => {
    store.setLoading(true)
    try {
        const q = query(
            collection(db, 'leaderboard'),
            orderBy('normalScore', 'desc'),
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

const fetchTimedLeaderboard = async (timed = false) => {
    store.setLoading(true)
    try {
        const q = query(
            collection(db, 'leaderboard'),
            orderBy('timedScore', 'desc'),
            limit(10)
        )
        const snapshot = await getDocs(q)
        timedLeaderboard.value = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as any
        )
    } catch (error) {
        console.error('Failed to fetch timed leaderboard', error)
    } finally {
        store.setLoading(false)
    }
}

const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'PPpp')
}

const fetchLeaderboards = async () => {
    try {
        await Promise.all([fetchNormalLeaderboard(), fetchTimedLeaderboard()])
    } catch (error) {
        console.error('Error running fetch leaderboard queries:', error)
    }
}

onMounted(() => {
    fetchLeaderboards()
    auth.onAuthStateChanged((currentUser) => {
        fetchLeaderboards()
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

    .leaderboards-layout {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;

        h3 {
            text-transform: uppercase;
            font-size: 14px;
            font-weight: bold;
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
}
</style>
