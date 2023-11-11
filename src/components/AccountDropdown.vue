<template>
    <div class="token-handling">
      <div class="account-selector">
        <label for="account">Select an account:</label>
        <n-select
          :options="accounts"
          :default-value="selectedAccount"
          :consistent-menu-width="false"
          @update:value="handleSelect"
          >
        </n-select>
      </div>
      <div class="purpose-selector">
        <label for="purpose">Select token purpose:</label>
        <n-select
          :options="options"
          :default-value="selectedPurpose"
          :consistent-menu-width="false"
          @update:value="handlePurpose"
          >
        </n-select>
      </div>
      <div class="create-token">
        <label for="create">Create API Token</label>
        <br>
          <button @click="emit('createToken')">Generate New Token</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuthStore } from "../stores/authStore";
  import { NSelect } from "naive-ui";
  
  const auth = useAuthStore();
  const { userIds } = auth;

  const accounts = ref(convertAccountsToOptions());
  const selectedAccount = ref(`p${userIds[0]}`);
  const selectedPurpose = ref("self-use");

  const emit = defineEmits(["accountSelected","purposeSelected","createToken"]);
  
  const options = [{label: "self-use", value: "self-use"}, {label: "CRIMS", value: "CRIMS"}, {label: "LIMS", value: "LIMS"}]
  
  function handleSelect(key) {
    emit("accountSelected", String(key));
  } 

  function handlePurpose(key) {
    emit("purposeSelected", String(key))
  }

  function convertAccountsToOptions() {
    return userIds.map(accountId => ({ label: `p${accountId}`, value: `p${accountId}` }));
  }
</script>

<style scoped>
.token-handling {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  column-gap: 2em;
  row-gap: 0px;
  max-width: 1fr;
  align-content: center;
}
button {
  background-color: #2f6089;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-weight: 800;
  color: white;
  text-align: center;
}
</style>