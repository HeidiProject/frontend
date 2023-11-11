<template>
  <div class="copy-path">
    <div class="path-wrapper">
      <input
        class="rsyncpath"
        ref="inputRef"
        type="text"
        :value="rsyncPath"
        readonly
      />
    </div>
    <n-button class="clipboard-button" @click="handleCopy">
      <n-icon name="clipboard"><copy-icon /></n-icon>
      <span class="copy-text">copy</span>
    </n-button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { NButton, NIcon } from "naive-ui";
import { ClipboardOutline as CopyIcon } from "@vicons/ionicons5";

const props = defineProps({
  rsyncPath: {
    type: String,
    required: true,
  },
});

const inputRef = ref(null);

const handleCopy = () => {
  const inputElement = inputRef.value;
  inputElement.select();
  document.execCommand("copy");
};

</script>

<style scoped>
.copy-path {
  display: flex;
  align-items: center;
}

.path-wrapper {
  flex: 1;
  display: flex;
}

.rsyncpath {
  height: 34px;
  flex: 1;
  border: 1px solid #ccc; /* Add border style */
  background: none;
  padding: 0 5px; /* Add padding to give some space between text and border */
  margin-right: 0px;
}

.clipboard-button {
  margin-left: 0px;
  display: flex;
  align-items: center;
}

.copy-text {
  margin-left: 5px;
}
</style>
