<template>
    <nav>
        <RouterLink title="Home" to="/"
            ><svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path
                    d="M 12 2 A 1 1 0 0 0 11.289062 2.296875 L 1.203125 11.097656 A 0.5 0.5 0 0 0 1 11.5 A 0.5 0.5 0 0 0 1.5 12 L 4 12 L 4 20 C 4 20.552 4.448 21 5 21 L 9 21 C 9.552 21 10 20.552 10 20 L 10 14 L 14 14 L 14 20 C 14 20.552 14.448 21 15 21 L 19 21 C 19.552 21 20 20.552 20 20 L 20 12 L 22.5 12 A 0.5 0.5 0 0 0 23 11.5 A 0.5 0.5 0 0 0 22.796875 11.097656 L 12.716797 2.3027344 A 1 1 0 0 0 12.710938 2.296875 A 1 1 0 0 0 12 2 z"
                ></path></svg
        ></RouterLink>
        <RouterLink title="Leaderboard" to="/leaderboard">
            <svg
                width="24"
                height="24"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M15 21H9V12.6C9 12.2686 9.26863 12 9.6 12H14.4C14.7314 12 15 12.2686 15 12.6V21Z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M20.4 21H15V18.1C15 17.7686 15.2686 17.5 15.6 17.5H20.4C20.7314 17.5 21 17.7686 21 18.1V20.4C21 20.7314 20.7314 21 20.4 21Z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M9 21V16.1C9 15.7686 8.73137 15.5 8.4 15.5H3.6C3.26863 15.5 3 15.7686 3 16.1V20.4C3 20.7314 3.26863 21 3.6 21H9Z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M10.8056 5.11325L11.7147 3.1856C11.8314 2.93813 12.1686 2.93813 12.2853 3.1856L13.1944 5.11325L15.2275 5.42427C15.4884 5.46418 15.5923 5.79977 15.4035 5.99229L13.9326 7.4917L14.2797 9.60999C14.3243 9.88202 14.0515 10.0895 13.8181 9.96099L12 8.96031L10.1819 9.96099C9.94851 10.0895 9.67568 9.88202 9.72026 9.60999L10.0674 7.4917L8.59651 5.99229C8.40766 5.79977 8.51163 5.46418 8.77248 5.42427L10.8056 5.11325Z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </RouterLink>
        <RouterLink v-if="user" title="Analytics" to="/analytics"
            ><svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-chart-histogram"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 3v18h18" />
                <path d="M20 18v3" />
                <path d="M16 16v5" />
                <path d="M12 13v8" />
                <path d="M8 16v5" />
                <path d="M3 11c6 0 5 -5 9 -5s3 5 9 5" /></svg
        ></RouterLink>
        <div class="user-data" v-if="user">
            <p>{{ user.displayName }}</p>
            <button
                class="sign-out"
                @click="signOut"
                v-if="!gameStore.gameStarted"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="svg-snoweb svg-theme-light"
                    x="0"
                    y="0"
                    width="24px"
                    height="24px"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <path
                        d="M67.8,64.3,82.1,50m0,0L67.8,35.7M82.1,50H32.2M53.6,64.3v3.5A10.7,10.7,0,0,1,42.9,78.5H28.6A10.7,10.7,0,0,1,17.9,67.8V32.2A10.7,10.7,0,0,1,28.6,21.5H42.9A10.7,10.7,0,0,1,53.6,32.2v3.5"
                        stroke="currentColor"
                        fill="transparent"
                        class="svg-stroke-primary"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="8"
                    />
                </svg>
            </button>
        </div>
        <button class="login-button" v-else-if="!gameStore.gameStarted" @click="signInWithGoogle">
            Log in with Google
        </button>
    </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { computed } from 'vue'
import {
    auth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as fbSignOut,
} from '../services/firebase'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const store = useUserStore()
const user = computed(() => store.user)
const gameStore = useGameStore()

// Sign in with Google
const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
        const result = await signInWithPopup(auth, provider)
        store.setUser(result.user)
    } catch (error) {
        console.error('Error during Google sign-in', error)
        alert('Sign-in failed. Please try again.')
    }
}

const signOut = async () => {
    try {
        await fbSignOut(auth)
        store.setUser(null)
        router.push('/')
    } catch (error) {
        console.error('Error during sign-out', error)
        alert('Sign-out failed. Please try again.')
    }
}
</script>

<style lang="scss" scoped>
@mixin flex {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
}

nav {
    @include flex;
    gap: 16px;
    margin-bottom: auto;
    padding: 16px 0;

    a {
        display: flex;
        align-items: center;
        padding: 4px;

        svg {
            transition: color 0.2s ease;
            color: var(--icon-color);
        }

        &:hover {
            svg {
                color: var(--main);
            }
        }

        &.router-link-active {
            svg {
                color: var(--main);
            }
        }
    }

    .user-data {
        @include flex;
        gap: 12px;
        margin-left: auto;

        p {
            margin: 0;
        }

        .sign-out {
            padding: 4px;
            font-size: 14px;
            background-color: transparent;
            border: none;
            cursor: pointer;
        }
    }

    a ~ button {
        margin-left: auto;
    }

    button {
        display: flex;
        align-items: center;
        border: none;
        padding: 0;
        background: none;
        transition: color 0.25s;

        &:hover {
            background-color: transparent;
            color: var(--main);
        }

        > svg {
            height: 24px;
        }
    }

    .login-button {
        padding: 6px;
        cursor: pointer;
    }
}
</style>
