<!-- https://dev.to/adetutu777/how-to-create-a-responsive-navbar-in-vue-js-with-bootstrap-11g4 -->

<script setup>
import { version } from "../../package.json";
import FeatureFlag from "./FeatureFlag.vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "../stores/authStore";
const auth = useAuthStore();
const heidi_version = version;
const { logout } = auth;
</script>

<template>
  <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <a class="navbar-brand" href=".">
        <img src="../assets/PSI-logo.svg" alt="PSI logo" />Heidi v{{
          heidi_version
        }}
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarToggler"
        aria-controls="navbarToggler"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarToggler">
        <div class="navbar-nav me-auto">
          <RouterLink
            class="nav-item nav-link"
            v-show="auth.isAuthenticated"
            :to="{ name: 'validator' }"
            >Validator</RouterLink
          >
          <RouterLink
            class="nav-item nav-link"
            v-show="auth.isAuthenticated"
            :to="{ name: 'docs' }"
            >Docs</RouterLink
          >
          <FeatureFlag name="processingResults">
            <RouterLink
              class="nav-item nav-link"
              v-show="auth.isAuthenticated"
              :to="{ name: 'data-processing' }"
              >Data Processing</RouterLink
            >
          </FeatureFlag>
          <FeatureFlag name="vespaProcessingResults">
            <RouterLink
              class="nav-item nav-link"
              v-show="auth.isAuthenticated"
              :to="{ name: 'vespa-processing' }"
              >VESPA</RouterLink
            >
          </FeatureFlag>
          <FeatureFlag name="arrivalPanelView">Arrivals Panel</FeatureFlag>
          <FeatureFlag name="tokenManagement">
            <RouterLink
              class="nav-item nav-link"
              v-show="auth.isAuthenticated"
              :to="{ name: 'token-management' }"
              >API Tokens</RouterLink
            >
          </FeatureFlag>
        </div>

        <RouterLink
          class="nav-item nav-link"
          v-show="!auth.isAuthenticated"
          to="/"
          >Login</RouterLink
        >
        <RouterLink
          class="nav-item nav-link"
          v-show="auth.isAuthenticated"
          @mouseup="logout"
          to="/"
          >Logout</RouterLink
        >
      </div>
    </div>
  </nav>
</template>

<style scoped>
img {
  width: 50%;
  height: 50%;
}

div.test {
  width: 100px;
}

a.navbar-brand {
  display: flex;
  justify-content: left;
  width: 180px;
}

.container {
  display: flex;
  margin: 0;
  justify-content: space-between;
  max-width: var(--vp-screen-max-width);
}
</style>
