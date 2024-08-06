<template>
    <div class="leaderboard-container">
        <h2>Leaderboard</h2>
        <ul>
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
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { collection, db } from '../services/firebase'
import { getDocs, limit, orderBy, query } from 'firebase/firestore'
import { format } from 'date-fns'

const leaderboard = ref<any[]>([])

const fetchLeaderboard = async () => {
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
    }
}

const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'PPpp')
}

onMounted(() => {
    fetchLeaderboard()
})
</script>
