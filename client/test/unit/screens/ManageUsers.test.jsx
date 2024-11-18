import { render, BrowserRouter, waitFor, screen } from "../../utils/test-utils";
import ManageUsers from "../../../src/screens/admin/InvitedUserStatus";
import axios from "axios";

describe("Manage users screen", () => {
  beforeEach(() => {
    vi.spyOn(axios, "get").mockResolvedValueOnce({
      data: [
        {
          name: "John Doe",
          email: "john@example.com",
          language: "en",
          latestAuthentication: "2023-04-01",
          isAccepted: true,
        },
        {
          name: "Jane Smith",
          email: "jane@example.com",
          language: "fr",
          latestAuthentication: "2023-04-02",
          isAccepted: false,
        },
      ],
    });
  });
  test("should render without errors", () => {
    render(
      <BrowserRouter>
        <ManageUsers />
      </BrowserRouter>
    );
  });

  test("should fetch and set invited users correctly", async () => {
    const mockData = [
      {
        branchMapId: 5,
        organisationId: 1,
        branchId: 1,
        roleId: null,
        email: "test@gmail.com",
        isActive: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        tenantId: null,
        isInvited: true,
        isAccepted: false,
      },
    ];
    vi.spyOn(axios, "get").mockResolvedValueOnce({ data: mockData });
    render(
      <BrowserRouter>
        <ManageUsers />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("test@gmail.com")).toBeInTheDocument();
    });
  });
});
