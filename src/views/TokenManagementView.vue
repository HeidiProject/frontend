<template>
  <div class="tokens-info">
    <n-card>
      <AccountDropdown @account-selected="onAccountSelected" @purpose-selected="onPurposeSelected" @create-token="onCreateToken" />
    </n-card>
    <n-card>
      <TokenTable :tokens="tokens" @delete-token="onDeleteToken" />
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AccountDropdown from '../components/AccountDropdown.vue';
import TokenTable from '../components/TokenTable.vue';
import { useAuthStore } from "../stores/authStore";
import axiosWrapper from '../helpers/axiosWrapper';
import { NCard } from "naive-ui";

const auth = useAuthStore();
const { userIds } = auth;

const tokens = ref([]);
const selectedAccount = ref(null);
const selectedPurpose = ref(null);


const fetchTokens = (accountId) => {
  // Implement API call to fetch tokens for the selected account
  axiosWrapper.get_pgroup_tokens(accountId)
    .then(response => {
      tokens.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching tokens:', error);
    });
};

const onAccountSelected = (accountSelected) => {
  if (accountSelected) {
    fetchTokens(accountSelected);
    selectedAccount.value = accountSelected;
  }
};

const onPurposeSelected = (purposeSelected) => {
  if (purposeSelected) {
    selectedPurpose.value = purposeSelected;
  }
}

const onCreateToken = () => {
  // Implement API call to create a new API token for the selected account
  if (selectedAccount.value) {
    axiosWrapper.create_api_token(selectedAccount.value, selectedPurpose.value)
    .then(response => {
      // Refresh the tokens table after successfully creating the token
      fetchTokens(selectedAccount.value);
    })
    .catch(error => {
      console.error('Error creating API token:', error);
    });
  } else {
    console.error("Undefined account")
  }

};

const onDeleteToken = (deleteToken) => {
  const confirmation = window.confirm('Are you sure you want to delete this token?');

  if (confirmation) {
  // Implement API call to delete the selected token
  axiosWrapper.revoke_api_token(deleteToken)
    .then(response => {
      // Refresh the tokens table after successfully deleting the token
      fetchTokens(selectedAccount.value);
    })
    .catch(error => {
      console.error('Error deleting API token:', error);
    });
  }
};

onMounted(() => {
  selectedAccount.value = `p${userIds[0]}`;
  selectedPurpose.value = "self-use";
  fetchTokens(`p${userIds[0]}`)
});
</script>

<style scoped>
.tokens-info {
  display: grid;
  min-width: 600px;
  gap: 16px;
  justify-content: center;
}
</style>
