import apiHelper from "../../../helpers/apiHelper";

function getBaseUrl() {
  const baseUrl =
    typeof DELCOM_BASEURL !== "undefined"
      ? DELCOM_BASEURL
      : import.meta.env?.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1";
  return `${baseUrl}/lost-founds`;
}

export const lostFoundApi = {
  // 1. Mengambil daftar barang hilang & temuan (dengan filter)
  async getLostFounds({ status = "", is_completed = "", is_me = "" } = {}) {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (is_completed !== "" && is_completed !== undefined) {
      params.append("is_completed", String(is_completed));
    }
    if (is_me !== "" && is_me !== undefined) {
      params.append("is_me", String(is_me));
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await apiHelper.fetchData(`${getBaseUrl()}${queryString}`);
    const result = await response.json();
    return result;
  },

  // 2. Mengambil detail laporan berdasarkan ID
  async getLostFoundById(id) {
    const response = await apiHelper.fetchData(`${getBaseUrl()}/${id}`);
    const result = await response.json();
    return result;
  },

  // 3. Menambahkan laporan baru
  async createLostFound({ title, description, status }) {
    const response = await apiHelper.fetchData(`${getBaseUrl()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, status }),
    });
    const result = await response.json();
    return result;
  },

  // 4. Mengubah data laporan dan status selesai
  async updateLostFound(id, { title, description, status, is_completed }) {
    const response = await apiHelper.fetchData(`${getBaseUrl()}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        status,
        is_completed: is_completed ? 1 : 0,
      }),
    });
    const result = await response.json();
    return result;
  },

  // 5. Mengunggah gambar cover
  async uploadCover(id, file) {
    const formData = new FormData();
    formData.append("cover", file);

    const response = await apiHelper.fetchData(`${getBaseUrl()}/${id}/cover`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    return result;
  },

  // 6. Menghapus laporan barang
  async deleteLostFound(id) {
    const response = await apiHelper.fetchData(`${getBaseUrl()}/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    return result;
  },

  // 7. Mengambil statistik harian
  async getDailyStats() {
    const response = await apiHelper.fetchData(`${getBaseUrl()}/stats/daily`);
    const result = await response.json();
    return result;
  },

  // 8. Mengambil statistik bulanan
  async getMonthlyStats() {
    const response = await apiHelper.fetchData(`${getBaseUrl()}/stats/monthly`);
    const result = await response.json();
    return result;
  },
};

export const getLostFounds = lostFoundApi.getLostFounds;
export const getLostFoundById = lostFoundApi.getLostFoundById;
export const createLostFound = lostFoundApi.createLostFound;
export const updateLostFound = lostFoundApi.updateLostFound;
export const uploadCover = lostFoundApi.uploadCover;
export const deleteLostFound = lostFoundApi.deleteLostFound;
export const getDailyStats = lostFoundApi.getDailyStats;
export const getMonthlyStats = lostFoundApi.getMonthlyStats;

// Aliases for compatibility
export const fetchLostFounds = lostFoundApi.getLostFounds;
export const fetchLostFound = lostFoundApi.getLostFoundById;
export const postLostFound = lostFoundApi.createLostFound;
export const putLostFound = lostFoundApi.updateLostFound;
export const postLostFoundCover = lostFoundApi.uploadCover;
export const removeLostFound = lostFoundApi.deleteLostFound;
export const fetchStatsDaily = lostFoundApi.getDailyStats;
export const fetchStatsMonthly = lostFoundApi.getMonthlyStats;

export default lostFoundApi;