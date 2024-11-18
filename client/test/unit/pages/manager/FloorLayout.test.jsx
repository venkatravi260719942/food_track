import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import FloorLayoutAddTable from "../../../../src/screens/manager/FloorLayoutAddTable";
import FloorLayout from "../../../../src/screens/manager/FloorNames";
import TableCardList from "../../../../src/screens/manager/TableCardList";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

vi.mock("axios");
vi.mock("js-cookie");
import { useNavigate } from "react-router-dom";

// Mock useNavigate from react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock data for tests
const mockTableData = [
  { tableId: 1, tableName: "Table 1", numberOfChairs: 4, floorId: 1 },
  { tableId: 2, tableName: "Table 2", numberOfChairs: 6, floorId: 1 },
];

const mockFloors = [
  { floorId: 1, floorName: "First Floor" },
  { floorId: 2, floorName: "Second Floor" },
];
vi.mock("./FloorNameDialog", () => ({
  default: vi.fn(() => <div data-testid="floor-dialog" />),
}));

vi.mock("./InitialFloorLayout", () => ({
  default: vi.fn(() => <div data-testid="initial-layout" />),
}));

const mockSetFloorId = vi.fn();

describe("FloorLayout Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks between tests
  });

  const floors = [
    { floorId: 1, floorName: "Floor 1" },
    { floorId: 2, floorName: "Floor 2" },
  ];

  test("renders floor names when floors are available", () => {
    render(
      <BrowserRouter>
        <FloorLayout setFloorId={mockSetFloorId} floors={floors} />
      </BrowserRouter>
    );

    // Check that the floors are rendered
    expect(screen.getByText("Floor 1")).toBeInTheDocument();
    expect(screen.getByText("Floor 2")).toBeInTheDocument();
  });

  test("sets active floor when a floor name is clicked", () => {
    render(
      <BrowserRouter>
        <FloorLayout setFloorId={mockSetFloorId} floors={floors} />
      </BrowserRouter>
    );

    // Click the first floor
    const floor1 = screen.getByText("Floor 1");
    fireEvent.click(floor1);

    // Expect the active class to be added
    expect(floor1).toHaveClass("Mui-selected");

    // Expect the setFloorId callback to be called with the correct floorId
    expect(mockSetFloorId).toHaveBeenCalledWith(1);
  });

  test("renders the FloorNameDialog when 'ADD FLOOR' button is clicked", () => {
    render(
      <BrowserRouter>
        <FloorLayout setFloorId={mockSetFloorId} floors={floors} />
      </BrowserRouter>
    );

    // Click the 'ADD FLOOR' button
    const addButton = screen.getByText("+ ADD FLOOR");
    fireEvent.click(addButton);

    // Check that the FloorNameDialog component is rendered
    expect(
      screen.getByText("FloorPlanning.label.Floor name")
    ).toBeInTheDocument();
  });

  test("closes the dialog after a floor is added", () => {
    render(
      <BrowserRouter>
        <FloorLayout setFloorId={mockSetFloorId} floors={floors} />
      </BrowserRouter>
    );

    // Click the 'ADD FLOOR' button
    const addButton = screen.getByText("+ ADD FLOOR");
    fireEvent.click(addButton);

    // Simulate the onFloorAdded callback
    const dialog = screen.getByText("FloorPlanning.label.Floor name");
    fireEvent.click(dialog); // Simulate adding the floor

    // Expect dialog to be closed
    expect(screen.queryByTestId("floor-dialog")).not.toBeInTheDocument();
  });

  test("renders InitialFloorLayout when no floors are available", () => {
    render(
      <BrowserRouter>
        <FloorLayout setFloorId={mockSetFloorId} floors={[]} />
      </BrowserRouter>
    );

    // Check that InitialFloorLayout is rendered
    expect(
      screen.getByText("No Floorplan Yet - Start Designing Your Layout!")
    ).toBeInTheDocument();
  });
});

