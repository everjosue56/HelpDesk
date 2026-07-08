import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

// Creamos la instancia base que apunta a tu API
export const AXIOS_INSTANCE = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: any[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return AXIOS_INSTANCE(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentToken = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
          {
            accessToken: currentToken,
            refreshToken: refreshToken,
          },
        );

        const { token: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        localStorage.setItem("token", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Reconfiguramos la petición original que había fallado con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Desbloqueamos todas las peticiones que se quedaron esperando en la cola
        processQueue(null, newAccessToken);

        // Reejecutamos la petición original automáticamente
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        //  EL REFRESH TOKEN TAMBIÉN MURIÓ O ES INVÁLIDO: Expulsión inmediata
        processQueue(refreshError, null);

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// Este es el "mutador" que Orval exige para personalizar y envolver las peticiones autogeneradas
export const customInstance = <T>(
  config: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return AXIOS_INSTANCE(config);
};

export default customInstance;
