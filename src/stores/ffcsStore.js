import { defineStore } from "pinia";
import axiosWrapper from "../helpers/axiosWrapper";
import router from "../router";

export const useFFCSStore = defineStore("ffcsStore", {
  state: () => ({
    ffcs_data: [],
  }),

  getters: {
    allDocuments(state) {
      return state.ffcs_data;
    },
    oneDocument(state, id) {
      for (let i = 0; i < state.ffcs_data.length; i++) {
        if (state.ffcs_data[i]._id == id) {
          return state.ffcs_data[i]._id;
        }
      }
    },
  },
  actions: {
    async getCampaigns(user_account) {
      console.log("userAccount is: " + user_account)
      try {
        const response = await axiosWrapper.get_summary_ffcs_results(eaccount);
        
        // Update store data with merged structure
        this.ffcs_data = response.data;
        console.log("this.data in store is: " + this.ffcs_data);
        this.ffcs_data.forEach(item => {
          console.log(item);
        });
        return this.ffcs_data;

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
    async getFFCSData(user_account, campaign_id) {
      console.log("userAccount is: " + user_account + " campaignId is:" + campaign_id)
      try {
        const response = await axiosWrapper.get_summary_ffcs_results(user_account, campaign_id);
        
        // Update store data with merged structure
        this.ffcs_data = response.data;
        console.log("this.ffcs_data in store is: " + this.ffcs_data);
        this.ffcs_data.forEach(item => {
          console.log(item);
        });
        return this.ffcs_data;

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
  },
});
