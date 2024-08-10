import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const STREAK_VALUE = 3

export const useGameStore = defineStore('game', () => {
    const gameStarted = ref(false)
    const streakMode = ref(0)
    const maxStreak = ref(0)
    const pointsTotal = ref(0)
    const isTimedMode = ref(false)

    const isOnARoll = computed(() => streakMode.value >= STREAK_VALUE)

    function setGameStarted(value: boolean) {
        gameStarted.value = value
        maxStreak.value = 0
    }

    function setStreakMode(reset = false) {
        if (reset) {
            streakMode.value = 0
        } else {
            streakMode.value++
        }

        if (
            streakMode.value >= STREAK_VALUE &&
            streakMode.value > maxStreak.value
        ) {
            maxStreak.value = streakMode.value
        }
    }

    function setPointsTotal(value: -1 | 0 | 1) {
        switch (value) {
            case -1:
                pointsTotal.value -= 1
                break
            case 0:
                pointsTotal.value = 0
                break
            case 1: {
                if (isOnARoll.value) {
                    pointsTotal.value += 2
                } else {
                    pointsTotal.value++
                }
                break
            }
            default:
                break
        }
    }

    function setTimedMode(value: boolean) {
        isTimedMode.value = value
    }

    return {
        gameStarted,
        setGameStarted,
        streakMode,
        setStreakMode,
        isOnARoll,
        pointsTotal,
        setPointsTotal,
        maxStreak,
        isTimedMode,
        setTimedMode,
    }
})
