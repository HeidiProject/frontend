<script setup>
const flags = {
  experimentSelection: false,
  uploadSpreadsheet: false,
  experimentView: false,
  arrivalPanelView: false,
  shippingForm: false,
  processingResults: true,
  tokenManagement: true,
  vespaProcessingResults: false,
};

const props = defineProps(["name"]);
</script>

<template>
  <slot v-if="flags[props.name]"></slot>
</template>
