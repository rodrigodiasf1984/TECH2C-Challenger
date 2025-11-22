import { Company, IndicatorsStats } from "../../types";

export const calculateIndicators = (data: Company[]): IndicatorsStats => {
  const yearGroups: Record<number, number> = {};
  const companyGroups: Record<
    string,
    {
      totalEnergy: number;
      count: number;
      totalCo2: number;
    }
  > = {};

  data.forEach((row) => {
    if (!yearGroups[row.year]) {
      yearGroups[row.year] = 0;
    }
    yearGroups[row.year] += row.co2_emissions;

    if (!companyGroups[row.name]) {
      companyGroups[row.name] = { totalEnergy: 0, count: 0, totalCo2: 0 };
    }
    companyGroups[row.name].totalEnergy += row.energy_consumption;
    companyGroups[row.name].totalCo2 += row.co2_emissions;
    companyGroups[row.name].count += 1;
  });

  const totalCo2PerYear = Object.entries(yearGroups).map(
    ([year, totalEmissions]) => ({
      year: Number(year),
      totalEmissions: Number(totalEmissions.toFixed(2)),
    })
  );

  const avgEnergyPerCompany = Object.entries(companyGroups).map(
    ([name, stats]) => ({
      company: name,
      avgEnergy: Number((stats.totalEnergy / stats.count).toFixed(2)),
    })
  );

  const top5HighEmitters = Object.entries(companyGroups)
    .map(([name, stats]) => ({
      company: name,
      totalCo2: Number(stats.totalCo2.toFixed(2)),
    }))
    .sort((a, b) => b.totalCo2 - a.totalCo2)
    .slice(0, 5);

  return {
    totalCo2PerYear,
    avgEnergyPerCompany,
    top5HighEmitters,
  };
};
