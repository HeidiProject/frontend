<script>
import { NCard, NButton, NGrid, NGridItem, NDivider } from "naive-ui";
import { useAuthStore } from "../stores/authStore";
import { useVespaProcessingStore } from "../stores/vespaProcessingStore";
import SelectAccountDropdown from "../components/SelectAccountDropdown.vue";

// We store the reference to the SSE client out here
// so we can access it from other methods
let sseClient;
const baseUrl = `${import.meta.env.VITE_API_URL}`;

const auth = useAuthStore();
const { uuidList, userSelectAccount } = auth;

const store = useVespaProcessingStore();

export default {
  data() {
    return {
      userAccount: "",
      uuid: "",
      data: [],
      messages: [],
    };
  },
  async mounted() {
    this.userAccount = "e" + userSelectAccount;
    for (let i = 0; i < uuidList.length; i++) {
      if (this.userAccount === uuidList[i]._id) {
        this.uuid = uuidList[i].uuid;
      }
    }
    await store.getVespaData(this.userAccount);
    this.data = store.data;

    // Streaming for VESPA with SSEs
    const url = baseUrl + "/api/streaming?userAccount=" +
    this.userAccount +
    "&uuid=" +
    this.uuid;

    console.log(url);

    // Create the SSE client
    const sseClient = this.$sse.create({
      url: url,
      format: "json",
      withCredentials: true,
    });

    // Catch any errors (ie. lost connections, etc.)
    sseClient.on("error", (e) => {
      console.error("lost connection or failed to parse!", e);
      // If this error is due to an unexpected disconnection, EventSource will
      // automatically attempt to reconnect indefinitely. You will _not_ need to
      // re-add your handlers.
    });

    sseClient.on("vespa", this.handleMessage);

    sseClient
      .connect()
      .then((sse) => {
        console.log(sse);
        console.log("We're connected!");
      })
      .catch((err) => {
        // When this error is caught, it means the initial connection to the
        // events server failed.  No automatic attempts to reconnect will be made.
        console.error("Failed to connect to server", err);
      });
  },
methods: {
  handleMessage(message) {
      this.data.unshift(message);
  },
  async handleAccount(selectedAccount) {
    this.userAccount = selectedAccount;
    for (let i = 0; i < uuidList.length; i++) {
      if (selectedAccount === uuidList[i]._id) {
        this.uuid = uuidList[i].uuid;
      }
    }
    await store.getVespaData(this.userAccount)
    this.data = store.data;
    if (!this.data) {
      this.data = [];
    }
    console.log("end of assigning this.data in vespa view:" + this.data)

    // Streaming for VESPA with SSEs
    const url = baseUrl + "/api/streaming?userAccount=" +
      this.userAccount +
      "&uuid=" +
      this.uuid;

    console.log(url);

    // Create the SSE client
    const sseClient = this.$sse.create({
      url: url,
      format: "json",
      withCredentials: true,
    });

    // Catch any errors (ie. lost connections, etc.)
    sseClient.on("error", (e) => {
      console.error("lost connection or failed to parse!", e);
      // If this error is due to an unexpected disconnection, EventSource will
      // automatically attempt to reconnect indefinitely. You will _not_ need to
      // re-add your handlers.
    });

    sseClient.on("vespa", this.handleMessage);

    sseClient
      .connect()
      .then((sse) => {
        console.log(sse);
        console.log("We're connected!");
      })
      .catch((err) => {
        // When this error is caught, it means the initial connection to the
        // events server failed.  No automatic attempts to reconnect will be made.
        console.error("Failed to connect to server", err);
      });
    
    }
  },
  components: {
    //VespaPerFrameGraph,
    SelectAccountDropdown,
    NCard,
    NButton,
    NGrid,
    NGridItem,
    NDivider,
  },
}
</script>

<template>
  <n-divider />
  <n-grid x-gap="12" cols="1 s:1 m:2 l:2 xl:2 2xl:2" responsive="screen">
    <n-grid-item>
      <n-card class="info-panel">
        <n-button @click="handleAccount(userAccount)">Refresh results</n-button>
      </n-card>
    </n-grid-item>
    <n-grid-item>
      <n-card class="info-panel">
        Processing results for e-account:
        <SelectAccountDropdown @selected-account="handleAccount" />
      </n-card>
    </n-grid-item>
  </n-grid>
  <div class="navigation-pane" v-if="data && data.length > 0">
    <div class="tab-pane" id="VESPA" role="tabpanel" aria-labelledby="vespa-tab">
      <div v-if="data">
        <!-- for="result in data" :key="result._id"> -->
        <table v-if="data" class="result-table table-bordered">
          <thead>
            <tr>
              <th>Processed</th>
              <th>Filename</th>
              <th>Run ID</th>
              <th>Crystfel Parameters</th>
              <th>MinPixCount</th>
              <th>Patterns</th>
            </tr>
          </thead>
          <tbody>
            <tr class="rows" v-for="result in data" :key="result._id">
              <td>
                {{ result.createdOn.slice(0, 10) }} &nbsp
                {{ result.createdOn.slice(11, 16) }}
              </td>
              <td> {{ result.filename }}</td>
              <td> {{ result.user_data.runID }} </td>
              <td> SNR: {{ result.user_data.crystfelMinSNR }}, TRSH: {{ result.user_data.crystfelTreshold }} </td>
              <td> {{ result.user_data.crystfelMinPixCount }} </td>
              <td> total: &nbsp {{ result.numberOfImages }}
            <br />
            indexed: &nbsp {{ result.numberOfImagesIndexed }}
            <br />
            percentage: &nbsp
            {{ (100 / result.numberOfImages * result.numberOfImagesIndexed).toFixed(2) }} %
          </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-panel {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.light-blue {
  height: 100%;
  background-color: lightsteelblue;
  display: flex;
  align-items: center;
  justify-content: center;
}
.result-table {
    font-family: Inconsolata, monospace;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    min-width: 100%;
    min-height: fit-content;
    border-spacing: 0px 10px;
    border-color: lightgrey;
  }
  th {
    min-width: fit-content;
    padding-left: 5px;
    padding-right: 5px;
  }
  td {
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
    min-width: fit-content + 10px;
  }
  .rows:hover {
  background-color: #e9ecef;
}
</style>
