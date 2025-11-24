import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UploadForm } from "../index";
import { UploadFile } from "../../../services/api";
import type { IndicatorsStats, UploadResponse } from "../../../types";

jest.mock("../../../services/api");
const mockUploadFile = UploadFile as jest.MockedFunction<typeof UploadFile>;

const mockIndicatorsStats: IndicatorsStats = {
  totalCo2PerYear: [{ year: 2023, totalEmissions: 100 }],
  avgEnergyPerCompany: [{ company: "A", avgEnergy: 50 }],
  top5HighEmitters: [{ company: "B", totalCo2: 20 }],
};
const mockUploadResponse: UploadResponse = {
  message: "File uploaded successfully",
  indicators: mockIndicatorsStats,
};

const mockFile = new File(["dummy content"], "test-data.xlsx", {
  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});

const mockOnUploadSuccess = jest.fn();

const renderDashboardComponent = () =>
  render(<UploadForm onUploadSuccess={mockOnUploadSuccess} />);

describe("UploadForm Component", () => {
  jest.useFakeTimers();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnUploadSuccess.mockClear();
    mockUploadFile.mockResolvedValue(mockUploadResponse);
  });

  it("should render correctly in the initial state and show the upload prompt", () => {
    renderDashboardComponent();
    expect(
      screen.getByText(/drop the file or click here to upload the file/i)
    ).toBeInTheDocument();

    const sendButton = screen.getByRole("button", { name: /Send File/i });
    expect(sendButton).toBeDisabled();
  });

  it("should display the selected file name when a valid file is chosen", async () => {
    renderDashboardComponent();
    const fileInput = screen.getByTestId("file-input");

    await waitFor(() => {
      fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });
    });

    expect(screen.getByText(mockFile.name)).toBeInTheDocument();
    const sendButton = screen.getByRole("button", { name: /Send File/i });
    expect(sendButton).not.toBeDisabled();
  });
  it("should call UploadFile and onUploadSuccess on successful submission", async () => {
    let resolveMock: (value: UploadResponse) => void;
    mockUploadFile.mockImplementationOnce(
      () =>
        new Promise<UploadResponse>((resolve) => {
          resolveMock = resolve;
        })
    );

    renderDashboardComponent();

    const fileInput = screen.getByTestId("file-input");
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const sendButton = screen.getByRole("button", { name: /Send File/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Processing the file.../i)).toBeInTheDocument();
    });

    (resolveMock! as (value: UploadResponse) => void)(mockUploadResponse);

    await waitFor(() => {
      expect(mockUploadFile).toHaveBeenCalledWith(mockFile);

      expect(mockOnUploadSuccess).toHaveBeenCalledWith(mockUploadResponse);

      expect(
        screen.queryByText(/Processing the file.../i)
      ).not.toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /Send File/i })
      ).toBeInTheDocument();
    });
  });

  it("should display error message on API failure", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const errorMessage = "Invalid file size or format.";
    mockUploadFile.mockRejectedValue(new Error(errorMessage));

    renderDashboardComponent();

    const fileInput = screen.getByTestId("file-input");
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const sendButton = screen.getByRole("button", { name: /Send File/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockOnUploadSuccess).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("should display validation error message when file input is empty on submit", async () => {
    renderDashboardComponent();
    const sendButton = screen.getByRole("button", { name: /Send File/i });
    fireEvent.click(sendButton);
    expect(screen.queryByText(/File required/i)).not.toBeInTheDocument();
  });
});
