import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { collection, db } from '@/services/firebase'
import { useUserStore } from '@/stores/user'

export const useAnalyticsStore = defineStore('analytics', () => {
    const userStore = useUserStore()

    const trackAnalytics = ref(true)
    const personalBest = ref(0)
    const highestStreak = ref(0)

    function setAnalyticsTracking(value: boolean) {
        trackAnalytics.value = value
    }

    function setPersonalBest(value: number) {
        personalBest.value = value
    }

    async function fetchPersonalBest(email: string, timed: boolean) {
        try {
            const firestoreEmailValue = email.replace(/\./g, '_')
            const q = query(
                collection(db, 'leaderboard'),
                where('__name__', '==', firestoreEmailValue),
                limit(1)
            )
            const snapshot = await getDocs(q)
            if (!snapshot.empty) {
                snapshot.forEach((doc) => {
                    if (timed) {
                        setPersonalBest(doc.data().normalScore)
                    } else {
                        setPersonalBest(doc.data().timedScore)
                    }
                })
            } else {
                console.log('No documents found')
            }
        } catch (error) {
            console.error(
                `Failed to fetch the personal best for user ${email}`,
                error
            )
        }
    }

    async function fetchHighestStreak(): Promise<number> {
        try {
            const q = query(
                collection(db, 'analytics'),
                where('email', '==', userStore.userEmail),
                where('streak', '>', 0),
                orderBy('answeredAt', 'desc')
            )
            const snapshot = await getDocs(q)
            const res = snapshot.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() }) as any
            )
            const max: number = res
                .filter((streak) => streak)
                .reduce((maxStreak, entry) => {
                    return Math.max(maxStreak, entry.streak)
                }, 0)
            highestStreak.value = max
            return max
        } catch (error) {
            console.error('Failed to fetch highest streak', error)
            return 0
        }
    }

    return {
        trackAnalytics,
        setAnalyticsTracking,
        personalBest,
        setPersonalBest,
        fetchPersonalBest,
        fetchHighestStreak,
        highestStreak,
    }
})
