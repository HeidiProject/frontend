<script setup>
import axiosWrapper from "../helpers/axiosWrapper";
import pdfIcon from "../assets/download-pdf-icon.svg";
import xlsIcon from "../assets/download-xls-icon.svg";

const props = defineProps({
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileClass: {
    type: String,
    required: true,
  },
  downloadIcon: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
});

var iconImage = "";
switch (props.downloadIcon) {
  case "pdfIcon":
    iconImage = pdfIcon;
    break;
  case "xlsIcon":
    iconImage = xlsIcon;
    break;
}

function download() {
  return axiosWrapper.download_file(props.fileName, props.fileType);
}
</script>

<template>
  <img
    :class="props.fileClass"
    :src="iconImage"
    width="48"
    height="72"
    :alt="props.alt"
    @click="download"
  />
</template>

<style scoped>
img:hover {
  cursor: pointer;
}
</style>
