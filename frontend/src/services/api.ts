// src/services/api.ts
import axios, { AxiosError } from "axios";
import type { BackendError, UploadResponse } from "../types";

// Exportamos para poder mockar nos testes
export const API_BASE_URL =
  import.meta.env.VITE_BASE_URL ?? "http://localhost:3000";

const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 15000,
};

export async function UploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    // Usamos apenas a rota, NUNCA concatenamos com API_BASE_URL
    const { data } = await axios.post<UploadResponse>(
      "/upload-excel",
      formData,
      axiosConfig
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<BackendError>;

    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }

    throw new Error(
      "An error occurred while uploading the file. " +
        (err.message || "Unknown error")
    );
  }
}
