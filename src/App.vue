<script setup>
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import { useAuthStore } from "./stores/authStore";
import { ref, onMounted } from "vue";

const store = useAuthStore();

const { login } = store;

const login_msg = ref("");

function authenticateUser() {
  login().then((response) => {
    if (!response) {
      login_msg.value = "User not authorized. Please try again.";
    }
  });
}

onMounted(() => {
  authenticateUser();
})
</script>

<template>
  <NavBar />
  <div class="content">
    <RouterView />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Imprima, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

div {
  justify-content: left;
}

.content {
  margin-top: 63.5px;
}

@font-face {
  font-family: "Imprima";
  src: local("Imprima"),
    url(./assets/inconsolata-imprima/Imprima_400_normal.woff2) format("woff2");
  font-display: swap;
}

@font-face {
  font-family: "Inconsolata";
  src: local("Inconsolata"),
    url(./assets/inconsolata-oswald/Inconsolata_400_normal.woff2)
      format("woff2");
  font-display: swap;
}
</style>
