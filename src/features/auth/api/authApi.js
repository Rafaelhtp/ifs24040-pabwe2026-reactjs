import apiHelper from "../../../helpers/apiHelper";

const authApi = (() => {
  function getBaseUrl() {
    const baseUrl =
      typeof DELCOM_BASEURL !== "undefined"
        ? DELCOM_BASEURL
        : import.meta.env?.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1";
    return `${baseUrl}/auth`;
  }

  function _url(path) {
    return `${getBaseUrl()}${path}`;
  }

  async function postRegister(name, email, password) {
    const response = await apiHelper.fetchData(_url("/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      const errorDetails =
        result.data && typeof result.data === "object"
          ? Object.values(result.data).flat().join(", ")
          : "";
      const baseMsg = result.message || "Gagal melakukan pendaftaran";
      throw new Error(errorDetails ? `${baseMsg}: ${errorDetails}` : baseMsg);
    }

    return result.message;
  }

  async function postLogin(email, password) {
    const response = await apiHelper.fetchData(_url("/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal login");
    }

    return result.data;
  }

  async function postLogout() {
    const response = await apiHelper.fetchData(_url("/logout"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal logout");
    }

    return result.message;
  }

  return {
    postRegister,
    postLogin,
    postLogout,
  };
})();

export const postRegister = authApi.postRegister;
export const postLogin = authApi.postLogin;
export const postLogout = authApi.postLogout;

export default authApi;