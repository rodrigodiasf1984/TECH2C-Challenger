import type { UploadResponse } from "../../types";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import {
  CheckCircle,
  FileSpreadsheet,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UploadFile } from "../../services/api";
import { schema, type FormData } from "./schema";

interface UploadFormProps {
  onUploadSuccess: (data: UploadResponse) => void;
}

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [isLoading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    clearErrors,
    reset,
  } = form;

  const selectedFile = useWatch({
    control,
    name: "file",
  }) as FileList | undefined;

  const hasFile = selectedFile && selectedFile.length > 0;

  useEffect(() => {
    if (hasFile) {
      if (backendError) {
        setBackendError(null);
      }
      if (errors.file) {
        clearErrors("file");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFile]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setBackendError(null);

    try {
      const response = await UploadFile(data.file[0]);
      onUploadSuccess(response);
    } catch (error) {
      console.error("Upload failed:", error);
      let errorMessage = "An error occurred.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setBackendError(errorMessage);
      reset({ file: undefined }, { keepErrors: false });
    } finally {
      setLoading(false);
    }
  };

  const isErrorState = errors.file || backendError;
  const isDisabled = isLoading || !hasFile || !!errors.file;

  return (
    <form
      data-testid="upload-form"
      onSubmit={handleSubmit(onSubmit)}
      className="2w-full max-w-lg mx-auto"
    >
      <div
        className={clsx(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-in-out",
          isErrorState
            ? "border-red-300 bg-red-50"
            : hasFile
            ? "border-green-300 bg-green-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        )}
      >
        <input
          data-testid="file-input"
          {...register("file")}
          type="file"
          accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          {hasFile ? (
            <>
              <FileSpreadsheet className="w-12 h-12 text-gray-400" />
              <div className="text-sm font-medium text-gray-800">
                {selectedFile[0].name}
              </div>
            </>
          ) : (
            <>
              <UploadCloud className="w-12 h-12 text-gray-400" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">
                  **drop the file or click here to upload the file**
                </p>
                <p className="text-xs text-gray-500">
                  Only .xls and .xlsx files are supported
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {errors.file && (
        <p className="mt-2 text-sm text-red-600 text-center animate-pulse">
          {errors.file.message}
        </p>
      )}
      {backendError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded-lg text-sm text-red-700 text-center animate-pulse">
          {backendError}
        </div>
      )}
      <button
        type="submit"
        disabled={isDisabled}
        className="mt-6 w-full flex justify-center items-center gap-2 py-2.5  px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5" />
            Processing the file...
          </>
        ) : (
          <>
            <CheckCircle className="h-5 w-5" />
            Send File
          </>
        )}
      </button>
    </form>
  );
}
