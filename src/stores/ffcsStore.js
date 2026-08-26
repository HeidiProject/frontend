import { defineStore } from "pinia";
import axiosWrapper from "../helpers/axiosWrapper";
import router from "../router";

export const useFFCSStore = defineStore("ffcsStore", {
  state: () => ({
    campaigns: [],
    ffcs_data: [],
    getDataMsg: "",
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
      try {
        const response = await axiosWrapper.get_ffcs_campaigns(user_account);
        this.campaigns = response.data;
        this.getDataMsg = "";
        return this.campaigns;
      } catch (error) {
        this.campaigns = [];
        this.getDataMsg = "There was an error making request: " + error;
        if (error.response?.status === 401) {
          router.push("/login");
        }
        return this.campaigns;
      }
    },
    async getFFCSData(user_account, campaign_id) {
      try {
        const response = await axiosWrapper.get_summary_ffcs_results(user_account, campaign_id);
        this.ffcs_data = response.data;
        this.getDataMsg = "";
        return this.ffcs_data;

      } catch (error) {
        this.ffcs_data = [];
        this.getDataMsg = "There was an error making request: " + error;
        if (error.response?.status === 401) {
          router.push("/login");
        }
        return this.ffcs_data;
      }
    },
  },
});
