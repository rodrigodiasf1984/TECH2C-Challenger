import axios, { AxiosError } from "axios";
import type { UploadResponse } from "../types";

const baseURL = "http://localhost:3333/api";

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
    const err = error as AxiosError;
    console.error("Upload error:", err.response?.data || err.message);
    throw new Error(
      err.response?.data
        ? JSON.stringify(err.response.data)
        : "An error occurred while uploading the file."
    );
  }
}
