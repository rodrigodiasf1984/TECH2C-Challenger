import { calculateIndicators } from "..";
import { Company } from "../../../types";

describe("StasServices tests", () => {
  const mockData: Company[] = [
    {
      name: "CompanyA",
      year: 2022,
      sector: "Tech",
      energy_consumption: 100,
      co2_emissions: 50,
    },
    {
      name: "CompanyB",
      year: 2022,
      sector: "Tech",
      energy_consumption: 200,
      co2_emissions: 150,
    },
    {
      name: "CompanyA",
      year: 2023,
      sector: "Energy",
      energy_consumption: 50,
      co2_emissions: 30,
    },
    {
      name: "CompanyC",
      year: 2023,
      sector: "Tech",
      energy_consumption: 100,
      co2_emissions: 40,
    },
    {
      name: "CompanyD",
      year: 2023,
      sector: "Tech",
      energy_consumption: 100,
      co2_emissions: 50,
    },
    {
      name: "CompanyE",
      year: 2023,
      sector: "Tech",
      energy_consumption: 100,
      co2_emissions: 30,
    },
    {
      name: "CompanyF",
      year: 2023,
      sector: "Tech",
      energy_consumption: 100,
      co2_emissions: 40,
    },
  ];

  it("should calculate the total of Co2 emissions per year", () => {
    const result = calculateIndicators(mockData);

    expect(result.totalCo2PerYear).toEqual([
      { year: 2022, totalEmissions: 200 },
      { year: 2023, totalEmissions: 190 },
    ]);
  });
  it("should calculate the average energy consumption per company", () => {
    const result = calculateIndicators(mockData);

    expect(result.avgEnergyPerCompany).toEqual([
      { company: "CompanyA", avgEnergy: 75 },
      { company: "CompanyB", avgEnergy: 200 },
      { company: "CompanyC", avgEnergy: 100 },
      { company: "CompanyD", avgEnergy: 100 },
      { company: "CompanyE", avgEnergy: 100 },
      { company: "CompanyF", avgEnergy: 100 },
    ]);
  });

  it("should calculate the top 5 high emitters", () => {
    const result = calculateIndicators(mockData);

    expect(result.top5HighEmitters).toEqual([
      { company: "CompanyB", totalCo2: 150 },
      { company: "CompanyA", totalCo2: 80 },
      { company: "CompanyD", totalCo2: 50 },
      { company: "CompanyC", totalCo2: 40 },
      { company: "CompanyF", totalCo2: 40 },
    ]);
  });
});
