import request from "supertest";
import express from "express";
import path from "path";
import fs from "fs";
import routes from "..";

let mockHandleUploadExcelFile: jest.Mock;

jest.mock("../../controllers/excelFileController", () => ({
  handleUploadExcelFile: (...args: any[]) => mockHandleUploadExcelFile(...args),
}));

mockHandleUploadExcelFile = jest.fn((req, res) => {
  res.json({ message: "Upload successful and handled", file: req.file });
});

jest.mock("../../config/upload", () => ({
  dest: "mock-uploads",
}));

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  unlinkSync: jest.fn(),
}));

const app = express();
app.use(routes);

describe("API Routes Tests", () => {
  let originalMockImplementation: ((req: any, res: any) => void) | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHandleUploadExcelFile.mockClear();
  });
  it("GET /api/status should return 200 with status ok", async () => {
    const response = await request(app).get("/api/status");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "ok", message: "Server running!" });
  });

  describe("Routes", () => {
    const mockFilePath = path.join(__dirname, "test-file.txt");
    const mockFileName = "test-file.txt";
    beforeAll(() => {
      fs.writeFileSync(mockFilePath, "Content Test");
      originalMockImplementation =
        mockHandleUploadExcelFile.getMockImplementation() as
          | ((req: any, res: any) => void)
          | undefined;
    });

    afterAll(() => {
      jest.requireActual("fs").unlinkSync(mockFilePath);
      if (originalMockImplementation) {
        mockHandleUploadExcelFile.mockImplementation(
          originalMockImplementation
        );
      } else {
        mockHandleUploadExcelFile.mockImplementation(undefined);
      }
    });

    it("should successfully handle file upload and call the controller", async () => {
      mockHandleUploadExcelFile.mockImplementation((req, res) => {
        res.json({ message: "Upload successful and handled", file: req.file });
      });

      const response = await request(app)
        .post("/api/upload-excel")
        .attach("file", mockFilePath);

      expect(mockHandleUploadExcelFile).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(200);

      const reqFileArgument = mockHandleUploadExcelFile.mock.calls[0][0].file;
      expect(reqFileArgument).toBeDefined();
      expect(reqFileArgument.fieldname).toBe("file");
      expect(reqFileArgument.originalname).toBe(mockFileName);
    });

    it("should call controller but req.file should be undefined when no file is attached", async () => {
      mockHandleUploadExcelFile.mockImplementationOnce((req, res) => {
        if (!req.file) {
          return res.status(400).json({ error: "File not sent" });
        }
        res.status(200).json({ message: "Success" });
      });

      const response = await request(app).post("/api/upload-excel").send({});

      expect(mockHandleUploadExcelFile).toHaveBeenCalledTimes(1);

      const reqFileArgument = mockHandleUploadExcelFile.mock.calls[0][0].file;
      expect(reqFileArgument).toBeUndefined();

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: "File not sent" });
    });
  });
});
