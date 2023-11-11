<script>
import { useSpreadsheetStore } from "../stores/spreadsheetStore";
import { storeToRefs } from "pinia";

export default {
  name: "SpreadsheetUploader",
  data() {
    return {
      file: null,
      validFile: null,
      message: null,
      loading: null,
      placeholderLabel: "Choose or drop an .xls, .xlsx file...",
      known_extensions: ["xls", "xlsx"],
    };
  },
  setup() {
    const store = useSpreadsheetStore();

    // extract specific store properties
    const { isValid } = storeToRefs(store);

    return {
      // gives access only to specific state or getter
      isValid,
    };
  },

  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
      let extension = this.file.name.split(".");
      if (this.known_extensions.includes(extension[1])) {
        this.validFile = true;
        this.message = null;
      } else {
        this.validFile = false;
        this.message = this.placeholderLabel;
      }
    },

    async submitFile() {
      this.loading = true;
      const store = useSpreadsheetStore();
      const { validateSpreadsheet } = store;
      try {
        await validateSpreadsheet(this.file);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<template>
  <div class="card">
    <div class="mb-2">
      <form method="POST" enctype="multipart/form-data">
        <input
          class="form-control"
          type="file"
          id="formFile"
          name="formFile"
          accept=".xls, .xlsx"
          aria-label="Upload"
          required
          @change="handleFileUpload($event)"
        />
        <p class="uploadMessage" v-if="message">{{ message }}</p>
        <button
          disabled
          v-show="!validFile"
          class="btn btn-outline-secondary"
          type="button"
        >
          Validate
        </button>
        <button
          v-show="(validFile && !loading) || (validFile && isValid)"
          class="btn btn-outline-secondary"
          type="button"
          @click="submitFile()"
        >
          Validate
        </button>
        <button
          v-show="loading && !isValid"
          class="btn btn-secondary"
          type="button"
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Loading...
        </button>
      </form>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  vertical-align: middle;
  max-width: max-content;
  padding: 1em;
}
.mb-2 {
  display: flex;
  justify-content: center;
  vertical-align: middle;
  margin-bottom: 0em;
}
.btn {
  margin-top: 1em;
  margin-bottom: 0;
}

.uploadMessage {
  margin-top: 1em;
}
</style>
