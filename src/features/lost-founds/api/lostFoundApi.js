import { fetchData } from "../../../helpers/apiHelper";

const BASE_PATH = "/lost-founds";

// GET /lost-founds?status=lost|found&is_completed=1|0&is_me=1
export async function getLostFounds({ status, is_completed, is_me } = {}) {
  const json = await fetchData(BASE_PATH, { params: { status, is_completed, is_me } });
  return json.data.lost_founds;
}

// GET /lost-founds/:id
export async function getLostFoundById(id) {
  const json = await fetchData(`${BASE_PATH}/${id}`);
  return json.data.lost_found;
}

// POST /lost-founds -> mengembalikan id laporan baru
export async function postLostFound({ title, description, status }) {
  const json = await fetchData(BASE_PATH, {
    method: "POST",
    body: { title, description, status },
  });
  return json.data.lost_found_id;
}

// PUT /lost-founds/:id
export async function putLostFound(id, { title, description, status, is_completed }) {
  const json = await fetchData(`${BASE_PATH}/${id}`, {
    method: "PUT",
    body: { title, description, status, is_completed: is_completed ? 1 : 0 },
  });
  return json.message;
}

// POST /lost-founds/:id/cover (multipart/form-data)
export async function postLostFoundCover(id, cover) {
  const formData = new FormData();
  formData.append("cover", cover);
  const json = await fetchData(`${BASE_PATH}/${id}/cover`, { method: "POST", body: formData });
  return json.message;
}

// DELETE /lost-founds/:id
export async function deleteLostFound(id) {
  const json = await fetchData(`${BASE_PATH}/${id}`, { method: "DELETE" });
  return json.message;
}

// GET /lost-founds/stats/daily
export async function getStatsDaily(params = {}) {
  const json = await fetchData(`${BASE_PATH}/stats/daily`, { params });
  return json.data;
}

// GET /lost-founds/stats/monthly
export async function getStatsMonthly(params = {}) {
  const json = await fetchData(`${BASE_PATH}/stats/monthly`, { params });
  return json.data;
}

const lostFoundApi = {
  getLostFounds,
  getLostFoundById,
  postLostFound,
  putLostFound,
  postLostFoundCover,
  deleteLostFound,
  getStatsDaily,
  getStatsMonthly,
};

export default lostFoundApi;