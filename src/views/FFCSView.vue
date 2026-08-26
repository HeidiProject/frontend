<script>
import { NCard, NButton, NGrid, NGridItem, NDivider, NProgress, NDataTable } from "naive-ui";
import { useAuthStore } from "../stores/authStore";
import SelectAccountDropdown from "../components/SelectAccountDropdown.vue";
import SelectCampaignDropdown from "../components/SelectCampaignDropdown.vue";
import { useFFCSStore } from "../stores/ffcsStore";

const auth = useAuthStore();

const store = useFFCSStore();

function normalizePgroup(account) {
  const value = String(account || "");
  if (value.startsWith("p")) return value;
  if (value.startsWith("e")) return "p" + value.slice(1);
  return "p" + value;
}

export default {
  data() {
    return {
      userAccount: "",
      userCampaign: "",
      uuid: "",
      ffcs_data: [],
      campaigns: [],
      campaignsLoading: false,
      campaignError: "",
      messages: [],
      columns: ['Run Number','Acquisitions']
    };
  },
  async mounted() {
    this.userAccount = normalizePgroup(auth.userSelectAccount);
    await this.loadCampaigns();
  },
  methods: {
    async loadCampaigns() {
      this.campaignsLoading = true;
      this.userCampaign = "";
      this.campaigns = [];
      this.ffcs_data = [];
      this.campaignError = "";

      try {
        await store.getCampaigns(this.userAccount);
        this.campaigns = store.campaigns;
        this.campaignError = store.getDataMsg;
        if (this.campaigns.length > 0) {
          this.userCampaign = this.campaigns[0].campaign_id;
          await this.loadCampaignData();
        }
      } finally {
        this.campaignsLoading = false;
      }
    },
    async loadCampaignData() {
      if (!this.userCampaign) {
        this.ffcs_data = [];
        return;
      }
      await store.getFFCSData(this.userAccount, this.userCampaign);
      this.ffcs_data = store.ffcs_data;
    },
    async handleAccount(selectedAccount) {
      this.userAccount = normalizePgroup(selectedAccount);
      await this.loadCampaigns();
    },
    async handleCampaign(selectedCampaign) {
      this.userCampaign = selectedCampaign;
      await this.loadCampaignData();
    },
  },
    components: {
      SelectAccountDropdown,
      SelectCampaignDropdown,
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
  <n-grid x-gap="12" cols="1 s:1 m:3 l:3 xl:3 2xl:3" responsive="screen">
    <n-grid-item>
      <n-card class="info-panel">
        <n-button @click="handleAccount(userAccount)">Refresh results</n-button>
      </n-card>
    </n-grid-item>
    <n-grid-item>
      <n-card class="info-panel">
        Select Account:
        <SelectAccountDropdown @selected-account="handleAccount" />
      </n-card>
    </n-grid-item>
    <n-grid-item>
      <n-card class="info-panel">
        Select Campaign:
        <SelectCampaignDropdown
          :campaigns="campaigns"
          :model-value="userCampaign"
          :loading="campaignsLoading"
          @selected-campaign="handleCampaign"
        />
        <p v-if="campaignError" class="error-message">{{ campaignError }}</p>
      </n-card>
    </n-grid-item>
  </n-grid>
  <div class="navigation-pane" v-if="ffcs_data">
    <div class="tab-pane" id="FFCS" role="tabpanel" aria-labelledby="ffcs-tab">
      <div v-if="ffcs_data">
        <!-- <n-data-table
            :columns="columns"
            :data="ffcs_data"
            default-expand-all
          /> -->
        <table v-if="ffcs_data" class="result-table table-bordered">
          <thead>
            <tr>
              <th>Plate ID</th>
              <th>Well</th>
              <th>Library Name</th>
              <th>Smiles</th>
              <th>Compound Code</th>
              <th>Compound Concentration</th>
              <!-- <th>Cryo Name</th>
              <th>Cryo Concentration</th> -->
              <!-- <th>Soak Duration</th> -->
              <th>Fished</th>
              <th>Fishing Result</th>
              <th>Xtal Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr class="rows" v-for="result in ffcs_data" :key="result.document[0]._id">
              <td> {{ result.document[0].plateId }} </td>
              
              <td> {{ result.document[0].well }}</td>
              
              <td v-if="result.document[0].libraryName"> {{ result.document[0].libraryName }} </td>
              <td v-else> - </td>
              
              <td v-if="result.document[0].smiles"> {{ result.document[0].smiles }}</td>
              <td v-else> - </td>
              
              <td v-if="result.document[0].compoundCode"> {{ result.document[0].compoundCode }} </td>
              <td v-else> - </td>
              
              <td v-if="result.document[0].libraryConcentration"> {{ result.document[0].libraryConcentration }} </td>
              <td v-else> - </td>
              
              <!-- <td v-if="result.cryoName"> {{ result.cryoName }} </td>
              <td v-else> - </td>

              <td v-if="result.cryoDesiredConcentration"> {{ result.cryoDesiredConcentration }} </td>
              <td v-else> - </td> -->
<!-- 
              <td v-if="result.soakDuration"> {{ result.soakDuration }} </td>
              <td v-else> - </td> -->

              <td v-if="result.document[0]" :style="{
            color: result.document[0].fished ? 'green' : 'red',
            fontWeight: 'bold'
          }"> {{ result.document[0].fished }} </td>
              <!-- <td v-else> false </td> -->

              <td v-if="result.document[0].shifterComment"> {{ result.document[0].shifterComment }} </td>
              <td v-else> - </td>

              <td v-if="result.document[0].xtalName"> {{ result.document[0].xtalName }} </td>
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
.error-message {
  color: #b00020;
  margin: 0.5rem 0 0;
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
