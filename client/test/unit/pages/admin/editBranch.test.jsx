import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  getByText,
} from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { expect, vi } from "vitest";
import axios from "axios";
import EditBranch from "../../../../src/screens/admin/EditBranch";
import userEvent from "@testing-library/user-event";

vi.mock("axios");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ branchId: "1" }),
    useNavigate: vi.fn(),
  };
});

describe("editBranch Component", () => {
  const navigate = vi.fn();
  const mockedAxios = axios;

  beforeEach(() => {
    mockedAxios.post.mockClear();
    vi.mocked(navigate).mockClear();
    render(
      <Router>
        <EditBranch />
      </Router>
    );
  });

  it("validates required fields", async () => {
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Branch owner Name is required/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Contact Number is required/i)
      ).toBeInTheDocument();
    });
  });
  it("validates field for empty spaces", async () => {
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

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Branch owner Name is required/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Invalid contact number format/i)
      ).toBeInTheDocument();
    });
  });
  it("validates contact number format", async () => {
    fireEvent.change(
      screen.getByTestId("contactNumber").querySelector("input"),
      {
        target: { value: "12345" },
      }
    );

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Invalid contact number format/i)
      ).toBeInTheDocument();
    });
  });
  it("validates email format", async () => {
    fireEvent.change(screen.getByTestId("email").querySelector("input"), {
      target: { value: "invalid email" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
    });
  });
});

test("submits form and opens confirmation dialog", async () => {
  render(
    <Router>
      <EditBranch />
    </Router>
  );

  fireEvent.change(screen.getByTestId("noOfEmployees").querySelector("input"), {
    target: { value: "10" },
  });
  fireEvent.change(
    screen.getByTestId("branchOwnerName").querySelector("input"),
    {
      target: { value: "John Doe" },
    }
  );
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "9876543210" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "test@example.com" },
  });

  userEvent.click(screen.getByRole("button", { name: /save/i }));

  await waitFor(() => {
    expect(
      screen.getByText("Are you sure you want to edit this branch?")
    ).toBeInTheDocument();
  });
});
test("submits form, and shows success message", async () => {
  let branchId = 1;
  render(
    <Router>
      <EditBranch branchId={branchId} />
    </Router>
  );

  // Wait for an element that indicates the page has fully loaded
  await waitFor(() => {
    expect(screen.getByTestId("noOfEmployees")).toBeInTheDocument();
  });
  expect(screen.getAllByLabelText);

  const mockResponse = {
    status: 201,
    data: { success: "Branch edited successfully" },
  };

  axios.post.mockResolvedValueOnce(mockResponse);

  fireEvent.change(screen.getByTestId("noOfEmployees").querySelector("input"), {
    target: { value: "10" },
  });
  fireEvent.change(
    screen.getByTestId("branchOwnerName").querySelector("input"),
    {
      target: { value: "John Doe" },
    }
  );
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "9876543210" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "test@example.com" },
  });

  const file = new File(["(⌐□_□)"], "test.png", { type: "image/png" });
  Object.defineProperty(screen.getByTestId("imageInput"), "files", {
    value: [file],
  });

  userEvent.click(screen.getByRole("button", { name: /save/i }));

  await waitFor(() => {
    expect(
      screen.getByText("Are you sure you want to edit this branch?")
    ).toBeInTheDocument();
  });

  userEvent.click(screen.getByRole("button", { name: /confirm/i }));

  await waitFor(() => {
    expect(axios.put).toHaveBeenCalled();
  });

  // Introduce a delay before checking for the success message
  await new Promise((resolve) => setTimeout(resolve, 5000));

  await waitFor(() => {
    expect(screen.getByText("Branch edited successfully")).toBeInTheDocument();
  });
}, 8000);
it("shows alert if file size is greater than 10kb", () => {
  let file;
  file = new File([new ArrayBuffer(11000)], "large.jpg", {
    type: "image/jpeg",
  });

  const { getByTestId, queryByTestId } = render(
    <Router>
      <EditBranch />
    </Router>
  );
  const fileInput = getByTestId("imageInput");

  fireEvent.change(fileInput, { target: { files: [file] } });

  waitFor(() => {
    expect(queryByTestId("alert")).toBeInTheDocument();
    expect(
      getByText(/File size should be less than 10kb/i)
    ).toBeInTheDocument();
  });
});
test("close dialog box", async () => {
  render(
    <Router>
      <EditBranch />
    </Router>
  );

  fireEvent.change(screen.getByTestId("noOfEmployees").querySelector("input"), {
    target: { value: "10" },
  });
  fireEvent.change(
    screen.getByTestId("branchOwnerName").querySelector("input"),
    {
      target: { value: "John Doe" },
    }
  );
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "9876543210" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "test@example.com" },
  });

  userEvent.click(screen.getByRole("button", { name: /save/i }));

  await waitFor(() => {
    expect(
      screen.getByText("Are you sure you want to edit this branch?")
    ).toBeInTheDocument();
  });
  userEvent.click(screen.getByRole("button", { name: /cancel/i }));
  await waitFor(() => {
    expect(screen.getByText(/manage branch/i)).toBeInTheDocument;
  });
});
test("uploads image, submits form, and shows success message", async () => {
  render(
    <Router>
      <EditBranch />
    </Router>
  );
  const mockResponse = {
    status: 201,
    data: { success: "Branch edited successfully" },
  };

  axios.post.mockResolvedValueOnce(mockResponse);

  fireEvent.change(screen.getByTestId("branchName").querySelector("input"), {
    target: { value: "Test Branch" },
  });
  fireEvent.change(screen.getByTestId("noOfEmployees").querySelector("input"), {
    target: { value: "10" },
  });
  fireEvent.change(
    screen.getByTestId("branchOwnerName").querySelector("input"),
    {
      target: { value: "John Doe" },
    }
  );
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "9876543210" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "test@example.com" },
  });
  const file = new File(["(⌐□_□)"], "test.png", { type: "image/png" });
  Object.defineProperty(screen.getByTestId("imageInput"), "files", {
    value: [file],
  });

  userEvent.click(screen.getByRole("button", { name: /save/i }));

  await waitFor(() => {
    expect(
      screen.getByText("Are you sure you want to edit this branch?")
    ).toBeInTheDocument();
  });

  userEvent.click(screen.getByRole("button", { name: /confirm/i }));

  await waitFor(() => {
    expect(axios.put).toHaveBeenCalled();
  });

  // Introduce a delay before checking for the success message
  await new Promise((resolve) => setTimeout(resolve, 5000));

  await waitFor(() => {
    expect(screen.getByText("Branch edited successfully")).toBeInTheDocument();
  });
}, 6000);
describe("EditBranch component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });
  it("navigates to dashboard on back button click", () => {
    render(
      <Router>
        <EditBranch />
      </Router>
    );

    const backButton = screen.getByTestId("back_button");
    fireEvent.click(backButton);

    // Check if the navigate function was called with the expected route
    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });
});
