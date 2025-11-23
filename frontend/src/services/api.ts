import axios, { AxiosError } from "axios";
import type { UploadResponse } from "../types";
interface BackendError {
  error: string;
}

const baseURL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL,
  timeout: 15000,
});

export async function UploadFile(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<UploadResponse>("/upload-excel", formData);
    return data;
  } catch (error) {
    const err = error as AxiosError<BackendError>;
    console.error("Upload error:", err.response?.data || err.message);
    if (err.response?.data.error) {
      throw new Error(err.response.data.error);
    }
    throw new Error(
      "An error occurred while uploading the file. " + err.message
    );
  }
}
