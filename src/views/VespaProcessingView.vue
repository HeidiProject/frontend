<script>
import { NCard, NButton, NGrid, NGridItem, NDivider, NProgress, NDataTable } from "naive-ui";
import { useAuthStore } from "../stores/authStore";
import { useVespaProcessingStore } from "../stores/vespaProcessingStore";
import SelectAccountDropdown from "../components/SelectAccountDropdown.vue";
import { resultIsComplete } from "../helpers/mxdbScripts";

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
      columns: ['Run Number','Acquisitions']
      // columns: ['Date & Time','Run Number','Filename','Unit Cell Indexing Mean','Total images','Indexed images','% indexed','Progress']
    };
  },
  async mounted() {
    this.userAccount = "p" + userSelectAccount;
    for (let i = 0; i < uuidList.length; i++) {
      if ("e"+userSelectAccount === uuidList[i]._id) {
        this.uuid = uuidList[i].uuid;
      }
    }
    await store.getVespaData(this.userAccount);
    this.data = store.data;

    // Streaming for VESPA with SSEs, remove the "p"
    const url = baseUrl + "/api/streaming?userAccount=e" +
    this.userAccount.slice(1) +
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
      if ("e"+selectedAccount.slice(1) === uuidList[i]._id) {
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
    const url = baseUrl + "/api/streaming?userAccount=e" +
      this.userAccount.slice(1) +
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
    NProgress,
    NDataTable,
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
        Processing results for pgroup:
        <SelectAccountDropdown @selected-account="handleAccount" />
      </n-card>
    </n-grid-item>
  </n-grid>
  <div class="navigation-pane" v-if="data && data.length > 0">
    <div class="tab-pane" id="VESPA" role="tabpanel" aria-labelledby="vespa-tab">
      <div v-if="data">
        <n-data-table
            :columns="columns"
            :data="data"
            default-expand-all
          />
        <table v-if="data" class="result-table table-bordered">
          <thead>
            <tr>
              <th>Run Number</th>
              <th>Acquisition Number</th>
              <th>User Tag</th>
              <th>Triggered</th>
              <th>Protein</th>
              <th># images </th>
              <th># indexed </th>
              <th>% indexed </th>
              <th>Diffraction Resolution </th>
              <th># Reflections</th>
            </tr>
          </thead>
          <tbody>
            <tr class="rows" v-for="result in data" :key="result._id">
              <td> {{ result.run_number }} </td>
              
              <td> {{ result.file_number }} </td>

              <td> {{ result.user_tag }} </td>

              <td> {{ result.trigger_status }}</td>

              <td> {{ result.sample_name }}</td>
           
              <td> {{ result.numberOfImages }} </td>

              <td> {{ result.numberOfImagesIndexed }} </td>

              <td> {{ (100 / result.numberOfImages * result.numberOfImagesIndexed).toFixed(2) }} %</td>

              <td v-if="result.resolutionLimitMean"> {{ result.resolutionLimitMean.toFixed(2) }} </td>
              <td v-else> - </td>

              <td v-if="result.numberReflectionsMean"> {{ result.numberReflectionsMean.toFixed(2) }} </td>
              <td v-else> - </td>
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
