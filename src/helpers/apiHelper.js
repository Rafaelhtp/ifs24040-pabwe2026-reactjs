const TOKEN_KEY = "accessToken";

const apiHelper = (() => {
  function getAccessToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function putAccessToken(token) {
    if (!token) {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  function removeAccessToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  async function fetchData(url, options = {}) {
    const urlParts = url.split("?");
    let cleanUrl = urlParts[0];
    const queryString = urlParts[1] ? `?${urlParts[1]}` : "";

    if (cleanUrl.endsWith("/")) {
      cleanUrl = cleanUrl.slice(0, -1);
    }

    const fullUrl = cleanUrl + queryString;
    const token = getAccessToken();

    const headers = {
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(fullUrl, {
      ...options,
      headers,
    });
  }

  return {
    fetchData,
    putAccessToken,
    getAccessToken,
    removeAccessToken,
  };
})();

export const getAccessToken = apiHelper.getAccessToken;
export const putAccessToken = apiHelper.putAccessToken;
export const removeAccessToken = apiHelper.removeAccessToken;
export const fetchData = apiHelper.fetchData;

export default apiHelper;
