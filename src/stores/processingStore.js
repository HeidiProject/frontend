import { defineStore } from "pinia";
import axiosWrapper from "../helpers/axiosWrapper";
import router from "../router";

export const useProcessingStore = defineStore("processingStore", {
  state: () => ({
    data: [],
    eaccount: "",
    getDataMsg: "",
    dateRange: [],
    getStrategy: 0,
    getDatasets: 0,
  }),

  getters: {
    allDocuments(state) {
      return state.data;
    },
    oneDocument(state, id) {
      for (let i = 0; i < state.data.length; i++) {
        if (state.data[i]._id == id) {
          return state.data[i]._id;
        }
      }
    },
    getDataMessage(state) {
      return state.getDataMsg;
    },
    numberOfStrategy(state) {
      if (Array.isArray(state.data)) {
        this.getStrategy = state.data.filter(
          (x) => x.adpExecutionStack[1] == "strategy"
        ).length;
      }
      return state.getStrategy;
    },
    numberOfDatasets(state) {
      if (Array.isArray(state.data)) {
        this.getDatasets = state.data.filter(
          (x) => x.adpExecutionStack[1] != "strategy"
        ).length;
      }
      return state.getDatasets;
    },
  },
  actions: {
    async getData(eaccount, dateRange) {
      try {
        const response = await axiosWrapper.get_processing_results(
          eaccount,
          dateRange
        );
        this.data = response.data;
      } catch (error) {
        this.getDataMsg = "There was an error making request: " + error;
        if (error.response.status === 401) {
          router.push("/login");
          console.log("Session expired. Please login again.");
        }
      }
    },
    async clearData() {
      this.vespaData = [];
      this.getDataMsg = "";
    },
    setDateRange(range) {
      this.dateRange = range;
    },
  },
});
