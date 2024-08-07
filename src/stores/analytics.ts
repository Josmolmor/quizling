import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnalyticsStore = defineStore('analytics', () => {
    const trackAnalytics = ref(true)

    function setAnalyticsTracking(value: boolean) {
        trackAnalytics.value = value
    }

    return { trackAnalytics, setAnalyticsTracking }
})
