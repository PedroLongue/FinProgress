import axios, { type AxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:3000/api";

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const getData = async <T>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const { data } = await client.get<T>(endpoint, config);
  return data;
};

export const postData = async <TResponse, TBody>(
  endpoint: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> => {
  const { data } = await client.post<TResponse>(endpoint, body, config);
  return data;
};

export const postFormData = async <TResponse>(
  url: string,
  formData: FormData,
) => {
  const { data } = await client.post<TResponse>(url, formData);
  return data;
};

export const patchData = async <TResponse, TBody>(
  endpoint: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> => {
  const { data } = await client.patch<TResponse>(endpoint, body, config);
  return data;
};

export const deleteData = async <TResponse>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<TResponse> => {
  const { data } = await client.delete<TResponse>(endpoint, config);
  return data;
};
