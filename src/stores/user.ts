import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { User } from 'firebase/auth'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null)
    const userEmail = computed(() => user.value?.email ?? '')
    const displayName = computed(() => user.value?.displayName ?? '')

    function setUser(userPayload: User | null) {
        user.value = userPayload
    }

    return { user, userEmail, displayName, setUser }
})
