import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import InitialFloorLayout from "../../../../src/screens/manager/InitialFloorLayout";
import FloorFormDialog from "../../../../src/screens/manager/FloorNameDialog";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Mock FloorNameDialog component to simplify testing
vi.mock("./FloorNameDialog", () => ({
  default: ({ open, onClose }) =>
    open && (
      <div data-testid="dialog">
        <button onClick={onClose}>Close Dialog</button>
      </div>
    ),
}));

// Mocking the necessary modules
vi.mock("axios");
// Partially mock react-toastify
vi.mock("react-toastify", async () => {
  const original = await vi.importActual("react-toastify"); // Import original module

  return {
    ...original, // Spread the original exports to keep ToastContainer working
    toast: {
      success: vi.fn(), // Mock only toast.success
    },
  };
});
// Partially mock react-router-dom, especially the useNavigate hook
vi.mock("react-router-dom", async () => {
  const original = await vi.importActual("react-router-dom"); // Import original module

  return {
    ...original, // Spread the original exports
    useNavigate: vi.fn(), // Mock only useNavigate
  };
});

test("renders InitialFloorLayout component", () => {
  render(
    <MemoryRouter>
      <InitialFloorLayout />
    </MemoryRouter>
  );

  // Check if the initial text and button are rendered
  expect(
    screen.getByText("No Floorplan Yet - Start Designing Your Layout!")
  ).toBeInTheDocument();
  expect(screen.getByTestId("Add")).toBeInTheDocument();
});

test("opens FloorNameDialog", () => {
  render(
    <MemoryRouter>
      <InitialFloorLayout />
    </MemoryRouter>
  );

  // Open the dialog by clicking the ADD button
  const addButton = screen.getByTestId("Add");
  fireEvent.click(addButton);

  // Check if the dialog is open
  expect(
    screen.getByText("FloorPlanning.text.Name the new floor")
  ).toBeInTheDocument();
});

test("opens and closes FloorNameDialog", () => {
  render(
    <MemoryRouter>
      <InitialFloorLayout />
    </MemoryRouter>
  );

  // Open the dialog by clicking the ADD button
  const addButton = screen.getByTestId("Add");
  fireEvent.click(addButton);

  // Check if the dialog is open
  expect(
    screen.getByText("FloorPlanning.text.Name the new floor")
  ).toBeInTheDocument();

  // Simulate the onClose event to close the dialog
  fireEvent.click(document.body); // You can simulate clicking outside the dialog to trigger onClose

  // Ensure the dialog is closed
  expect(
    screen.queryByTestId("FloorPlanning.text.Name the new floor")
  ).not.toBeInTheDocument();
});

test("submits floor layout and shows success toast", async () => {
  const mockOnFloorAdded = vi.fn(); // Mocking onFloorAdded callback
  const mockOnClose = vi.fn(); // Mocking onClose callback
  const mockNavigate = vi.fn(); // Mocking navigate function

  // Mock useNavigate to return the mockNavigate function
  useNavigate.mockReturnValue(mockNavigate);

  // Mock axios POST request
  axios.post.mockResolvedValueOnce({ data: { floorName: "Test Floor" } });

  // Render the component inside MemoryRouter to mock navigation context
  render(
    <MemoryRouter>
      <FloorFormDialog
        open={true}
        onClose={mockOnClose}
        onFloorAdded={mockOnFloorAdded}
      />
      <ToastContainer />
    </MemoryRouter>
  );

  // Simulate filling in the floor name
  fireEvent.change(screen.getByLabelText(/Floor name/i), {
    target: { value: "Test Floor" },
  });

  // Simulate clicking the "ADD" button
  fireEvent.click(screen.getByText("ADD"));

  // Wait for axios post to resolve and the toast to be called
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:6500/api/v1/floor-layout",
      expect.objectContaining({
        floorName: "Test Floor",
        isActive: true,
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.any(String),
        }),
      })
    );

    // Check that the success toast was called
    expect(toast.success).toHaveBeenCalledWith(
      "Floor layout created successfully"
    );

    // Check that onFloorAdded callback is called
    expect(mockOnFloorAdded).toHaveBeenCalled();

    // Check that the navigate function is called with the correct route
    expect(mockNavigate).toHaveBeenCalledWith("/manager/tableLayout");
  });
});

test("shows error when floor name is empty", async () => {
  const mockOnFloorAdded = vi.fn(); // Mocking onFloorAdded callback
  const mockOnClose = vi.fn(); // Mocking onClose callback

  render(
    <MemoryRouter>
      <FloorFormDialog
        open={true}
        onClose={mockOnClose}
        onFloorAdded={mockOnFloorAdded}
      />
      <ToastContainer />
    </MemoryRouter>
  );

  // Simulate clicking the "ADD" button without entering a floor name
  fireEvent.click(screen.getByText("ADD"));

  // Wait for the error message to show
  await waitFor(() => {
    // Check that an error is displayed
    expect(screen.getByText(/Floor name is required/i)).toBeInTheDocument();
  });
});
