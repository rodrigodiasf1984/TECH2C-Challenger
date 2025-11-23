import ExcelJS from "exceljs";
import { Company } from "../../types";
import { EXPECTED_HEADERS } from "../../constants";

export async function parseExcelBuffer(buffer: Buffer): Promise<Company[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as any);

  const sheet = workbook.getWorksheet(1);
  if (!sheet) {
    throw new Error("Worksheet not found");
  }

  const headerRow = sheet.getRow(1);

  if (!headerRow) {
    throw new Error("The file don't have headers");
  }

  const actualHeaders = EXPECTED_HEADERS.map((_, index) =>
    headerRow.getCell(index + 1).text.trim()
  );

  const headersMatch = EXPECTED_HEADERS.every(
    (expectedHeader, index) => actualHeaders[index] === expectedHeader
  );

  if (!headersMatch) {
    const expected = EXPECTED_HEADERS.join(" | ");
    const received = actualHeaders.join(" | ");

    throw new Error(
      `Invalid headers. Expected: [${expected}]. Received: [${received}]`
    );
  }

  const rows = [] as Company[];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const name = row.getCell(1).text.trim();
    const year = row.getCell(2).value;
    const sector = row.getCell(3).text.trim();
    const energy_consumption = row.getCell(4).value;
    const co2_emissions = row.getCell(5).value;

    const isNameValid = !!name;
    const isYearValid = year != null && !isNaN(Number(year));
    const isSectorValid = !!sector;
    const isEnergyConsumptionValid =
      energy_consumption != null && !isNaN(Number(energy_consumption));
    const isCo2EmissionsValid =
      co2_emissions != null && !isNaN(Number(co2_emissions));

    if (
      !isNameValid ||
      !isSectorValid ||
      !isYearValid ||
      !isEnergyConsumptionValid ||
      !isCo2EmissionsValid
    )
      return;

    const rowData: Company = {
      name: row.getCell(1).text,
      year: Number(row.getCell(2).value),
      sector: row.getCell(3).text,
      energy_consumption: Number(row.getCell(4).value),
      co2_emissions: Number(row.getCell(5).value),
    };

    rows.push(rowData);
  });

  if (rows.length === 0) {
    throw new Error("File only contains headers or no valid data rows.");
  }
  return rows;
}
