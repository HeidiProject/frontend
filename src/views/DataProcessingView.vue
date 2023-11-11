<script>
import DatePicker from "../components/DatePicker.vue";
import ProcessingDetails from "../components/ProcessingDetails.vue";
import ProcessingNavBar from "../components/ProcessingNavBar.vue";
import ProcessingStats from "../components/ProcessingStats.vue";
import SelectAccountDropdown from "../components/SelectAccountDropdown.vue";
import { useAuthStore } from "../stores/authStore";
import { useProcessingStore } from "../stores/processingStore";
import { NCard, NGrid, NGridItem } from "naive-ui";
import { onBeforeUnmount } from 'vue';

// We store the reference to the SSE client out here
// so we can access it from other methods
let sseClient;
const baseUrl = `${import.meta.env.VITE_API_URL}`;


const auth = useAuthStore();
const { uuidList, userSelectAccount, userSelectId } = auth;

const store = useProcessingStore();

export default {
  data() {
    return {
      userAccount: "",
      uuid: "",
      items: [],
      messages: [],
      selectedItem: "",
      selectedBeamline: "",
      selectedDateRange: [],
      formattedDateRange: [],
    };
  },
  async mounted() {
    this.userAccount = "e" + userSelectAccount;
    for (let i = 0; i < uuidList.length; i++) {
      if (this.userAccount === uuidList[i]._id) {
        this.uuid = uuidList[i].uuid;
      }
    }
    await store.getData(this.userAccount, this.formattedDateRange);
    this.items = store.data;
    if (this.items.length > 1) {
      this.selectedItem = store.data[0]._id;
    }

    const url = baseUrl + "/api/events?userAccount=" +
      this.userAccount +
      "&uuid=" +
      this.uuid;

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

    //define a list of named events we will listen to, and dispatchThem
    var named_events = [
      "standard",
      "screening",
      "standard-repeat",
      "bookmarks",
      "native-sad",
      "serial-xtal",
      "inverse-beam",
      "interleave-no-inverse",
      "interleave-and-inverse-first",
      "interleave-and-inverse-all",
      "other",
      "merge-sx",
      "merge-native",
      "new_merge_id",
    ];

    //catch named events and handle messages
    for (var i = 0; i < named_events.length; i++) {
      sseClient.on(named_events[i], this.handleMessage);
    }

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
    handleClick(selectedId) {
      this.selectedItem = selectedId;
    },
    async handleAccount(selectedAccount) {
      this.userAccount = selectedAccount;
      for (let i = 0; i < uuidList.length; i++) {
        if (selectedAccount === uuidList[i]._id) {
          this.uuid = uuidList[i].uuid;
        }
      }
      await store.getData(this.userAccount, this.formattedDateRange);
      this.items = store.data;
      if (this.items.length > 1) {
        this.selectedItem = store.data[0]._id;
      }

      const url = baseUrl + "/api/events?userAccount=" +
        this.userAccount +
        "&uuid=" +
        this.uuid;

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

      //define a list of named events we will listen to, and dispatchThem
      var named_events = [
        "standard",
        "screening",
        "standard-repeat",
        "bookmarks",
        "native-sad",
        "serial-xtal",
        "inverse-beam",
        "interleave-no-inverse",
        "interleave-and-inverse-first",
        "interleave-and-inverse-all",
        "other",
        "merge-sx",
        "merge-native",
        "new_merge_id",
      ];

      //catch named events and handle messages
      for (var i = 0; i < named_events.length; i++) {
        sseClient.on(named_events[i], this.handleMessage);
      }

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
    async handleBeamline(selectedBeamline) {
      this.selectedBeamline = selectedBeamline;
      this.items = store.data;
      if (this.items.length > 1) {
        this.selectedItem = store.data[0]._id;
      }
      if (this.userAccount !== "" && this.selectedBeamline !== "") {
        const url = baseUrl + "/api/events?userAccount=" +
          this.userAccount +
          "&uuid=" +
          this.uuid;

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

        //define a list of named events we will listen to, and dispatchThem
        var named_events = [
          "standard",
          "screening",
          "standard-repeat",
          "bookmarks",
          "native-sad",
          "serial-xtal",
          "inverse-beam",
          "interleave-no-inverse",
          "interleave-and-inverse-first",
          "interleave-and-inverse-all",
          "other",
          "merge-sx",
          "merge-native",
          "new_merge_id",
        ];

        //catch named events and handle messages
        for (var i = 0; i < named_events.length; i++) {
          sseClient.on(named_events[i], this.handleMessage);
        }

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
    async handleDateRangeSelected(dateRange) {
      this.selectedDateRange = dateRange;
      this.formattedDateRange = this.epochToHumanDate(this.selectedDateRange);
      await store.getData(this.userAccount, this.formattedDateRange);
      this.items = store.data;
      if (store.data.length > 0) {
        this.selectedItem = store.data[0]._id; //TODO: be smarter here - show most recent dataset as default
      }
    },
    handleMessage(message) {
      // Note that we can access properties of message, since our parser is set to JSON
      // and the hypothetical object has these properties.
      if (
        message.adpStatus.strategy === "pending" ||
        message.adpStatus.fast_xds_1 === "pending"
      ) {
        message._id = message.adpId;
        this.items.unshift(message);
      }
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i]["_id"] === message.adpId) {
          message._id = this.items[i]["_id"];
          this.items[i] = message;
        }
      }
    },
    epochToHumanDate(epochArr) {
      const resultArr = [];
      for (let i = 0; i < epochArr.length; i++) {
        const date = new Date(epochArr[i]);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        resultArr.push(`${year}-${month}-${day}`);
      }
      return resultArr;
    },
  },
  components: {
    ProcessingNavBar,
    ProcessingDetails,
    ProcessingStats,
    DatePicker,
    SelectAccountDropdown,
    NCard,
    NGrid,
    NGridItem,
  },
};

// Close the event stream when the component is about to be unmounted
onBeforeUnmount(() => {
  eventStream.close();
});
</script>

<template>
  <n-grid x-gap="12" cols="1 xs:1 s:3 m:3 l:3 xl:3 2xl:3" responsive="screen">
    <n-grid-item>
      <n-card class="info-panel">
        <ProcessingStats @selected-beamline="handleBeamline" />
      </n-card>
    </n-grid-item>
    <n-grid-item>
      <n-card class="info-panel">
        <DatePicker @date-range="handleDateRangeSelected" />
      </n-card>
    </n-grid-item>
    <n-grid-item>
      <n-card class="info-panel">
        Processing results for e-account:
        <SelectAccountDropdown @selected-account="handleAccount" />
      </n-card>
    </n-grid-item>
  </n-grid>
  <div class="container">
    <ProcessingNavBar
      v-if="items.length > 0"
      :data="items"
      @selected-id="handleClick"
    />
    <ProcessingDetails
      v-if="items.length > 0"
      :_id="selectedItem"
      :data="items"
    />
    <n-card v-else>
      No processing results for {{ this.userAccount }} in selected date range.
    </n-card>
  </div>
</template>

<style scoped>
.info-panel {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  display: flex;
  max-width: 100vw;
  gap: 1em;
  margin-top: 1em;
  margin-bottom: 1em;
}

ProcessingNavBar {
  flex: 1;
  flex-shrink: 1;
  flex-grow: 1;
  flex-basis: auto;
}

ProcessingDetails {
  flex: 2;
  flex-shrink: 1;
  flex-grow: 1;
  flex-basis: auto;
}
</style>
