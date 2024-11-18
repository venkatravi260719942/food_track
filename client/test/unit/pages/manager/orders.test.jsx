import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OrderDashboard from "../../../../src/screens/manager/Orders";
import API_ENDPOINTS from "../../../../src/config/url.config";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { vi } from "vitest";

vi.mock("axios");
vi.mock("js-cookie");

describe("OrderDashboard", () => {
  beforeEach(() => {
    Cookies.get.mockReturnValue({
      token: "mock-token",
      branchId: "mock-branch-id",
      organisationId: "mock-organisation-id",
    });

    axios.get.mockResolvedValue({
      data: [
        {
          orderId: 1,
          supplierId: 1,
          orderedDate: "2023-07-01T00:00:00Z",
          orderStatus: false,
        },
        {
          orderId: 2,
          supplierId: 1,
          orderedDate: "2023-07-02T00:00:00Z",
          orderStatus: true,
        },
      ],
    });

    axios.put.mockResolvedValue({});
  });

  it("renders pending orders and recent deliveries", async () => {
    render(
      <MemoryRouter>
        <OrderDashboard />
      </MemoryRouter>
    );

    expect(screen.getByTestId("pending-orders-title")).toBeInTheDocument();
    expect(screen.getByTestId("recent-deliveries-title")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("No pending orders")).toBeInTheDocument();
    });
  });

  it("opens and closes the confirmation dialog", async () => {
    render(
      <MemoryRouter>
        <OrderDashboard />
      </MemoryRouter>
    );

    // Open the dialog
    await waitFor(() => {
      fireEvent.click(screen.getByTestId("received-button-1"));
    });

    // Check if the dialog is open
    expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();

    // Close the dialog
    fireEvent.click(screen.getByTestId("cancel-button"));

    // Wait and check if the dialog is removed
    await waitFor(() => {
      expect(screen.queryByTestId("confirm-dialog")).not.toBeInTheDocument();
    });
  });

  it("confirms the receipt of an order", async () => {
    render(
      <MemoryRouter>
        <OrderDashboard />
      </MemoryRouter>
    );

    // Open the dialog
    await waitFor(() => {
      fireEvent.click(screen.getByTestId("received-button-1"));
    });

    // Click the confirm button
    fireEvent.click(screen.getByTestId("confirm-button"));

    // Wait for the API call to be made
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `${API_ENDPOINTS.manager.orders.orderResponse}/1`,
        { orderStatus: true },
        expect.any(Object)
      );
    });

    // Wait and check if the dialog is removed
    await waitFor(() => {
      expect(screen.queryByTestId("confirm-dialog")).not.toBeInTheDocument();
    });
  });

  it("navigates to the pay page when clicking the pay button", async () => {
    const TestComponent = () => (
      <MemoryRouter initialEntries={["/manager/dashboard"]}>
        <Routes>
          <Route path="/manager/dashboard" element={<OrderDashboard />} />
          <Route
            path="/manager/pay"
            element={<div data-testid="pay-page">Pay Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    render(<TestComponent />);

    // Ensure that the component has time to load and render the orders
    await waitFor(() => {
      expect(screen.getByTestId("pay-button-2")).toBeInTheDocument();
    });

    // Click the pay button
    fireEvent.click(screen.getByTestId("pay-button-2"));

    // Verify that the pay page is rendered
    await waitFor(() => {
      expect(screen.getByTestId("pay-page")).toBeInTheDocument();
    });
  });
});
