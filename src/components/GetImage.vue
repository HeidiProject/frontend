<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  _id: {
    type: String,
    required: true,
  },
});

const baseUrl = "https://heidi.psi.ch/auth/api/image/";
const location = ref(baseUrl + props._id);

watch(
  () => props._id,
  (newValue, oldValue) => {
    document.getElementById("myImg").src = baseUrl + newValue;
  }
);
</script>

<template>
  <img id="myImg" :src="location" />
</template>

<style scoped>
img {
  height: 400px;
}
</style>
