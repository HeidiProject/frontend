import { defineStore } from "pinia";
import axiosWrapper from "../helpers/axiosWrapper";

export const useSpreadsheetStore = defineStore("spreadsheetStore", {
  state: () => ({
    isSpreadsheetValidated:
      JSON.parse(sessionStorage.getItem("isSpreadsheetValidated")) === "true"
        ? true
        : false,
    spreadsheetModel: { model: [], tableHeaders: [] },
    validationMsg: "",
    floatWarning: false,
    emptyDirWarning: false,
    numberOfDewars: "",
    numberOfPucks: "",
    file: "",
  }),

  getters: {
    displaySpreadsheetModel(state) {
      if (state.spreadsheetModel) {
        return state.spreadsheetModel.model;
      }
    },
    displayTableHeaders(state) {
      if (state.spreadsheetModel) {
        return state.spreadsheetModel.tableHeaders;
      }
    },
    isValid(state) {
      return state.isSpreadsheetValidated;
    },
    emptyDirectoryWarning(state) {
      return state.emptyDirWarning;
    },
    validationMessage(state) {
      return state.validationMsg;
    },
    captionMessage(state) {
      return state.validationMsg + state.numberOfDewars + state.numberOfPucks;
    },
  },
  actions: {
    async validateSpreadsheet(file) {
      try {
        const response = await axiosWrapper.validate_spreadsheet(file);
        this.isSpreadsheetValidated = response.data.isSpreadsheetValid;
        sessionStorage.setItem("isSpreadsheetValidated", true);
        this.spreadsheetModel = {
          model: response.data.model,
          tableHeaders: response.data.tableHeaders,
        };
        this.validationMsg = response.data.msg;
      } catch (error) {
        this.isSpreadsheetValidated = false;
        sessionStorage.setItem("isSpreadsheetValidated", false);
        this.spreadsheetModel = { model: [], tableHeaders: [] };
        this.validationMsg = "There was an error making request: " + error;
        if (error.response.status === 401) {
          console.log("Session expired. Please login again.");
        }
      }
    },
    async clearSpreadsheetData() {
      (this.isSpreadsheetValidated =
        JSON.parse(sessionStorage.getItem("isSpreadsheetValidated")) === "true"
          ? true
          : false),
        (this.spreadsheetModel = { model: [], tableHeaders: [] }),
        (this.validationMsg = ""),
        (this.floatWarning = false),
        (this.emptyDirWarning = false),
        (this.numberOfDewars = ""),
        (this.numberOfPucks = ""),
        (this.file = "");
    },
  },
});
