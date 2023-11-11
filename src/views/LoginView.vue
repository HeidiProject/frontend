<script setup>
import LoginForm from "../components/LoginForm.vue";
</script>

<template>
  <main>
    <img
      class="heidi-logo"
      alt="HEIDI logo"
      src="../assets/Heidi-logo.png"
      height="200"
      width="200"
    />
    <LoginForm />
  </main>
</template>

<style scoped>
main {
  padding-top: 24px;
  display: grid;
  place-items: center;
}
</style>
