import { test, expect, vi } from "vitest";
import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import Dashboard from "../../../../src/screens/admin/Dashboard";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { CookiesProvider } from "react-cookie";

describe("Dashboard", () => {
  test("renders Dashboard component", () => {
    const { container } = render(
      <Router>
        <Dashboard />
      </Router>
    );
    expect(container).toBeDefined();
  });

  test("should display an error message if fetching data fails", async () => {
    vi.spyOn(axios, "get").mockRejectedValueOnce(new Error("Network Error"));

    render(
      <Router>
        <CookiesProvider>
          <Dashboard />
        </CookiesProvider>
      </Router>
    );

    // Wait for the error message to be displayed
    await waitFor(() =>
      expect(screen.getByText(/Error fetching data/i)).toBeInTheDocument()
    );
  });

  test("renders dashboard with user and organisation data", async () => {
    render(
      <Router>
        <CookiesProvider>
          <Dashboard />
        </CookiesProvider>
      </Router>
    );

    // Wait for data to load
    await screen.findByTestId("userName");

    // Assert user data
    expect(screen.getByTestId("userName")).toHaveTextContent("Hello");

    // Assert organisation data and branches
    await waitFor(() => {
      expect(screen.getByTestId("companyName")).toBeInTheDocument();
    });
  });
});
