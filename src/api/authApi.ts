import {
  loginResponseSchema,
  loginUserSchema,
  registerUserSchema,
  userResponseSchema,
  type LoginResponse,
  type LoginUserInput,
  type RegisterUser,
  type UserResponse,
} from "@/schemas/userSchemas";
import axios from "axios";
import type { z } from "zod";
import {
  getNotesInput,
  getNotesResponse,
  type GetNotesInput,
  type GetNotesResponse,
} from "../schemas/noteSchemas";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";

export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
}

export enum HTTPStatusCode {
  OK = 200,
}

const BASE_URL = "http://localhost:3000/api/";

const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

authApi.defaults.headers.common["Content-Type"] = "application/json";

export default function api<Request, Response>({
  method,
  path,
  requestSchema,
  responseSchema,
}: {
  method: HTTPMethod;
  path: string;
  requestSchema: z.ZodType<Request>;
  responseSchema: z.ZodType<Response>;
}): (data: Request) => Promise<Response> {
  return function (requestData: Request) {
    requestSchema.parse(requestData);

    async function apiCall() {
      const authStore = useAuthStore();
      const { accessToken } = storeToRefs(authStore);
      const Authorization = accessToken ? `Bearer ${accessToken.value}` : "";

      const response = await authApi({
        method,
        url: path,
        [method === HTTPMethod.GET ? "params" : "data"]: requestData,
        headers: {
          Authorization,
        },
      });

      return responseSchema.parse(response.data);
    }

    return apiCall();
  };
}

export const refreshAccessTokenFn = async () => {
  const response = await authApi.get("users/refresh");
  return response.data;
};

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log(error);
    const originalRequest = error.config;
    const errMessage = error.response.data.message as string;
    const authStore = useAuthStore();
    const { setAccessToken } = authStore;

    if (
      errMessage.includes("Authorization token expired") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const response = await refreshAccessTokenFn();
      setAccessToken(response.accessToken);
      return authApi(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const signUpUserFn = api<RegisterUser, UserResponse>({
  method: HTTPMethod.POST,
  path: "/users/register",
  requestSchema: registerUserSchema,
  responseSchema: userResponseSchema,
});

export const loginUserFn = api<LoginUserInput, LoginResponse>({
  method: HTTPMethod.POST,
  path: "/users/login",
  requestSchema: loginUserSchema,
  responseSchema: loginResponseSchema,
});

export const logoutUserFn = async () => {
  const response = await authApi.post("users/logout");
  return response.data;
};

export const getNotesFn = api<GetNotesInput, GetNotesResponse>({
  method: HTTPMethod.GET,
  path: "/notes",
  requestSchema: getNotesInput,
  responseSchema: getNotesResponse,
});
