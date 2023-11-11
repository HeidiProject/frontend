<template>
  <n-select
    :options="options"
    :default-value="options[0]['value']"
    :consistent-menu-width="false"
    @update:value="handleSelect"
  >
  </n-select>
</template>

<script setup>
import { NSelect } from "naive-ui";
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";

const auth = useAuthStore();
const { selectAccount, userIds } = auth;

function convertAccountsToOptions() {
  var stack = userIds;
  var stackLength = stack.length - 1;
  var out = [];
  for (var i = 0; i <= stackLength; i++) {
    var label = "e" + stack[i];
    var value = "e" + stack[i];
    var tmp = { label: label, value: value };
    out.push(tmp);
  }
  return out;
}

const options = convertAccountsToOptions();

const selected = ref([]);

const emit = defineEmits(["selectedAccount"]);

function handleSelect(key) {
  selectAccount(String(key));
  selected.value = String(key);
  emit("selectedAccount", String(key));
}
</script>
