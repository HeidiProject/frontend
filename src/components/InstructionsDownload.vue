<script setup>
import FileDownload from "./FileDownload.vue";
</script>

<template>
  <div>
    Latest Spreadsheet Instructions Version 2.3 <br />
    Last updated: 16.02.2021
    <FileDownload
      fileName="TELL_Sample_Spreadsheet_User_Instructions.pdf"
      fileClass="pdf-icon"
      fileType="application/pdf"
      alt="pdf-download"
      downloadIcon="pdfIcon"
    />
  </div>
</template>

<style scoped>
div {
  display: inline-flex;
  width: 300px;
}
</style>
