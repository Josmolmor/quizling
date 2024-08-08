import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
    const gameStarted = ref(false)

    function setGameStarted(value: boolean) {
        gameStarted.value = value
    }

    return { gameStarted, setGameStarted }
})
