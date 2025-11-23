import fs from "fs";
import { Request, Response } from "express";
import { handleUploadExcelFile } from "..";
import { parseExcelBuffer } from "../../../services/excelService";
import { calculateIndicators } from "../../../services/statsService";

jest.mock("fs");
jest.mock("../../../services/excelService");
jest.mock("../../../services/statsService");

describe("ExcelFileController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response;
  });

  it("should return 400 if no file is sent", async () => {
    mockRequest = {};

    await handleUploadExcelFile(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: "File not sent" });
  });

  it("should process the file successfully and return indicators", async () => {
    mockRequest = {
      file: {
        path: "temp/path/test.xlsx",
      } as Express.Multer.File,
    };

    const mockBuffer = Buffer.from("mock-content");
    const mockParsedData = [{ name: "Company A" }];
    const mockIndicators = { totalCo2PerYear: [] };

    (fs.readFileSync as jest.Mock).mockReturnValue(mockBuffer);
    (parseExcelBuffer as jest.Mock).mockResolvedValue(mockParsedData);
    (calculateIndicators as jest.Mock).mockReturnValue(mockIndicators);

    await handleUploadExcelFile(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(fs.readFileSync).toHaveBeenCalledWith("temp/path/test.xlsx");
    expect(parseExcelBuffer).toHaveBeenCalledWith(mockBuffer);
    expect(calculateIndicators).toHaveBeenCalledWith(mockParsedData);
    expect(fs.unlinkSync).toHaveBeenCalledWith("temp/path/test.xlsx");

    expect(jsonMock).toHaveBeenCalledWith({
      message: "File processed",
      indicators: mockIndicators,
    });
  });

  it("should return 400 if excel parsing fails (e.g., invalid headers)", async () => {
    mockRequest = {
      file: {
        path: "temp/path/invalid.xlsx",
      } as Express.Multer.File,
    };

    const errorMessage = "Invalid headers. Expected: [A]. Received: [B]";

    (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from("data"));
    (parseExcelBuffer as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await handleUploadExcelFile(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(console.log).toHaveBeenCalled;
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage });
  });

  it("should return 400 with generic message if an unknown error occurs", async () => {
    mockRequest = {
      file: { path: "path" } as any,
    };

    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw "Unexpected string error";
    });

    await handleUploadExcelFile(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Error while processing the file.",
    });
  });
});
