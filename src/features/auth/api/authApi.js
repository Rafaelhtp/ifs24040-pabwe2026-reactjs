import { fetchData } from "../../../helpers/apiHelper";

// POST /auth/register -> mengembalikan pesan sukses dari server
export async function postRegister(name, email, password) {
  const json = await fetchData("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
  return json.message;
}

// POST /auth/login -> mengembalikan access token
export async function postLogin(email, password) {
  const json = await fetchData("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  return json.data.token;
}

// POST /auth/logout -> mencabut token di server
export async function postLogout() {
  const json = await fetchData("/auth/logout", { method: "POST" });
  return json.message;
}

const authApi = { postRegister, postLogin, postLogout };

export default authApi;