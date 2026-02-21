import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BillCreateModal } from ".";
import { vi } from "vitest";

const onCloseMock = vi.fn();
const onAddMock = vi.fn();
const onScanMock = vi.fn();

describe("BillCreateModal Component", () => {
  const defaultProps = {
    isOpen: true,
    onClose: onCloseMock,
    onAdd: onAddMock,
    onScan: onScanMock,
    isScanning: false,
    scanComplete: false,
    isManualSaving: false,
    manualSaveComplete: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    render(<BillCreateModal {...defaultProps} />);
  });

  it("should render component without crashing", () => {
    expect(screen.getByTestId("bill-create-modal")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar Boleto")).toBeInTheDocument();
  });

  it("should close when close button is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("bill-create-close-button"));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("should switch to manual mode", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("bill-create-mode-manual"));
    expect(screen.getByTestId("bill-manual-form")).toBeInTheDocument();
  });

  it("should show scan error when uploading non-PDF file", async () => {
    const input = screen.getByTestId("bill-pdf-input") as HTMLInputElement;
    const file = new File(["x"], "file.txt", { type: "text/plain" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(await screen.findByTestId("bill-scan-error")).toBeInTheDocument();
    expect(screen.getByText("Envie um arquivo PDF.")).toBeInTheDocument();
    expect(onScanMock).not.toHaveBeenCalled();
  });

  it("should call onScan when uploading valid PDF", async () => {
    const user = userEvent.setup();

    const input = screen.getByTestId("bill-pdf-input") as HTMLInputElement;
    const file = new File(["%PDF-1.4"], "boleto.pdf", {
      type: "application/pdf",
    });

    await user.upload(input, file);

    expect(onScanMock).toHaveBeenCalledWith(file);
  });

  it("should show error when PDF is larger than 10MB", async () => {
    const input = screen.getByTestId("bill-pdf-input") as HTMLInputElement;

    const largeFile = new File(
      [new Uint8Array(11 * 1024 * 1024)],
      "large.pdf",
      { type: "application/pdf" },
    );

    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(await screen.findByTestId("bill-scan-error")).toBeInTheDocument();
    expect(
      screen.getByText("PDF muito grande (máx. 10MB)."),
    ).toBeInTheDocument();

    expect(onScanMock).not.toHaveBeenCalled();
  });

  it("should show validation errors on empty manual submit", async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId("bill-create-mode-manual"));
    await user.click(screen.getByTestId("bill-manual-submit-button"));

    expect(await screen.findByTestId("bill-title-error")).toBeInTheDocument();
    expect(await screen.findByTestId("bill-amount-error")).toBeInTheDocument();
    expect(await screen.findByTestId("bill-dueDate-error")).toBeInTheDocument();

    expect(onAddMock).not.toHaveBeenCalled();
  });

  it("should submit manual form correctly", async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId("bill-create-mode-manual"));

    await user.type(screen.getByTestId("bill-title-input"), "Conta de Luz");
    await user.type(screen.getByTestId("bill-amount-input"), "189.90");
    await user.type(screen.getByTestId("bill-dueDate-input"), "2026-01-01");
    await user.type(screen.getByTestId("bill-barcode-input"), "123");
    await user.type(
      screen.getByTestId("bill-description-input"),
      "ENEL - Jan/2026",
    );

    await user.click(screen.getByTestId("bill-manual-submit-button"));

    expect(onAddMock).toHaveBeenCalledWith({
      title: "Conta de Luz",
      amount: 189.9,
      dueDate: "2026-01-01",
      barcode: "123",
      description: "ENEL - Jan/2026",
    });
  });

  it("should handle drag and drop with valid PDF file", async () => {
    const dropzone = screen.getByTestId("bill-upload-dropzone");

    const file = new File(["%PDF-1.4"], "boleto.pdf", {
      type: "application/pdf",
    });

    fireEvent.dragOver(dropzone);

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(onScanMock).toHaveBeenCalledWith(file);
  });
});
