import { defineStore } from "pinia";
import axiosWrapper from "../helpers/axiosWrapper";
import router from "../router/index";
import { useSpreadsheetStore } from "./spreadsheetStore";

// To do storage of jwts in cookies
// https://seb-l.github.io/pinia-plugin-persist/advanced/custom-storage.html

export const useAuthStore = defineStore("auth", {
  // state
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(sessionStorage.getItem("user")),
    isAuthenticated: JSON.parse(sessionStorage.getItem("isAuthenticated")),
    returnUrl: null,
  }),
  // actions
  actions: {
    async login(username, password) {
      try {
        const user = await axiosWrapper.login(username, password);
        if (user.data.login === true) {
          // update pinia state
          this.user = user.data;
          this.isAuthenticated = true;
          this.user.selectedAccount = user.data.uids[0];
          this.user.selectedId = user.data.uuid[0].uuid;
          // store user details and jwt in local storage to keep user logged in between page refreshes
          sessionStorage.setItem("user", JSON.stringify(user.data));
          // store authentication flag in session storage to keep user logged in between page refreshes
          // but revoke authentication when the browser is closed
          sessionStorage.setItem("isAuthenticated", true);

          if (this.returnUrl === "/Login") {
            // redirect to home page
            router.push("/");
          } else {
            // redirect to previous url or default to home page
            // router.push(this.returnUrl || "/");
            router.push("/");
          }
        }
      } catch (error) {
        console.log("error");
      }
    },
    async logout() {
      const { clearSpreadsheetData } = useSpreadsheetStore();
      await axiosWrapper.logout();
      this.user = null;
      this.isAuthenticated = null;
      sessionStorage.removeItem("user");
      sessionStorage.clear();
      clearSpreadsheetData();
      // redirect to home page
      router.push("/login");
    },
    selectAccount(value) {
      if (value !== null) {
        this.user.selectedAccount = value;
      }
    },
  },
  // getters
  getters: {
    userAuthenticated(state) {
      if (state.isAuthenticated === true) {
        return state.isAuthenticated;
      }
    },
    userSelectAccount(state) {
      if (state.user) {
        if (state.user.selectedAccount === null) {
          this.user.selectedAccount = state.user.uids[0];
        }
        return state.user.selectedAccount;
      }
    },
    uuidList(state) {
      return state.user.uuid;
    },
    userIds(state) {
      if (state.user) {
        return state.user.uids;
      }
    },
  },
});
