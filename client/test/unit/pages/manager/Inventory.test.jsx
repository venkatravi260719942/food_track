import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Inventory from "../../../../src/screens/manager/Inventory";
import axios from "axios";
import Cookies from "js-cookie";

vi.mock("axios");
vi.mock("js-cookie");

describe("Inventory Component", () => {
  const mockCookiesData = {
    token: "mock-token",
    organisationId: "mock-organisation-id",
    branchId: "mock-branch-id",
  };
  console.log(mockCookiesData);

  const mockCategoriesResponse = {
    data: [
      { categoryId: 1, categoryName: "Electronics" },
      { categoryId: 2, categoryName: "Furniture" },
    ],
  };

  const mockUnitsResponse = {
    data: [
      { unitId: 1, units: "Kg" },
      { unitId: 2, units: "Liters" },
    ],
  };

  const mockProductsResponse = {
    data: [
      {
        productId: 1,
        name: "Product 1",
        categoryId: 1,
        quantity: 10,
        unitOfMeasure: 1,
      },
      {
        productId: 2,
        name: "Product 2",
        categoryId: 2,
        quantity: 5,
        unitOfMeasure: 2,
      },
    ],
  };

  beforeEach(() => {
    Cookies.get.mockReturnValue(mockCookiesData);
    axios.get.mockImplementation((url) => {
      switch (url) {
        case `${mockCookiesData.organisationId}/${mockCookiesData.branchId}`:
          return Promise.resolve(mockProductsResponse);
        case `/api/v1/category`:
          return Promise.resolve(mockCategoriesResponse);
        case `/api/v1/unitofmeasure`:
          return Promise.resolve(mockUnitsResponse);
        default:
          return Promise.resolve({ data: [] });
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Inventory component", async () => {
    render(<Inventory />);

    expect(screen.getByText("INVENTORY")).toBeInTheDocument();
    expect(screen.getByText("RECEIPTS")).toBeInTheDocument();
    expect(screen.getByText("ORDERS")).toBeInTheDocument();
    expect(screen.getByText("HISTORY")).toBeInTheDocument();
  });

  it("displays product data in the table", async () => {
    render(<Inventory />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument("Product 1");
      expect(screen.getByRole("table")).toBeInTheDocument("Product 2");
    });
  });

  //   it("allows quantity changes", async () => {
  //     render(<Inventory />);

  //     await waitFor(() => {
  //       const quantityInput = screen.getByTestId("quantity");
  //       expect(quantityInput).toBeInTheDocument();
  //     });

  //     const quantityInput = screen.getByTestId("quantity");

  //     fireEvent.change(quantityInput, { target: { value: "15" } });

  //     expect(quantityInput.value).toBe("15");
  //   });
  //   it("allows quantity changes within a table cell", async () => {
  //     render(<Inventory />);

  //     await waitFor(() => {
  //       expect(screen.getByRole("table")).toBeInTheDocument("Product 1");

  //       const quantityInput = screen.getByTestId("quantity");
  //       expect(quantityInput).toBeInTheDocument();
  //     });

  //     const quantityInput = screen.getByTestId("quantity");

  //     // Find the table cell containing the quantity input
  //     const tableCell = screen.getByRole("cell", {
  //       name: /quantity/i,
  //     });

  //     // Check if the quantity input is within the table cell
  //     expect(tableCell).toContainElement(quantityInput);

  //     fireEvent.change(quantityInput, { target: { value: "15" } });

  //     expect(quantityInput.value).toBe("15");
  //   });
  //   it("displays search functionality", async () => {
  //     render(<Inventory />);

  //     const searchInput = screen.getByLabelText("Search by Product Name");

  //     // Type a search term
  //     fireEvent.change(searchInput, { target: { value: "Product 1" } });

  //     // Verify the input value
  //     expect(searchInput.value).toBe("Product 1");

  //     // Verify the filtered result
  //     const product1 = await screen.findByText("Product 1");
  //     expect(product1).toBeInTheDocument();
  //   });

  //   it("triggers save changes with correct data", async () => {
  //     render(<Inventory />);

  //     // Wait for data to be fetched and rendered
  //     const saveButton = screen.getByText("Save Changes");

  //     // Simulate quantity change
  //     const quantityInput = await screen.findByDisplayValue("10");
  //     fireEvent.change(quantityInput, { target: { value: "15" } });

  //     // Click the save button
  //     fireEvent.click(saveButton);

  //     // Verify the API call was made
  //     expect(axios.put).toHaveBeenCalledWith(
  //       "http://localhost:6500/api/v1/inventory/mock-branch-id/1",
  //       {
  //         productId: 1,
  //         quantity: 15,
  //         branchId: parseInt(mockCookiesData.branchId),
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${mockCookiesData.token}`,
  //         },
  //       }
  //     );
  //   });
});
