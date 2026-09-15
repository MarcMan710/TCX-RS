import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Environment variable or default local Go backend server URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

/**
 * Standardized API Error structure thrown by service calls
 */
export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Axios instance pre-configured for the Go backend
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request Interceptor: Injects Auth Bearer Token into headers
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Standardizes response processing and error Handling
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Unwraps response if the Go backend uses a standard { data: ... } wrapper
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const responseData: any = error.response.data;

      // Extract backend error message if available
      const message =
        responseData?.message ||
        responseData?.error ||
        `HTTP Error ${status}: ${error.response.statusText}`;

      // Global status handling (e.g., auto-logout on 401 Unauthorized)
      if (status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        // Optionally redirect to login: window.location.href = "/login";
      }

      return Promise.reject(new ApiError(message, status, responseData));
    } else if (error.request) {
      // Network error / Go backend unreachable
      return Promise.reject(
        new ApiError("Network error: Unable to reach backend server.", 0)
      );
    }

    return Promise.reject(new ApiError(error.message, 500));
  }
);

/**
 * Central API Client Helper Methods
 */
export const api = {
  /**
   * Send a GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  /**
   * Send a POST request
   */
  async post<T>(url: string, body?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post<T>(url, body, config);
    return response.data;
  },

  /**
   * Send a PUT request
   */
  async put<T>(url: string, body?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.put<T>(url, body, config);
    return response.data;
  },

  /**
   * Send a PATCH request
   */
  async patch<T>(url: string, body?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.patch<T>(url, body, config);
    return response.data;
  },

  /**
   * Send a DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};

export default apiClient;