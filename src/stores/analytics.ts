import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDocs, limit, query, where } from 'firebase/firestore'
import { collection, db } from '@/services/firebase'

export const useAnalyticsStore = defineStore('analytics', () => {
    const trackAnalytics = ref(true)
    const personalBest = ref(0)

    function setAnalyticsTracking(value: boolean) {
        trackAnalytics.value = value
    }

    function setPersonalBest(value: number) {
        personalBest.value = value
    }

    async function fetchPersonalBest(email: string) {
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
                    // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`)
                    setPersonalBest(doc.data().score)
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

    return {
        trackAnalytics,
        setAnalyticsTracking,
        personalBest,
        setPersonalBest,
        fetchPersonalBest,
    }
})
