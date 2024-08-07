<template>
    <Toaster />
    <Navbar />
    <RouterView />
    <span class="footer"
        >© 2024 Powered by
        <a href="https://molina.digital" target="_blank">molina.digital</a> and
        <a href="https://opentdb.com/" target="_blank"
            >Open Trivia Database</a
        ></span
    >
</template>

<script setup>
import { Toaster } from '@steveyuowo/vue-hot-toast'
import '@steveyuowo/vue-hot-toast/vue-hot-toast.css'
import Navbar from './components/Navbar.vue'
</script>

<style scoped lang="scss">
.footer {
    margin-top: auto;
    padding: 32px;
    text-align: center;
}
</style>
