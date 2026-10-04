import { fetchData } from "../../../helpers/apiHelper";

// GET /users
export async function getUsers() {
  const json = await fetchData("/users");
  return json.data.users;
}

// GET /users/:id
export async function getUserById(id) {
  const json = await fetchData(`/users/${id}`);
  return json.data.user;
}

// GET /users/me
export async function getProfile() {
  const json = await fetchData("/users/me");
  return json.data.user;
}

// PUT /users/me
export async function putProfile(name, email) {
  const json = await fetchData("/users/me", { method: "PUT", body: { name, email } });
  return json.data?.user ?? null;
}

// POST /users/me/photo (multipart/form-data)
export async function postProfilePhoto(photo) {
  const formData = new FormData();
  formData.append("photo", photo);
  const json = await fetchData("/users/me/photo", { method: "POST", body: formData });
  return json.message;
}

// Ganti kata sandi. Modul menyebut PUT /users/me/password, namun server Delcom
// saat ini hanya melayani PUT /users/password (lihat dokumentasi api-users).
export const CHANGE_PASSWORD_PATH = "/users/password";

export async function putProfilePassword(password, newPassword, newPasswordConfirmation) {
  const json = await fetchData(CHANGE_PASSWORD_PATH, {
    method: "PUT",
    body: {
      password,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    },
  });
  return json.message;
}

const userApi = {
  getUsers,
  getUserById,
  getProfile,
  putProfile,
  postProfilePhoto,
  putProfilePassword,
};

export default userApi;
