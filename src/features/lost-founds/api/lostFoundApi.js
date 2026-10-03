import apiHelper from "../../../helpers/apiHelper";

const BASE_URL = DELCOM_BASEURL;

export const lostFoundApi = {
  // 1. Mengambil daftar barang hilang & temuan (dengan filter)
  async getLostFounds({ status = "", is_completed = "", is_me = "" } = {}) {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (is_completed !== "" && is_completed !== undefined) {
      params.append("is_completed", is_completed);
    }
    if (is_me !== "" && is_me !== undefined) {
      params.append("is_me", is_me);
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await apiHelper.fetchData(`${BASE_URL}/lost-founds${queryString}`);
    return response.json();
  },

  // 2. Mengambil detail laporan berdasarkan ID
  async getLostFoundById(id) {
    const response = await apiHelper.fetchData(`${BASE_URL}/lost-founds/${id}`);
    return response.json();
  },

  // 3. Menambahkan laporan baru
  async createLostFound({ title, description, status }) {
    const response = await apiHelper.fetchData(`${BASE_URL}/lost-founds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, status }),
    });
    return response.json();
  },

  // 4. Mengubah data laporan dan status selesai
  async updateLostFound(id, { title, description, status, is_completed }) {
    const response = await apiHelper.fetchData(`${BASE_URL}/lost-founds/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, status, is_completed }),
    });
    return response.json();
  },

  // 5. Mengunggah gambar cover (FormData - token otomatis terpasang)
  async uploadCover(id, file) {
    const formData = new FormData();
    formData.append("cover", file);

    const response = await apiHelper.fetchData(`${BASE_URL}/lost-founds/${id}/cover`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  },

  // 6. Menghapus laporan barang
  async deleteLostFound(id) {
    const response = await apiHelper.fetchData(`${BASE_URL}/lost-founds/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  // 7. Mengambil statistik harian
  async getDailyStats() {
    const response = await apiHelper.fetchData(`${BASE_URL}/lost-founds/stats/daily`);
    return response.json();
  },

  // 8. Mengambil statistik bulanan
  async getMonthlyStats() {
    const response = await apiHelper.fetchData(`${BASE_URL}/lost-founds/stats/monthly`);
    return response.json();
  },
};