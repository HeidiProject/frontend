<script setup>
import { useAuthStore } from "../stores/authStore";
import { ref } from "vue";

const store = useAuthStore();

const { login } = store;

const user = ref("");
const password = ref("");
const login_msg = ref("");

function authenticateUser() {
  login().then((response) => {
    if (!response) {
      login_msg.value = "Incorrect username or password. Please try again.";
    }
  });
}
</script>

<template>
  <div class="loginCard">
    <form @submit.prevent="authenticateUser()">
      <button>Login</button>
    </form>
  </div>
  <p>{{ login_msg }}</p>
</template>

<style scoped>
.loginCard {
  display: grid;
  place-items: center;
}

form {
  margin-top: 25px;
  min-width: min-content;
  border: 1px solid;
  border-radius: 5px;
  border-color: lightgray;
  padding-top: 15px;
  background-color: #ffffff;
  width: 50%;
}
input {
  margin-top: 0.5em;
  height: 40px;
  width: 80%;
  min-width: min-content;
  border: 1px solid;
  border-radius: 3px;
  border-color: lightgray;
  text-indent: 0.5em;
}
button {
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 15px;
  margin-right: 15px;
  background-color: #2f6089;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-weight: 800;
  color: white;
  text-align: center;
}
</style>
