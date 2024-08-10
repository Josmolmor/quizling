<template>
    <div class="countdown-timer" :class="{ 'hurry-up': shouldHurryUp }">
        <div class="time"><StopwatchIcon /> {{ formattedTime }}</div>
        <div class="controls">
            <input
                v-show="false"
                type="number"
                v-model.number="initialTime"
                placeholder="Set time (seconds)"
            />
            <button
                v-show="false"
                @click="start"
                :disabled="isRunning || time <= 0"
            >
                Start
            </button>
            <button v-show="false" @click="pause" :disabled="!isRunning">
                Pause
            </button>
            <button v-show="false" @click="reset">Reset</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, Ref, onMounted } from 'vue'
import StopwatchIcon from '@/components/StopwatchIcon.vue'

const props = defineProps<{
    initialTime: number
    pendingAnswers: number
}>()

const emit = defineEmits<{
    (e: 'onStart', { time }: { time: string }): void
    (e: 'onPause', { time }: { time: string }): void
    (e: 'onReset', { time }: { time: string }): void
    (e: 'onFinished', { time }: { time: string }): void
}>()

const initialTime = ref(props.initialTime) // Default initial time (in seconds)
const time = ref(initialTime.value)
const interval: Ref<NodeJS.Timeout | null> = ref(null)
const isRunning = ref(false)

const formattedTime = computed(() => {
    const minutes = Math.floor(time.value / 60)
    const seconds = time.value % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const start = () => {
    if (isRunning.value || time.value <= 0) return

    isRunning.value = true
    interval.value = setInterval(() => {
        if (time.value > 0) {
            time.value--
        } else {
            clearInterval(interval.value)
            isRunning.value = false
            emit('onFinished', { time: formattedTime.value })
        }
    }, 1000)

    emit('onStart', { time: formattedTime.value })
}

const pause = () => {
    if (!isRunning.value) return

    isRunning.value = false
    clearInterval(interval.value)

    emit('onPause', { time: formattedTime.value })
}

const reset = () => {
    clearInterval(interval.value)
    time.value = initialTime.value
    isRunning.value = false

    emit('onReset', { time: formattedTime.value })
}

onMounted(() => {
    start() // Automatically start the countdown on component mount
})

onUnmounted(() => {
    clearInterval(interval.value)
})

// Watch for changes in initial time to update the countdown timer
watch(initialTime, (newValue) => {
    if (newValue <= 0) {
        time.value = 0
    } else if (!isRunning.value) {
        time.value = newValue
    }
})

const shouldHurryUp = computed(() => props.pendingAnswers * 5 - 1 > time.value)
</script>

<style lang="scss" scoped>
@keyframes tilt-shaking {
    0% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(4deg);
    }
    50% {
        transform: rotate(0deg);
    }
    75% {
        transform: rotate(-4deg);
    }
    100% {
        transform: rotate(0deg);
    }
}

.countdown-timer {
    text-align: center;
    margin-bottom: 32px;

    &.hurry-up {
        color: var(--main);
        animation: tilt-shaking 0.25s;
        animation-iteration-count: 1;
    }
}

.time {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    gap: 8px;

    > svg {
        width: 36px;
    }
}

.controls input {
    width: 120px;
    margin-bottom: 1em;
}

.controls button {
    margin: 0.5em;
}
</style>
