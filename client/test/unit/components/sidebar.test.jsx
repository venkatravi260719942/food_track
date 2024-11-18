// Import necessary libaries
import {
  render,
  screen,
  MemoryRouter,
  BrowserRouter,
  waitFor,
  userEvent,
} from "../../utils/test-utils";

// Import Sidebar component
import Sidebar from "../../../src/components/Admin/sidebar";

describe("Sidebar component", () => {
  test("renders the sidebar elements correctly", () => {
    render(
      <MemoryRouter>
        <Sidebar option="Home" setOption={() => {}} />
      </MemoryRouter>
    );

    // Check for logo and menu items
    expect(screen.getByAltText("company_logo")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("User management")).toBeInTheDocument();
    expect(screen.getByText("Purchase order")).toBeInTheDocument();
    expect(screen.getByText("Menu management")).toBeInTheDocument();
    expect(screen.getByText("Sales forcasting")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("updates option state on click", async () => {
    const setOptionMock = vi.fn();
    render(
      <BrowserRouter>
        <Sidebar option="Home" setOption={setOptionMock} />
      </BrowserRouter>
    );

    // Click on Dashboard link
    userEvent.click(screen.getByText("Dashboard"));
    await waitFor(() => expect(setOptionMock).toHaveBeenCalledWith("Home"));

    // Click on User Management link
    userEvent.click(screen.getByText("User management"));
    await waitFor(() => expect(setOptionMock).toHaveBeenCalledWith("User"));

    // Click on Purchase order link
    userEvent.click(screen.getByText("Purchase order"));
    await waitFor(() => expect(setOptionMock).toHaveBeenCalledWith("Order"));

    // Click on UProduct management link
    userEvent.click(screen.getByText("Product management"));
    await waitFor(() => expect(setOptionMock).toHaveBeenCalledWith("Product"));

    // Click on Menu management link
    userEvent.click(screen.getByText("Menu management"));
    await waitFor(() => expect(setOptionMock).toHaveBeenCalledWith("Menu"));

    // Click on Sales forcasting link
    userEvent.click(screen.getByText("Sales forcasting"));
    await waitFor(() => expect(setOptionMock).toHaveBeenCalledWith("Sales"));

    // Click on Reports link
    userEvent.click(screen.getByText("Reports"));
    await waitFor(() => expect(setOptionMock).toHaveBeenCalledWith("Report"));
  });
});

// - Accessibility checks using testing-library/jest-dom
// - Navigation behavior with mocked routing
// - Styling tests with specific assertions
