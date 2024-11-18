import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddBranch from "../../../../src/screens/admin/AddBranch";
import { BrowserRouter as Router } from "react-router-dom";

import axios from "axios";
vi.mock("axios");

import { useNavigate } from "react-router-dom";

// Mock useNavigate from react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("AddBranch component", () => {
  test("renders form elements", () => {
    render(
      <Router>
        <AddBranch />
      </Router>
    );
    expect(screen.getByTestId("branchName")).toBeInTheDocument();
    expect(screen.getByTestId("noOfEmployees")).toBeInTheDocument();
    expect(screen.getByTestId("branchOwnerName")).toBeInTheDocument();
    expect(screen.getByTestId("countryId")).toBeInTheDocument();
    expect(screen.getByTestId("contactNumber")).toBeInTheDocument();
    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("address")).toBeInTheDocument();
    expect(screen.getByTestId("branchImage")).toBeInTheDocument();
    expect(screen.getByTestId("imageInput")).toBeInTheDocument();
  });
  it("validates field for empty spaces", async () => {
    render(
      <Router>
        <AddBranch />
      </Router>
    );
    fireEvent.change(screen.getByTestId("branchName").querySelector("input"), {
      target: { value: "    " },
    });
    fireEvent.change(
      screen.getByTestId("branchOwnerName").querySelector("input"),
      {
        target: { value: "      " },
      }
    );
    fireEvent.change(
      screen.getByTestId("noOfEmployees").querySelector("input"),
      {
        target: { value: "  " },
      }
    );
    fireEvent.change(
      screen.getByTestId("contactNumber").querySelector("input"),
      {
        target: { value: "        " },
      }
    );
    fireEvent.change(screen.getByTestId("email").querySelector("input"), {
      target: { value: "         " },
    });

    const addressInput = screen.getByLabelText("Address");
    fireEvent.change(addressInput, { target: { value: "     " } });
    fireEvent.click(screen.getByRole("button", { name: /Add Branch/i }));

    await waitFor(() => {
      expect(screen.getByText(/Branch Name is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Branch Owner Name is required/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Address is required/i)).toBeInTheDocument();

      expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Invalid contact number format/i)
      ).toBeInTheDocument();
    });
  });
  it("validates contact number format", async () => {
    render(
      <Router>
        <AddBranch />
      </Router>
    );
    fireEvent.change(
      screen.getByTestId("contactNumber").querySelector("input"),
      {
        target: { value: "12345" },
      }
    );

    fireEvent.click(screen.getByRole("button", { name: /Add Branch/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Invalid contact number format/i)
      ).toBeInTheDocument();
    });
  });
  it("validates email format", async () => {
    render(
      <Router>
        <AddBranch />
      </Router>
    );
    fireEvent.change(screen.getByTestId("email").querySelector("input"), {
      target: { value: "invalid email" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Add Branch/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
    });
  });
});
describe("AddBranch component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("handles image change", () => {
    const { getByTestId } = render(
      <Router>
        <AddBranch />
      </Router>
    );
    const fileInput = getByTestId("imageInput");

    // Create a fake file
    const file = new File(["dummy content"], "test.png", {
      type: "image/png",
    });

    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Assert that the selected image has been updated
    expect(getByTestId("branchImage").getAttribute("src")).toContain(
      "/src/assets/images/dashboard_bg.png"
    );
  });

  it("navigates to dashboard on back button click", () => {
    render(
      <Router>
        <AddBranch />
      </Router>
    );

    const backButton = screen.getByTestId("back_button");
    fireEvent.click(backButton);

    // Check if the navigate function was called with the expected route
    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });
});

