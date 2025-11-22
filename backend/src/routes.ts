import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/upload";
import { handleUploadExcelFile } from "./controllers/excelFileController";

const routes = Router();
const upload = multer(uploadConfig);

routes.get("/api/status", (_req, res) => {
  res.json({ status: "ok", message: "Server running!" });
});

routes.post("/api/upload-excel", upload.single("file"), handleUploadExcelFile);

export default routes;