describe("FloorLayoutAddTable Component", () => {
  const mockFloorData = [
    { floorId: "1", floorName: "First Floor" },
    { floorId: "2", floorName: "Second Floor" },
  ];

  const mockTableData = [
    { tableId: "1", numberOfChairs: 4 },
    { tableId: "2", numberOfChairs: 6 },
  ];

  beforeEach(() => {
    Cookies.get.mockReturnValue({
      token: "mocked-token",
      branchId: "123",
    });
  });

  test("should render the component and fetch floor data", async () => {
    axios.get.mockResolvedValueOnce({ data: mockFloorData });

    render(
      <MemoryRouter>
        <FloorLayoutAddTable />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:6500/api/v1/floor-layout/123",
        expect.any(Object)
      );
      expect(screen.getByText("First Floor")).toBeInTheDocument();
    });
  });

  test("should open the Add Seat dialog when the Add button is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: mockFloorData });

    render(
      <MemoryRouter>
        <FloorLayoutAddTable />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:6500/api/v1/floor-layout/123",
        expect.any(Object)
      );
    });
    fireEvent.click(screen.getByText(/table/i)); // Click on the 'Add Table' button
    expect(screen.getByText(/add seat/i)).toBeInTheDocument();
  });

  test("should close the Add Seat dialog when Add button in dialog is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: mockFloorData });

    render(
      <MemoryRouter>
        <FloorLayoutAddTable />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:6500/api/v1/floor-layout/123",
        expect.any(Object)
      );
    });
    fireEvent.click(screen.getByText(/table/i)); // Open dialog
    expect(screen.getByText(/add seat/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(/Add_table/i)); // Add seat and close dialog

    await waitFor(() => {
      expect(screen.queryByTestId(/Add/i)).not.toBeInTheDocument();
    });
  });

  test("should handle adding a new table i.e no of seats input change ", async () => {
    axios.get.mockResolvedValueOnce({ data: mockFloorData });

    render(
      <BrowserRouter>
        <FloorLayoutAddTable />
      </BrowserRouter>
    );

    // Verify the initial API call to fetch the floor layout
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:6500/api/v1/floor-layout/123",
        expect.any(Object)
      );
    });

    // Simulate clicking to open the table dialog
    fireEvent.click(screen.getByText(/table/i));

    // Ensure the 'Add seat' text is visible (i.e., dialog is open)
    expect(screen.getByText(/add seat/i)).toBeInTheDocument();

    // Find the select element for the number of seats
    const seatsSelect = await screen.findByTestId(/no_of_seats/i);
    seatsSelect.value = 2;
    fireEvent.change(seatsSelect);

    // Ensure the select element exists and has the correct value
    expect(seatsSelect).toBeInTheDocument();
    expect(seatsSelect.value).toBe(2);

    // Mock the post API response for saving the table
    axios.post.mockResolvedValueOnce({ status: 200 });

    // Simulate saving the table
    fireEvent.click(screen.getByTestId(/Add_table/i));
  });

  test("should handle deleting a table with confirmation", async () => {
    const mockTableData = [
      {
        tableId: 1,
        tableName: "Table 1",
        numberOfChairs: 4,
        floorId: "123",
      },
    ];

    // Mock the initial API calls
    axios.get.mockResolvedValueOnce({ data: mockFloorData });
    axios.get.mockResolvedValueOnce({ data: mockTableData });
    axios.delete.mockResolvedValueOnce({}); // Mock delete response

    render(
      <BrowserRouter>
        <FloorLayoutAddTable />
      </BrowserRouter>
    );

    // Wait for initial data fetch
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("table-layout"),
        expect.any(Object)
      );
    });

    // Select the table (simulating user selecting a table)
    fireEvent.click(screen.getByText("Table 1")); // Click on the table card

    // Click the delete button
    fireEvent.click(screen.getByText(/delete/i));

    // Verify the confirmation dialog appears
    expect(screen.getByText(/confirm delete/i)).toBeInTheDocument();

    // Click the confirmation button
    fireEvent.click(screen.getByTestId("delete_table"));

    // Verify the delete action
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/table-layout/1"), // Adjust ID as necessary
        expect.any(Object)
      );
    });

    // Optionally, verify that the toast notification for deletion is displayed
    expect(screen.getByText(/table deleted/i)).toBeInTheDocument();
  });

  //   test("should handle renaming a table", async () => {
  //     axios.put.mockResolvedValueOnce({ status: 200 });

  //     axios.get.mockResolvedValueOnce({ data: mockFloorData });

  //     render(
  //       <BrowserRouter>
  //         <FloorLayoutAddTable />
  //       </BrowserRouter>
  //     );

  //     // Verify the initial API call to fetch the floor layout
  //     await waitFor(() => {
  //       expect(axios.get).toHaveBeenCalledWith(
  //         "http://localhost:6500/api/v1/floor-layout/123",
  //         expect.any(Object)
  //       );
  //     });
  //     fireEvent.click(screen.getByText(/rename/i)); // Click Rename button
  //     fireEvent.change(screen.getByPlaceholderText("Table Name"), {
  //       target: { value: "New Table Name" },
  //     });
  //     fireEvent.click(screen.getByText(/save/i)); // Save the new name

  //     await waitFor(() => {
  //       expect(axios.put).toHaveBeenCalledWith(
  //         expect.stringContaining("/table-layout/1"), // Assuming the tableId is 1
  //         { tableName: "New Table Name" },
  //         expect.any(Object)
  //       );
  //     });
  //   });

  //   test("should display error message when saving fails", async () => {
  //     axios.post.mockRejectedValueOnce(new Error("Saving failed"));
  //     render(
  //       <MemoryRouter>
  //         <FloorLayoutAddTable />
  //         <ToastContainer />
  //       </MemoryRouter>
  //     );

  //     fireEvent.click(screen.getByText(/save/i)); // Attempt to save

  //     await waitFor(() => {
  //       expect(screen.getByText(/error saving tables/i)).toBeInTheDocument();
  //     });
  //   });
});
