import axios, { AxiosError, AxiosRequestConfig } from "axios";

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach token to requests
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("userTokenLexMedica");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag to avoid infinite loops
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Handle 401 response (unauthorized)
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${token}`,
              };
              resolve(httpClient(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("userRefreshTokenLexMedica");

        const response = await axios.post(
          `${
            process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"
          }/auth/refresh_token`,
          { refreshToken }
        );

        const newToken = response.data.token;

        // Save updated tokens
        localStorage.setItem("userTokenLexMedica", newToken);

        processQueue(null, newToken);

        // Retry original request with new token
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return httpClient(originalRequest);
      } catch (err) {
        // Refresh Token Expired
        processQueue(err, null);
        // Remove user data from local storage
        localStorage.removeItem("userIdLexMedica");
        localStorage.removeItem("userEmailLexMedica");
        localStorage.removeItem("userTokenLexMedica");
        localStorage.removeItem("userRefreshTokenLexMedica");
        window.location.href = "/login";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
