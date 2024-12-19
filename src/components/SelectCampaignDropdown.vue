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

const campaigns = [
      ]


function convertCampaignsToOptions() {
  var stack = campaigns;
  var stackLength = stack.length - 1;
  var out = [];
  for (var i = 0; i <= stackLength; i++) {
    var label = stack[i];
    var value = stack[i];
    var tmp = { label: label, value: value };
    out.push(tmp);
  }
  return out;
}

const options = convertCampaignsToOptions();

const selected = ref([]);

const emit = defineEmits(["selectedCampaign"]);

function handleSelect(key) {
selected.value = String(key);
emit("selectedCampaign", String(key));
}
</script>  