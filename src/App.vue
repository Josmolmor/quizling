<template>
  <Trivia />
  <span class="copyright"><a href="https://molina.digital" target="_blank">molina.digital</a> · 2024</span>
</template>

<script setup>
import Trivia from "./components/Trivia.vue";
</script>

<style scoped lang="scss">
.copyright {
  position: fixed;
  bottom: 8px;
  right: 8px;
  font-size: 14px;

  @media (prefers-color-scheme: light) {
    background-color: rgb(36 36 36 / 25%);
  }
}
</style>
