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
  noteSchema,
  createNoteSchema,
  type CreateNoteInput,
  type GetNotesInput,
  type GetNotesResponse,
  type Note,
  type UpdateNoteInput,
  updateNoteSchema,
} from "../schemas/noteSchemas";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";

export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum HTTPStatusCode {
  OK = 200,
}

const BASE_URL = import.meta.env.VITE_SERVER_URL ?? "/api";

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
  requestSchema?: z.ZodType<Request>;
  responseSchema: z.ZodType<Response>;
}): (data?: Request) => Promise<Response> {
  return function (requestData?: Request) {
    if (requestSchema) requestSchema.parse(requestData);

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

export const refreshAccessTokenFn = api<undefined, LoginResponse>({
  method: HTTPMethod.GET,
  path: "/users/refresh",
  responseSchema: loginResponseSchema,
});

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
  path: "/users",
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

export const createNoteFn = api<CreateNoteInput, Note>({
  method: HTTPMethod.POST,
  path: "/notes",
  requestSchema: createNoteSchema,
  responseSchema: noteSchema,
});

export const updateNoteFn = (id: number) =>
  api<UpdateNoteInput, Note>({
    method: HTTPMethod.PATCH,
    path: `/notes/${id}`,
    requestSchema: updateNoteSchema,
    responseSchema: noteSchema,
  });

export const deleteNoteFn = (id: number) =>
  api<undefined, Note>({
    method: HTTPMethod.DELETE,
    path: `/notes/${id}`,
    responseSchema: noteSchema,
  });
