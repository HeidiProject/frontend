<script>
import { NCard, NButton, NGrid, NGridItem, NDivider, NProgress, NDataTable } from "naive-ui";
import { useAuthStore } from "../stores/authStore";
import SelectAccountDropdown from "../components/SelectAccountDropdown.vue";
import SelectCampaignDropdown from "../components/SelectCampaignDropdown.vue";
import { useFFCSStore } from "../stores/ffcsStore";

const auth = useAuthStore();
const { uuidList, userSelectAccount } = auth;

const store = useFFCSStore();

export default {
  data() {
    return {
      userAccount: "",
      userCampaign: "",
      uuid: "",
      ffcs_data: [],
      messages: [],
      columns: ['Run Number','Acquisitions']
    };
  },
  async mounted() {
    this.userAccount = "e" + userSelectAccount;
    this.userCampaign = "bach1_sccr_01";
    await store.getFFCSData(this.userAccount,this.userCampaign);
    this.ffcs_data = store.ffcs_data;
    console.log("this.userAccount: " + this.userAccount + " this.userCampaign: " + this.userCampaign)
  },
  methods: {
    async handleAccount(selectedAccount) {
      this.userAccount = selectedAccount;
      await store.getFFCSData(this.userAccount,this.userCampaign)
      this.ffcs_data = store.ffcs_data;
      if (!this.ffcs_data) {
        this.ffcs_data = [];
      }
      console.log("end of assigning this.ffcs_data in ffcs view:" + this.ffcs_data)
    },
    async handleCampaign(selectedCampaign) {
      this.userCampaign = selectedCampaign;
      await store.getFFCSData(this.userAccount,this.userCampaign)
      this.ffcs_data = store.ffcs_data;
      if (!this.ffcs_data) {
        this.ffcs_data = [];
      }
      console.log("end of assigning this.ffcs_data in ffcs view:" + this.ffcs_data)
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
        <SelectCampaignDropdown @selected-campaign="handleCampaign" />
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
