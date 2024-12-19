<script>
import { NCard, NButton, NGrid, NGridItem, NDivider, NProgress, NDataTable } from "naive-ui";
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
      summaryData: [],
      messages: [],
      columns: ['Run Number','Acquisitions']
      // columns: ['Date & Time','Run Number','Filename','Unit Cell Indexing Mean','Total images','Indexed images','% indexed','Progress']
    };
  },
  async mounted() {
    if (userSelectAccount.length === 5) {
      this.userAccount = "p" + userSelectAccount;
    } else {
      this.userAccount = userSelectAccount;
    }
    for (let i = 0; i < uuidList.length; i++) {
      if ("e"+this.userAccount.slice(1) === uuidList[i]._id) {
        this.uuid = uuidList[i].uuid;
      }
    }
    await store.getSummaryData(this.userAccount);
    this.summaryData = store.summaryData;

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
  getColor(percentage) {
      // Return "info" for blue and "success" for green
      return percentage > 100 ? "green" : "blue";
  },
  handleMessage(message) {
      this.summaryData.unshift(message);
  },
  async handleAccount(selectedAccount) {
    this.userAccount = selectedAccount;
    for (let i = 0; i < uuidList.length; i++) {
      if (selectedAccount === uuidList[i]._id) {
        this.uuid = uuidList[i].uuid;
      }
    }
    await store.getSummaryData(this.userAccount)
    this.summaryData = store.data;
    if (!this.summaryData) {
      this.summaryData = [];
    }
    console.log("end of assigning this.summaryData in vespa view:" + this.summaryData)

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
    
    }
  },
  components: {
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
  <div class="navigation-pane" v-if="summaryData && summaryData.length > 0">
    <div class="tab-pane" id="VESPA" role="tabpanel" aria-labelledby="vespa-tab">
      <div v-if="data">
        <n-data-table
            :columns="columns"
            :data="data"
            default-expand-all
          />
        <table v-if="summaryData" class="result-table table-bordered">
          <thead>
            <tr>
              <th>User Tag</th>
              <th>Triggered</th>
              <th>Protein</th>
              <th>Acquisitions</th>
              <th># images off</th>
              <th># images on</th>
              <th># indexed off</th>
              <th># indexed on</th>
              <th>% indexed off</th>
              <th>% indexed on</th>
              <th>Diffraction Resolution off</th>
              <th>Diffraction Resolution on</th>
              <th># Reflections off</th>
              <th># Reflections on</th>
              <th>Progress off</th>
              <th>Progress on</th>
            </tr>
          </thead>
          <tbody>
            <tr class="rows" v-for="result in summaryData" :key="result.user_tag">
              <td v-if="result.user_tag">
                {{ result.user_tag }}
              </td>
              <td v-else> - </td>

              <td v-if="result.trigger_status && result.trigger_status.off"> 
                {{ result.trigger_status.off._id.trigger_flag }} 
              </td>
              <td v-else> - </td>

              <td v-if="result.trigger_status && result.trigger_status.off">
                {{ result.trigger_status.off._id.sample_name }}
              </td>
              <td v-else> - </td>

              <!-- Ensure both on and off trigger statuses exist before accessing their properties -->
              <td v-if="result.trigger_status && result.trigger_status.on && result.trigger_status.off">
                {{ result.trigger_status.on.acquisitions.length + result.trigger_status.off.acquisitions.length }}
              </td>
              <!-- If only off trigger status exists -->
              <td v-else-if="result.trigger_status && result.trigger_status.off && !(result.trigger_status.on)">
                {{ result.trigger_status.off.acquisitions.length }}
              </td>
              <td v-else> - </td>

              <td v-if="result.trigger_status && result.trigger_status.off">
                {{ result.trigger_status.off.total_images }}
              </td>
              <td v-else> - </td>

              <td v-if="result.trigger_status && result.trigger_status.on">
                {{ result.trigger_status.on.total_images }}
              </td>
              <td v-else> - </td>

              <td v-if="result.trigger_status && result.trigger_status.off">
                {{ result.trigger_status.off.indexed_images }}
              </td>
              <td v-else> - </td>

              <td v-if="result.trigger_status && result.trigger_status.on">
                {{ result.trigger_status.on.indexed_images }}
              </td>
              <td v-else> - </td>

              <td v-if="result.trigger_status && result.trigger_status.off">
                {{ (100 / result.trigger_status.off.total_images * result.trigger_status.off.indexed_images).toFixed(2) }} %
              </td>
              <td v-else> - </td>

              <td v-if="result.trigger_status && result.trigger_status.on">
                {{ (100 / result.trigger_status.on.total_images * result.trigger_status.on.indexed_images).toFixed(2) }} %
              </td>
              <td v-else> - </td>

              <!-- Check if diffraction_resolution is not null for both trigger_status.on and trigger_status.off -->
              <td v-if="result.trigger_status && result.trigger_status.off && result.trigger_status.off.diffraction_resolution !== null">
                {{ result.trigger_status.off.diffraction_resolution.toFixed(2) }}
              </td>
              <td v-else> - </td>

              <td v-if="result.trigger_status && result.trigger_status.on && result.trigger_status.on.diffraction_resolution !== null">
                {{ result.trigger_status.on.diffraction_resolution.toFixed(2) }}
              </td>
              <td v-else> - </td>

              <!-- Check if total_reflections is not null for both trigger_status.on and trigger_status.off -->
              <td v-if="result.trigger_status && result.trigger_status.off && result.trigger_status.off.total_reflections !== null">
                {{ result.trigger_status.off.total_reflections.toFixed(2) }}
              </td>
              <td v-else> - </td>

              <td v-if="result.trigger_status && result.trigger_status.on && result.trigger_status.on.total_reflections !== null">
                {{ result.trigger_status.on.total_reflections.toFixed(2) }}
              </td>
              <td v-else> - </td>
              <td>
                <n-progress v-if="result.trigger_status && result.trigger_status.off"
                type="line"
                :color="getColor(((result.trigger_status.off.indexed_images / 50000) * 100).toFixed(0))"
                :percentage="((result.trigger_status.off.indexed_images / 50000) * 100).toFixed(0)"
                indicator-placement="outside"
                /> 
              </td>
              <td>
                <n-progress v-if="result.trigger_status && result.trigger_status.on"
                type="line"
                :color="getColor(((result.trigger_status.on.indexed_images / 50000) * 100).toFixed(0))"
                :percentage="((result.trigger_status.on.indexed_images / 50000) * 100).toFixed(0)"
                indicator-placement="outside"
                /> 
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
