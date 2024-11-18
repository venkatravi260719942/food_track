// Import necessary libaries
import {
  render,
  screen,
  MemoryRouter,
  BrowserRouter,
  waitFor,
  userEvent,
} from "../../utils/test-utils";
// Import Topbar component
import Topbar from "../../../src/components/Admin/topbar";

describe("Topbar component", () => {
  test("renders the topbar elements correctly", () => {
    render(
      <MemoryRouter>
        <Topbar option={"Settings"} setOption={() => {}} />
      </MemoryRouter>
    );
  });

  test("handles button clicks and option changes", async () => {
    const setOptionMock = vi.fn();
    render(
      <BrowserRouter>
        <Topbar option={"Settings"} setOption={setOptionMock} />
      </BrowserRouter>
    );

    // Click on the Settings button
    const settingsButton = screen.getByRole("button", { name: "Settings" });
    userEvent.click(settingsButton);
    await waitFor(() => {
      expect(setOptionMock).toHaveBeenCalledWith("Settings");
      expect(settingsButton).toHaveClass("active");
    });

    // Click on the Notification button
    const notificationButton = screen.getByRole("button", {
      name: "Notification",
    });
    userEvent.click(notificationButton);
    await waitFor(() => {
      expect(setOptionMock).toHaveBeenCalledWith("Notification");
    });

    // Click on the Profile button
    const profileButton = screen.getByRole("button", { name: "Profile" });
    userEvent.click(profileButton);
    await waitFor(() => {
      expect(setOptionMock).toHaveBeenCalledWith("Profile");
    });
  });
});
