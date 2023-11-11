<script setup>
import FileDownload from "./FileDownload.vue";
</script>

<template>
  <div>
    Latest Spreadsheet Template Version 6 <br />
    Last updated: 16.02.2021
    <FileDownload
      fileName="V6_TELLSamplesSpreadsheetTemplate.xlsx"
      fileClass="xls-icon"
      fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      alt="xls-download"
      downloadIcon="xlsIcon"
    />
  </div>
</template>

<style scoped>
div {
  display: inline-flex;
  width: 300px;
}
</style>
