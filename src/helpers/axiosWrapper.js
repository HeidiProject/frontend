import axios from "axios";

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  xsrfCookieName: "csrf_access_token",
  xsrfHeaderName: "X-CSRF-Token",
});

export default {
  login() {
    return axios.get(baseUrl + "/token/login");
  },

  validate_login() {
    return apiClient.get("api/protected");
  },

  async validate_spreadsheet(file_data) {
    let formData = new FormData();
    formData.append("file", file_data);
    return apiClient.post("api/upload", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  async download_tell_instructions() {
    return apiClient
      .get("api/download/documentation", {
        responseType: "blob",
        headers: { "Content-Type": "application/pdf" },
      })
      .then((response) => {
        let blob = new Blob([response.data], {
          type: "application/pdf",
        });
        let url = window["URL"].createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "TELL_Sample_Spreadsheet_User_Instructions.pdf";
        a.click();
        window["URL"].revokeObjectURL(url);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async download_file(filename, filetype) {
    return apiClient
      .get("api/static_files/" + filename, {
        responseType: "blob",
        headers: { "Content-Type": filetype },
      })
      .then((response) => {
        let blob = new Blob([response.data], {
          type: filetype,
        });
        let url = window["URL"].createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        window["URL"].revokeObjectURL(url);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  get_processing_results(eaccount, dateRange) {
    return apiClient.post("/api/query", {
      user_account: eaccount,
      after: dateRange[0],
      before: dateRange[1],
    });
    // console.log(eaccount);
    // return axios.get("http://localhost:3000/documents");
  },
  get_vespa_processing_results(eaccount) {
    return apiClient.post("/api/vespa", {
      user_account: eaccount,
    });
  },
  get_pgroup_tokens(pgroup) {
    return apiClient.get("/api/tokens/" + pgroup);
  },
  create_api_token(pgroup, purpose) {
    return apiClient.post("/api/token/create", {"pgroup": pgroup,"purpose": purpose});
  },
  revoke_api_token(pgroup) {
    return apiClient.delete("/api/token/revoke/" + pgroup);
  }
};
