// Overview.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Overview from "../../../../src/screens/home/OverviewPage";
// Mock useNavigate from react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = function () {};

describe("Overview Component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("renders the component correctly", async () => {
    render(
      <BrowserRouter>
        <Overview />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Cutting-Edge Inventory Management Solutions!/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Our software is designed/i)).toBeInTheDocument();
    expect(screen.getByTestId("getstarted_button")).toBeInTheDocument();
    expect(screen.getByTestId("Learnmore_button")).toBeInTheDocument();
  });

  it("navigates to user registration on Get Started button click", () => {
    render(
      <BrowserRouter>
        <Overview />
      </BrowserRouter>
    );

    const getStartedButton = screen.getByTestId("getstarted_button");
    fireEvent.click(getStartedButton);

    // Check if the navigate function was called with the expected route
    expect(mockNavigate).toHaveBeenCalledWith("/userRegistration");
  });

  it("scrolls down when Learn More button is clicked", () => {
    render(
      <BrowserRouter>
        <Overview />
      </BrowserRouter>
    );

    const learnMoreButton = screen.getByTestId("Learnmore_button");
    fireEvent.click(learnMoreButton);

    const downContent = screen.getByText("FEATURES");
    expect(downContent).toBeInTheDocument();
    expect(downContent.closest(".down_content")).toHaveClass("visible");
  });

  // Add more test cases as needed
});
