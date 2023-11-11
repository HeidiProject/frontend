<script setup>
import { NDatePicker } from "naive-ui";
import { ref } from "vue";

var d = new Date(); // today!
var x = 5; // go back 5 days!
const start = d.setDate(d.getDate() - x);
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const selectedDateRange = ref([start, tomorrow]);

const emit = defineEmits(["dateRange"]);
</script>

<template>
  Date range selection:
  <n-date-picker
    type="daterange"
    v-model:value="selectedDateRange"
    v-on:vnode-mounted="emit('dateRange', selectedDateRange)"
    @update:value="emit('dateRange', selectedDateRange)"
    clearable
  />
</template>
