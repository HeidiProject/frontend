<script setup>
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
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
