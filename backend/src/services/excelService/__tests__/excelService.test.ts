import { parseExcelBuffer } from "..";
import { Company } from "../../../types";

jest.mock("exceljs", () => {
  const mockEachRow = jest.fn((callback) => {
    callback({ getCell: () => ({ text: "Header" }) }, 1);
    callback(
      {
        getCell: (col: number) => {
          switch (col) {
            case 1:
              return { text: "Comp A" };
            case 2:
              return { value: 2022 };
            case 3:
              return { text: "Tech" };
            case 4:
              return { value: 100 };
            case 5:
              return { value: 50 };
            default:
              return { text: "" };
          }
        },
      },
      2
    );

    callback(
      {
        getCell: (col: number) => {
          switch (col) {
            case 1:
              return { text: "Comp B" };
            case 2:
              return { value: 2023 };
            case 3:
              return { text: "Energy" };
            case 4:
              return { value: 200.5 };
            case 5:
              return { value: 150.7 };
            default:
              return { text: "" };
          }
        },
      },
      3
    );
  });

  return {
    Workbook: jest.fn(() => ({
      xlsx: {
        load: jest.fn(),
      },
      getWorksheet: jest.fn((index) => {
        if (index === 1) {
          return {
            eachRow: mockEachRow,
          };
        }
        return undefined;
      }),
    })),
  };
});

describe("excelService", () => {
  const mockBuffer = Buffer.from("dummy-excel-data");

  const expectedCompanies: Company[] = [
    {
      name: "Comp A",
      year: 2022,
      sector: "Tech",
      energy_consumption: 100,
      co2_emissions: 50,
    },
    {
      name: "Comp B",
      year: 2023,
      sector: "Energy",
      energy_consumption: 200.5,
      co2_emissions: 150.7,
    },
  ];

  it("should correctly parse the Excel buffer and return company data", async () => {
    const result = await parseExcelBuffer(mockBuffer);

    expect(result).toHaveLength(2);
    expect(result).toEqual(expectedCompanies);

    const ExcelJSMock = require("exceljs").Workbook;
    const workbookInstance = ExcelJSMock.mock.results[0].value;
    const worksheetInstance = workbookInstance.getWorksheet(1);

    expect(worksheetInstance.eachRow).toHaveBeenCalled();
  });

  it("should return an empty array if the worksheet is not found", async () => {
    const ExcelJSMock = require("exceljs").Workbook;
    ExcelJSMock.mockImplementationOnce(() => ({
      xlsx: { load: jest.fn() },
      getWorksheet: jest.fn(() => undefined),
    }));

    const result = await parseExcelBuffer(mockBuffer);

    expect(result).toEqual([]);
  });
});
