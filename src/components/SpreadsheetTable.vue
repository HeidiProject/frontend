<template>
  <div class="spreadsheet-table container text-center overflow-auto">
    <!-- <h1 class="mt-5 fw-bolder text-success "></h1> -->
    <div class="table-responsive">
      <!-- The table component -->
      <SamplesTable :fields="fields" :data="sampleData"></SamplesTable>
    </div>
  </div>
</template>

<script>
import { useSpreadsheetStore } from "../stores/spreadsheetStore";
import { storeToRefs } from "pinia";

import { defineComponent } from "vue";
import SamplesTable from "./SamplesTable.vue";

export default defineComponent({
  components: {
    SamplesTable,
  },
  name: "SpreadsheetTable",
  setup() {
    const store = useSpreadsheetStore();

    // extract specific store properties
    const { isValid, displaySpreadsheetModel, displayTableHeaders } =
      storeToRefs(store);

    //An array of values for the data
    const sampleData = displaySpreadsheetModel;
    const fields = displayTableHeaders;

    return {
      // gives access only to specific state or getter
      isValid,
      displayTableHeaders,
      displaySpreadsheetModel,
      sampleData,
      fields,
    };
  },
  methods: {
    rowClass(item) {
      // colors rows puck by puck
      if (!item) return;
      if (item.color === "odd") return "table-success";
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.spreadsheet-table {
  font-family: Inconsolata, monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 90%;
  max-height: 500px;
  margin-top: 0;
}
</style>
