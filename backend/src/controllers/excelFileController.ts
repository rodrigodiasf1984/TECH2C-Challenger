import { Request, Response } from "express";
import fs from "fs";
import { parseExcelBuffer } from "../services/excelService";
import { calculateIndicators } from "../services/statsService";
import { UploadResponse } from "../types";

type ErrorResponse = { error: string };

export const handleUploadExcelFile = async (
  req: Request,
  res: Response<UploadResponse | ErrorResponse>
): Promise<Response> => {
  try {
    if (!req.file) return res.status(400).json({ error: "File not sent" });
    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);
    const fileData = await parseExcelBuffer(buffer);
    const indicators = calculateIndicators(fileData);
    fs.unlinkSync(filePath);
    return res.json({
      message: "File processed",
      indicators: indicators,
    });
  } catch (error) {
    console.log("upload error:", error);
    return res.status(500).json({ error: "Error while processing the file" });
  }
};
