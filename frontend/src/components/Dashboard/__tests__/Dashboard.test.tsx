import { type ReactNode } from "react";
import { Dashboard } from "..";
import { render, screen } from "@testing-library/react";

interface MockChartProps extends Record<string, unknown> {
  children: ReactNode;
}

jest.mock("recharts", () => {
  const Mock = ({ children }: MockChartProps) => {
    return <div data-testid="recharts-mock-component">{children}</div>;
  };
  return {
    BarChart: Mock,
    Bar: Mock,
    XAxis: Mock,
    YAxis: Mock,
    CartesianGrid: Mock,
    Tooltip: Mock,
    Legend: Mock,
    ResponsiveContainer: Mock,
    PieChart: Mock,
    Pie: Mock,
    Cell: Mock,
  };
});

const mockDashboardData = {
  totalCo2PerYear: [
    { year: 2022, totalEmissions: 6782.53 },
    { year: 2023, totalEmissions: 52226.81 },
  ],
  top5HighEmitters: [
    { company: "Empresa A", totalCo2: 15000 },
    { company: "Empresa B", totalCo2: 12000 },
  ],
  avgEnergyPerCompany: [
    { company: "Empresa D", avgEnergy: 50000 },
    { company: "Empresa E", avgEnergy: 45000 },
  ],
};

describe("Dashboard Component", () => {
  it("Should render all main titles and chart areas", () => {
    render(<Dashboard {...mockDashboardData} />);
    expect(
      screen.getAllByTestId("recharts-mock-component").length
    ).toBeGreaterThan(5);
    expect(
      screen.getByRole("heading", { name: /Total emissions CO₂ \(Anual\)/i })
    ).toBeInTheDocument();
  });

  it("Should render average energy consumption data in the table", () => {
    render(<Dashboard {...mockDashboardData} />);

    expect(
      screen.getByRole("columnheader", { name: /Company/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Empresa D")).toBeInTheDocument();
    expect(screen.getByText("Empresa E")).toBeInTheDocument();
    expect(screen.getByText("50.000")).toBeInTheDocument();
    expect(screen.getByText("45.000")).toBeInTheDocument();
  });
});
