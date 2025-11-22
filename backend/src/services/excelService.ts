import ExcelJS from 'exceljs'
import { Company } from '../types'

export async function parseExcelBuffer(buffer: Buffer): Promise<Company[]> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer as any)

  const sheet = workbook.getWorksheet(1)
  if (!sheet) return []

  const rows = [] as Company[]

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    const rowData: Company = {
      name: row.getCell(1).text,
      year: Number(row.getCell(2).value),
      sector: row.getCell(3).text,
      energy_consumption: Number(row.getCell(4).value),
      co2_emissions: Number(row.getCell(5).value)
    }

    rows.push(rowData)
  })
  return rows
}
