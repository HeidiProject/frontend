<script setup>
import SpreadsheetUploader from "./SpreadsheetUploader.vue";
import SpreadsheetInfo from "./SpreadsheetInfo.vue";
import SpreadsheetTable from "./SpreadsheetTable.vue";
import { useSpreadsheetStore } from "../stores/spreadsheetStore";
import FeatureFlag from "./FeatureFlag.vue";
function isValid() {
  const store = useSpreadsheetStore();
  return store.isSpreadsheetValidated;
}
</script>

<template>
  <div class="validator">
    <SpreadsheetUploader />
    <FeatureFlag name="uploadSpreadsheet">
      <button>Upload</button>
    </FeatureFlag>
    <SpreadsheetInfo />
    <SpreadsheetTable v-show="isValid" />
  </div>
</template>

<style scoped>
.validator {
  display: grid;
  place-items: center;
  gap: 16px;
}
</style>
