<template>
    <h3 v-if="tokens.length > 0">
      API Tokens for <b>{{ tokens[0].pgroup }}</b>
    </h3>
    <h3 v-else>
      No API Tokens available for this pgroup.
    </h3>
    <table v-if="tokens.length > 0" class="token-table table-bordered">
      <thead>
        <tr>
          <th>API Token</th>
          <th>Purpose</th>
          <th>Revoke Token</th>
        </tr>
      </thead>
      <tbody>
        <tr class="rows" v-for="token in tokens" :key="token._id">
          <td>
            <n-button @click="copyToClipboard(token.token_id)">
              <n-icon name="clipboard"><copy-icon /></n-icon>
              Copy
            </n-button>
            {{ token.token_id }}</td>
          <td>{{ token.purpose }}</td>
          <td>
            <button class="delete-button" @click="emit('deleteToken', token._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script setup>
  import { NButton, NIcon } from "naive-ui";
  import { ClipboardOutline as CopyIcon } from "@vicons/ionicons5";
  
  const { tokens } = defineProps(['tokens']);
  const emit = defineEmits(['deleteToken']);

  const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard!');
  }).catch((error) => {
    alert('Failed to copy to clipboard: ' + error);
  });
};

  </script>

  <style scoped>
  .token-table {
    font-family: Inconsolata, monospace;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    min-width: 100%;
    min-height: fit-content;
    border-spacing: 0px 10px;
    border-color: lightgrey;
  }
  th {
    min-width: fit-content;
    padding-left: 5px;
    padding-right: 5px;
  }
  .delete-button {
    background-color: #d64242;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    font-weight: 800;
    color: white;
    text-align: center;
  }
  td {
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
    min-width: fit-content + 10px;
  }
  .rows:hover {
  background-color: #e9ecef;
}
  </style>
  