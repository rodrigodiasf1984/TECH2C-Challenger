import { render, screen } from "@testing-library/react";
import App from "../App";
jest.mock("../components/UploadForm", () => ({
  UploadForm: () => <div data-testid="upload-form">Upload Form Mock</div>,
}));

jest.mock("../components/Dashboard", () => ({
  Dashboard: () => <div data-testid="dashboard">Dashboard Mock</div>,
}));

describe("App Component", () => {
  it("should render the navigation and the initial upload form when no indicators are present", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /ESG Analytics Platform/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Upload a file/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("upload-form")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard")).not.toBeInTheDocument();
  });
});