describe("add branch Component mocked country drop down", () => {
  const mockCountryData = [
    { countryId: "1", countriesStateName: "Country 1" },
    { countryId: "2", countriesStateName: "Country 2" },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockCountryData });
  });
  it("renders the country select input", async () => {
    render(
      <Router>
        <AddBranch />
      </Router>
    );

    // Wait for the country data to be fetched
    const countrySelect = await screen.findByLabelText(/country/i);
    expect(countrySelect).toBeInTheDocument();
  });
  it("renders country options", async () => {
    render(
      <Router>
        <AddBranch />
      </Router>
    );

    // Wait for the country options to be rendered
    const countrySelect = await screen.findByLabelText(/country/i);
    fireEvent.mouseDown(countrySelect);

    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(mockCountryData.length);

    mockCountryData.forEach((country) => {
      expect(screen.getByText(country.countriesStateName)).toBeInTheDocument();
    });
  });
  it("allows selecting a country option", async () => {
    render(
      <Router>
        <AddBranch />
      </Router>
    );

    // Wait for the country data to be fetched and the select to be available
    const countrySelect = await screen.findByLabelText(/country/i);
    fireEvent.mouseDown(countrySelect);

    const optionToSelect = await screen.findByText("Country 1");
    fireEvent.click(optionToSelect);

    // Check if the select value has changed
    expect(countrySelect).toHaveTextContent("Country 1");
  });
  test("submits form and opens confirmation dialog", async () => {
    render(
      <Router>
        <AddBranch />
      </Router>
    );
    fireEvent.change(screen.getByTestId("branchName").querySelector("input"), {
      target: { value: "Test Branch" },
    });
    fireEvent.change(
      screen.getByTestId("noOfEmployees").querySelector("input"),
      {
        target: { value: "10" },
      }
    );
    fireEvent.change(
      screen.getByTestId("branchOwnerName").querySelector("input"),
      {
        target: { value: "John Doe" },
      }
    );
    const countrySelect = await screen.findByLabelText(/country/i);
    fireEvent.mouseDown(countrySelect);

    const optionToSelect = await screen.findByText("Country 1");
    fireEvent.click(optionToSelect);
    fireEvent.change(
      screen.getByTestId("contactNumber").querySelector("input"),
      {
        target: { value: "9876543210" },
      }
    );
    fireEvent.change(screen.getByTestId("email").querySelector("input"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("address").querySelector("textarea"), {
      target: { value: "Address" },
    });
    fireEvent.change(screen.getByTestId("notes").querySelector("textarea"), {
      target: { value: "Notes" },
    });

    userEvent.click(screen.getByRole("button", { name: /add branch/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to add this branch?")
      ).toBeInTheDocument();
    });
  });
  test("uploads image, submits form, and shows success message", async () => {
    render(
      <Router>
        <AddBranch />
      </Router>
    );
    const mockResponse = {
      status: 201,
      data: { success: "Branch added successfully" },
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    fireEvent.change(screen.getByTestId("branchName").querySelector("input"), {
      target: { value: "Test Branch" },
    });
    fireEvent.change(
      screen.getByTestId("noOfEmployees").querySelector("input"),
      {
        target: { value: "10" },
      }
    );
    fireEvent.change(
      screen.getByTestId("branchOwnerName").querySelector("input"),
      {
        target: { value: "John Doe" },
      }
    );
    const countrySelect = await screen.findByLabelText(/country/i);
    fireEvent.mouseDown(countrySelect);

    const optionToSelect = await screen.findByText("Country 1");
    fireEvent.click(optionToSelect);
    fireEvent.change(
      screen.getByTestId("contactNumber").querySelector("input"),
      {
        target: { value: "9876543210" },
      }
    );
    fireEvent.change(screen.getByTestId("email").querySelector("input"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("address").querySelector("textarea"), {
      target: { value: "Address" },
    });
    fireEvent.change(screen.getByTestId("notes").querySelector("textarea"), {
      target: { value: "Notes" },
    });

    const file = new File(["(⌐□_□)"], "test.png", { type: "image/png" });
    Object.defineProperty(screen.getByTestId("imageInput"), "files", {
      value: [file],
    });

    userEvent.click(screen.getByRole("button", { name: /add branch/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to add this branch?")
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole("button", { name: /confirm/i }));
    const formData = new FormData();
    formData.append("file", file);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1); // Ensure axios.post is called once
    });
  });
});
