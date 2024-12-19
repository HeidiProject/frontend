import { defineStore } from "pinia";
import axiosWrapper from "../helpers/axiosWrapper";
import router from "../router";

export const useVespaProcessingStore = defineStore("vespaProcessingStore", {
  state: () => ({
    data: [],
    summaryData: [],
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
      console.log("experiment_group is: " + eaccount)
      try {
        const response = await axiosWrapper.get_vespa_processing_results(eaccount);
        this.data = response.data;
        // Below commented out is for merging runID on and off documents together 
        // const rawData = response.data;
        
        // // Transform the data to merge by run_number
        // const mergedData = rawData.reduce((acc, item) => {
        //   const runNumber = item._id.run_number;

        //   // Find or create the entry for the current run_number
        //   let existing = acc.find((doc) => doc.run_number === runNumber);
        //   if (!existing) {
        //     existing = { run_number: runNumber, trigger_status: {} };
        //     acc.push(existing);
        //   }

        //   // Assign data for each trigger_status
        //   existing.trigger_status[item._id.trigger_status] = {
        //     ...item,
        //     trigger_status: item._id.trigger_status // Include trigger_status explicitly
        //   };

        //   return acc;
        // }, []);

        // // Update store data with merged structure
        // this.data = mergedData;
        console.log("this.data in store is: " + this.data);
        this.data.forEach(item => {
          console.log(item);
        });
        
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
    async getSummaryData(experiment_group, dateRange) {
      console.log("experiment_group is: " + experiment_group)
      try {
        const response = await axiosWrapper.get_summary_processing_results(experiment_group);
        const rawData = response.data;
        
        // Transform the data to merge by user_tag
        const mergedData = rawData.reduce((acc, item) => {
        const userTag = item._id.user_tag;

        // Find or create the entry for the current user_tag
        let existing = acc.find((doc) => doc.user_tag === userTag);
        if (!existing) {
          existing = { user_tag: userTag, trigger_status: {} };
          acc.push(existing);
        }

        // Assign data for each trigger_status
        existing.trigger_status[item._id.trigger_status] = {
          ...item,
          trigger_status: item._id.trigger_status // Include trigger_status explicitly
        };

        return acc;
        }, []);

        // Update store data with merged structure
        this.summaryData = mergedData;
        console.log("this.summaryData in store is: " + this.summaryData);
        this.summaryData.forEach(item => {
          console.log(item);
        });
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
      this.data = [];
      this.summaryData = [];
      this.getDataMsg = "";
    },
    setDateRange(range) {
      this.dateRange = range;
    },
  },
});
