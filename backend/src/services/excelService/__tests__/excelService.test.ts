import { parseExcelBuffer } from "..";
import { EXPECTED_HEADERS } from "../../../constants";

const MOCK_EXPECTED_HEADERS = [
  "Empresa",
  "Ano",
  "Setor",
  "Consumo de Energia",
  "Emissões de CO2 (toneladas)",
];

jest.mock("../../../constants", () => ({
  EXPECTED_HEADERS: [
    "Empresa",
    "Ano",
    "Setor",
    "Consumo de Energia",
    "Emissões de CO2 (toneladas)",
  ],
}));

const mockGetRow = jest.fn();
const mockEachRow = jest.fn();
const mockGetWorksheet = jest.fn();
const mockLoad = jest.fn();

jest.mock("exceljs", () => {
  return {
    Workbook: jest.fn().mockImplementation(() => ({
      xlsx: {
        load: mockLoad,
      },
      getWorksheet: mockGetWorksheet,
    })),
  };
});

describe("excelService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should correctly parse the Excel buffer and return company data", async () => {
    mockGetRow.mockImplementation((rowNumber) => {
      if (rowNumber === 1) {
        return {
          getCell: (index: number) => ({
            text: MOCK_EXPECTED_HEADERS[index - 1],
          }),
        };
      }
    });

    mockEachRow.mockImplementation((callback) => {
      callback(
        {
          getCell: (idx: number) => ({ text: MOCK_EXPECTED_HEADERS[idx - 1] }),
        },
        1
      );
      callback(
        {
          getCell: (col: number) => {
            const cells: any = {
              1: { text: "Company A" },
              2: { value: 2023 },
              3: { text: "Tech" },
              4: { value: 1000 },
              5: { value: 500 },
            };
            return cells[col] || { text: "" };
          },
        },
        2
      );
    });

    mockGetWorksheet.mockReturnValue({
      getRow: mockGetRow,
      eachRow: mockEachRow,
    });

    const buffer = Buffer.from("dummy");
    const result = await parseExcelBuffer(buffer);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: "Company A",
      year: 2023,
      sector: "Tech",
      energy_consumption: 1000,
      co2_emissions: 500,
    });
    expect(mockGetRow).toHaveBeenCalledWith(1);
  });

  it("should throw error if the worksheet is not found", async () => {
    mockGetWorksheet.mockReturnValue(undefined);
    const buffer = Buffer.from("dummy");
    await expect(parseExcelBuffer(buffer)).rejects.toThrow(
      "Worksheet not found"
    );
  });

  it("should throw error if headers are invalid", async () => {
    mockGetRow.mockImplementation((rowNumber) => {
      if (rowNumber === 1) {
        return {
          getCell: (index: number) => ({
            text:
              index === 1 ? "Wrong Header" : MOCK_EXPECTED_HEADERS[index - 1],
          }),
        };
      }
    });

    mockGetWorksheet.mockReturnValue({
      getRow: mockGetRow,
      eachRow: mockEachRow,
    });

    const buffer = Buffer.from("dummy");

    await expect(parseExcelBuffer(buffer)).rejects.toThrow(/Invalid headers/);
  });

  it("should throw error if file contains only headers (no data rows)", async () => {
    mockGetRow.mockImplementation((rowNumber) => {
      if (rowNumber === 1) {
        return {
          getCell: (index: number) => ({
            text: MOCK_EXPECTED_HEADERS[index - 1],
          }),
        };
      }
    });

    mockEachRow.mockImplementation((callback) => {
      callback(
        {
          getCell: (idx: number) => ({ text: MOCK_EXPECTED_HEADERS[idx - 1] }),
        },
        1
      );
    });

    mockGetWorksheet.mockReturnValue({
      getRow: mockGetRow,
      eachRow: mockEachRow,
    });

    const buffer = Buffer.from("dummy");

    await expect(parseExcelBuffer(buffer)).rejects.toThrow(
      "File only contains headers or no valid data rows."
    );
  });
});
