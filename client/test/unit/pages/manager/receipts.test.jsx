import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Receipt from "../../../../src/screens/manager/Receipt";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { vi, expect, describe, test, beforeEach } from "vitest";

// Mock API endpoints
const mockInventoryResponse = [
  {
    inventoryId: 1,
    productId: 1,
    quantity: 5,
    thresholdLimit: 10,
    selectedSupplier: "",
  },
  {
    inventoryId: 2,
    productId: 2,
    quantity: 0,
    thresholdLimit: 5,
    selectedSupplier: "",
  },
];
const mockProductResponse = [
  {
    productId: 1,
    name: "Product 1",
    thresholdLimit: 10,
    unitOfMeasure: 1,
  },
  {
    productId: 2,
    name: "Product 2",
    thresholdLimit: 5,
    unitOfMeasure: 2,
  },
];
const mockUnitsResponse = [
  {
    unitId: 1,
    units: "Pieces",
  },
  {
    unitId: 2,
    units: "Kilograms",
  },
];
const mockSupplierResponse = [
  {
    supplierId: 1,
    supplierName: "Supplier A",
  },
  {
    supplierId: 2,
    supplierName: "Supplier B",
  },
];

// Mock Cookies
vi.mock("js-cookie");
Cookies.get = vi.fn().mockReturnValue({
  branchId: 1,
  organisationId: 1,
  token: "test-token",
});

// Mock Axios
vi.mock("axios");
axios.get.mockResolvedValue({ data: mockInventoryResponse });
axios.get.mockResolvedValueOnce({ data: mockProductResponse });
axios.get.mockResolvedValueOnce({ data: mockUnitsResponse });
axios.get.mockResolvedValueOnce({ data: mockSupplierResponse });
axios.post.mockResolvedValue({ data: {} }); // Mock order response

describe("Receipt Component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    axios.get.mockClear();
    axios.post.mockClear();
  });

  test("renders the Receipt component", () => {
    render(
      <BrowserRouter>
        <Receipt />
      </BrowserRouter>
    );
    // expect(screen.getAllByText("Your cart is not empty")).toBeInTheDocument();
  });

  //   test("renders low stock products correctly", async () => {
  //     render(
  //       <BrowserRouter>
  //         <Receipt />
  //       </BrowserRouter>
  //     );

  //     await waitFor(() => {
  //       // Expect table rows based on mock data
  //       expect(screen.getAllByRole("row")).toHaveLength(3);
  //       expect(screen.getByText("Product 1")).toBeInTheDocument();
  //       expect(screen.getByText("Product 2")).toBeInTheDocument();
  //       expect(screen.getByText("Out of stock")).toBeInTheDocument();
  //       expect(screen.getByText("Low stock")).toBeInTheDocument();
  //     });
  //   });

  //   test("renders cart section correctly", async () => {
  //     render(
  //       <BrowserRouter>
  //         <Receipt />
  //       </BrowserRouter>
  //     );

  //     // Add an item to cart
  //     const addToCartButton = screen.getByRole("button", {
  //       name: "ADD",
  //     });
  //     fireEvent.click(addToCartButton);

  //     // Verify cart items
  //     await waitFor(() => {
  //       expect(screen.getByText("Your cart is not empty")).toBeInTheDocument();
  //       expect(screen.getByText("Product 1")).toBeInTheDocument();
  //       expect(screen.getByText("Supplier A")).toBeInTheDocument();
  //     });
  //   });

  //   test("renders filtered products correctly", async () => {
  //     render(
  //       <BrowserRouter>
  //         <Receipt />
  //       </BrowserRouter>
  //     );

  //     // Select "Out of Stock" filter
  //     const filterSelect = screen.getByRole("combobox", { name: "Stock" });
  //     fireEvent.select(filterSelect, { target: { value: "Out of Stock" } });

  //     await waitFor(() => {
  //       expect(
  //         screen.getByRole("row", { name: "Product 2" })
  //       ).toBeInTheDocument();
  //       expect(
  //         screen.queryByRole("row", { name: "Product 1" })
  //       ).not.toBeInTheDocument();
  //     });
  //   });

  //   test("handles order quantity input correctly", async () => {
  //     render(
  //       <BrowserRouter>
  //         <Receipt />
  //       </BrowserRouter>
  //     );

  //     // Select a supplier
  //     const supplierSelect = screen.getByRole("combobox", {
  //       name: "Supplier",
  //     });
  //     fireEvent.select(supplierSelect, { target: { value: "1" } });

  //     // Enter order quantity
  //     const orderQuantityInput = screen.getByRole("spinbutton", {
  //       name: "order quantity",
  //     });
  //     fireEvent.change(orderQuantityInput, { target: { value: "3" } });

  //     // Add to cart and verify
  //     const addToCartButton = screen.getByRole("button", {
  //       name: "ADD",
  //     });
  //     fireEvent.click(addToCartButton);

  //     await waitFor(() => {
  //       expect(screen.getByText("3")).toBeInTheDocument();
  //     });
  //   });

  //   test("handles order placement correctly", async () => {
  //     render(
  //       <BrowserRouter>
  //         <Receipt />
  //       </BrowserRouter>
  //     );

  //     // Add an item to cart and select supplier
  //     const addToCartButton = screen.getByRole("button", {
  //       name: "ADD",
  //     });
  //     fireEvent.click(addToCartButton);
  //     const supplierSelect = screen.getByRole("combobox", {
  //       name: "Supplier",
  //     });
  //     fireEvent.select(supplierSelect, { target: { value: "1" } });

  //     // Place order
  //     const orderButton = screen.getByRole("button", { name: "Order" });
  //     fireEvent.click(orderButton);

  //     // Verify API call and cart update
  //     await waitFor(() => {
  //       expect(axios.post).toHaveBeenCalledTimes(1);
  //       expect(axios.post).toHaveBeenCalledWith(
  //         "/manager/orders/orderResponse",
  //         {
  //           supplierId: 1,
  //           orderedDate: expect.any(String),
  //           items: expect.any(String),
  //           branchId: 1,
  //         },
  //         {
  //           headers: {
  //             Authorization: "Bearer test-token",
  //           },
  //         }
  //       );
  //       expect(
  //         screen.queryByText("Your cart is not empty")
  //       ).not.toBeInTheDocument();
  //     });
  //   });
});
