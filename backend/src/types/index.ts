export interface IndicatorsStats {
  totalCo2PerYear: {
    year: number
    totalEmissions: number
  }[]
  avgEnergyPerCompany: {
    company: string
    avgEnergy: number
  }[]
  top5HighEmitters: {
    company: string
    totalCo2: number
  }[]
}

export interface Company {
  name: string
  year: number
  sector: string
  energy_consumption: number
  co2_emissions: number
}

export interface UploadResponse {
  message: string
  indicators: IndicatorsStats
}
