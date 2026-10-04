/* global DELCOM_BASEURL */
// Pembungkus fetch ke REST API Delcom + utilitas token di localStorage.

const ACCESS_TOKEN_KEY = "accessToken";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function putAccessToken(token) {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Menyusun URL lengkap: BASEURL + path + query params (nilai kosong diabaikan).
export function buildUrl(path, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });
  const queryString = query.toString();
  return `${DELCOM_BASEURL}${path}${queryString ? `?${queryString}` : ""}`;
}

// Memanggil API. `body` berupa objek (dikirim sebagai JSON) atau FormData.
// Mengembalikan JSON respons; melempar Error bila status HTTP / status API gagal.
export async function fetchData(path, { method = "GET", body, params, headers = {} } = {}) {
  const finalHeaders = { Accept: "application/json", ...headers };

  const token = getAccessToken();
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  let payload;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path, params), {
    method,
    headers: finalHeaders,
    body: payload,
  });

  let json = {};
  try {
    json = await response.json();
  } catch {
    json = {};
  }

  if (!response.ok || json.status === "fail" || json.status === "error") {
    throw new Error(json.message || `Permintaan gagal (${response.status})`);
  }

  return json;
}

const apiHelper = {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  buildUrl,
  fetchData,
};

export default apiHelper;
