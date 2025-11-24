import axios from "axios";
import { UploadFile } from "../api";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../api", () => ({
  ...jest.requireActual("../api"),
  API_BASE_URL: "http://mock-api-url.com",
}));
describe("UploadFile()", () => {
  const mockFile = new File(["fake"], "test.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    mockedAxios.post.mockClear();
  });

  it("should upload file successfully", async () => {
    const mockResponse = {
      message: "File uploaded",
      indicators: {
        totalCo2PerYear: [],
        avgEnergyPerCompany: [],
        top5HighEmitters: [],
      },
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await UploadFile(mockFile);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/upload-excel",
      expect.any(FormData),
      {
        baseURL: "http://mock-api-url.com",
        timeout: 15000,
      }
    );

    expect((mockedAxios.post.mock.calls[0][1] as FormData).get("file")).toBe(
      mockFile
    );
    expect(result).toEqual(mockResponse);
  });

  it("should throw backend error when has error field", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { error: "Invalid Excel format" } },
    });
    await expect(UploadFile(mockFile)).rejects.toThrow("Invalid Excel format");
  });

  it("should throw generic error when no error field", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { error: "An error occurred" } },
    });
    await expect(UploadFile(mockFile)).rejects.toThrow(/An error occurred/);
  });

  it("should handle network error", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      isAxiosError: true,
      request: {},
      message: "Network Error",
    });
    await expect(UploadFile(mockFile)).rejects.toThrow(/An error occurred/);
  });
});
