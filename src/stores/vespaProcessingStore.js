import { defineStore } from "pinia";
import axiosWrapper from "../helpers/axiosWrapper";
import router from "../router";

export const useVespaProcessingStore = defineStore("vespaProcessingStore", {
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
  },
  actions: {
    async getVespaData(eaccount, dateRange) {
      console.log("inside getVespaData")
      console.log("eaccount is: " + eaccount)
      try {
        const response = await axiosWrapper.get_vespa_processing_results(
          eaccount
        );
        this.data = response.data;
        console.log("this.data in store is: " + this.data);
      } catch (error) {
        console.log(error)
        this.getDataMsg = "There was an error making request: " + error;
        console.log(this.getDataMsg)
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
