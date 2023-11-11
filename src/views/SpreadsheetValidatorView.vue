<script setup>
import SpreadsheetDownload from "../components/SpreadsheetDownload.vue";
import SpreadsheetValidator from "../components/SpreadsheetValidator.vue";
import InstructionsDownload from "../components/InstructionsDownload.vue";
</script>

<template>
  <div class="alert alert-primary" role="alert">
    Welcome to HEIDI - watch this space for new features! <br />
    You can help contribute by filling out our
    <a
      target="_blank"
      href="https://docs.google.com/document/d/1Ov7pJ0hDooZFNZ8fwbUtvDO0Dbatu6JS_SA2LgyOOwc/edit?usp=sharing"
      class="alert-link"
      >User Survey</a
    >
  </div>
  <div class="home">
    <img
      class="heidi-logo"
      alt="HEIDI logo"
      src="../assets/Heidi-logo.png"
      height="200"
      width="200"
    />
    <SpreadsheetDownload />
    <InstructionsDownload />
    <SpreadsheetValidator />
  </div>
</template>

<style scoped>
.home {
  display: grid;
  place-items: center;
  gap: 16px;
  justify-content: center;
}
</style>
