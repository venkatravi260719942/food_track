// import {
//   fireEvent,
//   render,
//   screen,
//   userEvent,
//   waitFor,
// } from "@testing-library/react";
// import Login from "../../../src/screens/home/Login";

// import { describe, expect, it } from "vitest";
// import {
//   BrowserRouter,
//   MemoryRouter,
//   Route,
//   Router,
//   Routes,
// } from "react-router-dom";
// import { vi } from "vitest";
// import axios from "axios";
// import AdminDashboard from "../../../src/screens/admin/AdminDashboard";

// const renderLoginPage = () => {
//   render(
//     <MemoryRouter initialEntries={["/login"]}>
//       <Routes>
//         <Route path="/login" element={<Login />}></Route>
//         <Route path="/admin" element={<AdminDashboard />}></Route>
//       </Routes>
//     </MemoryRouter>
//   );
// };

// describe("Check Input fields", () => {
//   it("Valid email, password login ", async () => {
//     renderLoginPage();
//     const emailInput = screen.getByTestId("email");
//     const passwordInput = screen.getByTestId("password");
//     const submitButton = screen.getByRole("button", { name: "Sign In" });

//     // Fill in email and password fields
//     fireEvent.change(emailInput.querySelector("input"), {
//       target: { value: "john@gmail.com" },
//     });
//     fireEvent.change(passwordInput.querySelector("input"), {
//       target: { value: "abcd" },
//     });

//     fireEvent.click(submitButton);

//     // Wait for login to complete
//     await waitFor(async () => {
//       // const { container } = render(<AdminDashboard />);
//       // const successfullLogin = container.getByText("dashboard");
//       const successfullLogin = await screen.getByTestId("dashboard");
//       expect(successfullLogin).toBeInTheDocument();
//     });
//   });

//   // Invalid email, password
//   it("Invalid email, password ", async () => {
//     renderLoginPage();
//     const emailInput = screen.getByTestId("email");
//     const passwordInput = screen.getByTestId("password");
//     const submitButton = screen.getByRole("button", { name: "Sign In" });

//     fireEvent.change(emailInput.querySelector("input"), {
//       target: { value: "email" },
//     });
//     fireEvent.change(passwordInput.querySelector("input"), {
//       target: { value: "password" },
//     });
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       const invalidMessage = screen.getByText("Please enter valid credentials");
//       expect(invalidMessage).toBeInTheDocument();
//     });
//   });
// });
// // Checking for Valid username, password

// describe("submit", () => {
//   it("Log in button is functional", () => {
//     renderLoginPage();
//     const signInButton = screen.getByRole("button", { name: "Sign In" });
//     fireEvent.click(signInButton);
//     // const signInButton = screen.getAllByLabelText("Email");
//     expect(signInButton).toBeVisible();
//   });
//   it("input field changes working", () => {
//     renderLoginPage();
//     const emailInput = screen.getByTestId("email");
//     fireEvent.change(emailInput.querySelector("input"), {
//       target: { value: "test" },
//     });
//     const passwordInput = screen.getByTestId("password");
//     fireEvent.change(passwordInput.querySelector("input"), {
//       target: { value: "test" },
//     });

//     expect(emailInput.querySelector("input")).toHaveValue("test");
//     expect(passwordInput.querySelector("input")).toHaveValue("test");
//   });
//   it("input fields validation", async () => {
//     renderLoginPage();
//     const emailInput = screen.getByTestId("email");
//     const passwordInput = screen.getByTestId("password");
//     const signInButton = screen.getByRole("button", { name: "Sign In" });
//     fireEvent.click(signInButton);
//     await waitFor(() => {
//       const emailError = screen.getByText("Please Enter valid email");
//       const passError = screen.getByText("Please Enter valid passsword");
//       expect(emailError).toBeInTheDocument();
//       expect(passError).toBeInTheDocument();
//     });
//   });
// });
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  rerender,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../src/screens/home/Login";
import axios from "axios";
import Cookies from "js-cookie";
import { createMemoryHistory } from "history";
import Homepage from "../../../src/screens/manager/Homepage";
import ChefDashboard from "../../../src/screens/chef/ChefDashboard";
import OperatorDashboard from "../../../src/screens/operator/OperatorDashboard";
// import Dashboard from "../../../src/screens/admin/Dashboard";
import OverviewPage from "../../../src/screens/home/OverviewPage";
import { LanguageProvider } from "../../../src/LanguageContext";

