<template>
    <div class="loading-container">
        <span class="loader"></span>
    </div>
</template>

<script setup lang="ts">
import calcPropertyValue from '@/utils/calcPropertyValue'
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        duration: string
        show: boolean
    }>(),
    {
        duration: '2.s',
        show: false,
    }
)
const spinnerStyle = {
    background: 'var(--main)',
    animationDuration: props.duration,
}

const divsStyles = computed(() => {
    const divsStyles = []
    for (let i = 3; i > 0; i--) {
        divsStyles.push(
            calcPropertyValue('animationDelay', props.duration, -0.1 * i)
        )
    }
    return divsStyles
})
</script>

<style lang="scss" scoped>
.loading-container {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;

    .loader {
        width: 48px;
        height: 48px;
        border: 3px dotted #fff;
        border-style: solid solid dotted dotted;
        border-radius: 50%;
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        animation: rotation 2s linear infinite;
    }
    .loader::after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        border: 3px dotted var(--main);
        border-style: solid solid dotted;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        animation: rotationBack 1s linear infinite;
        transform-origin: center center;
    }
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
@keyframes rotationBack {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(-360deg);
    }
}
</style>