vi.mock("axios");
vi.mock("js-cookie", () => ({
  default: {
    set: vi.fn(),
    get: vi.fn(),
  },
}));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
  Trans: ({ children }) => children,
}));

describe("Login Component", () => {
  let history;

  beforeEach(() => {
    history = createMemoryHistory();
  });

  it("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(
      screen.getByText(/dont have an account\? register/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
  });

  it("shows validation errors on submit with empty fields", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("login"));

    await waitFor(() => {
      expect(screen.getByText(/Please enter valid email/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Please enter valid password/i)
      ).toBeInTheDocument();
    });
  });

  const mockApiResponses = (roleName) => {
    axios.post.mockResolvedValue({
      status: 200,
      data: {
        user: {
          token: "fake-token",
          id: "user-id",
          firstName: "John",
          lastName: "Doe",
        },
      },
    });

    axios.get
      .mockResolvedValueOnce({
        data: [{ email: "test@example.com" }],
      })
      .mockResolvedValueOnce({
        data: [{ tenantId: "fake-token" }],
      })
      .mockResolvedValueOnce({
        data: {
          branchId: 12,
          organisationId: 1,
          Role: { roleName },
          roleId: 1,
        },
      });
  };
  it("redirects to manager dashboard on successful login with Manager role", async () => {
    mockApiResponses("Manager");

    const { rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Login />
      </MemoryRouter>
    );

    // Update these values based on your login fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("login"));

    // Wait for navigation, then update the rendered component
    await waitFor(() => {
      expect(Cookies.set("branchId", "branch-id"));
      expect(Cookies.set("organisationId", "org-id"));

      rerender(
        <MemoryRouter initialEntries={["/manager"]}>
          <Homepage />
        </MemoryRouter>
      );
    });

    // Check if Homepage is displayed
    expect(screen.getByTestId("location-display")).toBeInTheDocument();
    expect(screen.getByText("ManagerDashboard")).toBeInTheDocument();
  });

  it("redirects to chef dashboard on successful login with Chef role", async () => {
    mockApiResponses("Chef");

    const { rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("login"));

    await waitFor(() => {
      // Check if cookies are set
      expect(Cookies.set("branchId", "branch-id"));
      expect(Cookies.set("organisationId", "org-id"));

      // Rerender with the ChefDashboard component and the correct route
      rerender(
        <MemoryRouter initialEntries={["/chef"]}>
          <ChefDashboard />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("ChefDashboard")).toBeInTheDocument();
  });

  it("redirects to operator dashboard on successful login with Operator role", async () => {
    mockApiResponses("Operator");

    const { rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("login"));

    await waitFor(() => {
      expect(Cookies.set("branchId", "branch-id"));
      expect(Cookies.set("organisationId", "org-id"));

      // Rerender with the OperatorDashboard component and the correct route
      rerender(
        <MemoryRouter initialEntries={["/operator"]}>
          <OperatorDashboard />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("OperatorDashboard")).toBeInTheDocument();
  });
  it("redirects to overview if not associated with any organisation or branch", async () => {
    mockApiResponses("NoOrganisationOrBranch"); // Mock API to return no organisation or branch data

    const { rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("login"));

    await waitFor(() => {
      expect(Cookies.set("branchId", null));
      expect(Cookies.set("organisationId", null));

      // Rerender with the Overview component and the correct route
      rerender(
        <MemoryRouter initialEntries={["/overview"]}>
          <OverviewPage />
        </MemoryRouter>
      );
    });

    // Check if Overview is displayed
    expect(screen.getByText("Welcome to")).toBeInTheDocument(); // Adjust 'Overview' to what your component displays
  });

  it("redirects to admin dashboard if associated with an existing organisation but not a branch", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          data: {
            branchId: null, // No branch associated
            organisationId: 1,
          },
        },
      ],
    });

    const { rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <LanguageProvider>
          <Login />
        </LanguageProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("login"));

    await waitFor(() => {
      expect(Cookies.set("organisationId", 1));
      expect(Cookies.set("tenantId", "fake-token"));

      rerender(
        <MemoryRouter initialEntries={["/admin"]}>
          <Dashboard />
        </MemoryRouter>
      );
    });
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });
});
