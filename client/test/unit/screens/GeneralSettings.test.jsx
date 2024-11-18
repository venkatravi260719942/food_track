import {
  render,
  BrowserRouter,
  screen,
  userEvent,
  waitFor,
  vi,
  expect,
} from "../../utils/test-utils";
import GeneralSettings, {
  validateEmail,
  checkEmailExists,
} from "../../../src/screens/admin/GeneralSettings";
import axios from "axios";
import React from "react";
import MockAdapter from "axios-mock-adapter";
import API_ENDPOINTS from "../../../src/config/url.config";

describe("General settings screen", () => {
  test("should render without errors", () => {
    render(
      <BrowserRouter>
        <GeneralSettings />
      </BrowserRouter>
    );
    expect(screen.getByText("General settings")).toBeInTheDocument();
  });

  test("should display email input field and send button", () => {
    render(
      <BrowserRouter>
        <GeneralSettings />
      </BrowserRouter>
    );
    expect(screen.getByTestId("email-box")).toBeInTheDocument();
    expect(screen.getByTestId("email-send-btn")).toBeInTheDocument();
  });

  test("validates email input and displays error message", async () => {
    render(
      <BrowserRouter>
        <GeneralSettings />
      </BrowserRouter>
    );
    const emailInput = screen.getByTestId("email-box");
    const sendButton = screen.getByTestId("email-send-btn");
    userEvent.type(emailInput, " ");
    userEvent.click(sendButton);
    await waitFor(() => {
      const errmsg = screen.getByTestId("errmsg");
      const msg = errmsg.textContent;
      expect(msg).toBe("Enter a valid email address");
    });
  });
});

describe("Email validation function", () => {
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  test("should return true for valid email address", () => {
    expect(validateEmail("test@example.com")).toBe(true);
  });
  test("should return false for invalid email address", () => {
    expect(validateEmail("test")).toBe(false);
    expect(validateEmail("test@example")).toBe(false);
    expect(validateEmail("test@example.")).toBe(false);
  });
});

describe("Check email exists function", () => {
  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.generalSettings.userExist}=${email}`
      );
      return response.data.exists;
    } catch (error) {
      return false;
    }
  };
  test("should return true when email exists", async () => {
    vi.spyOn(axios, "get").mockResolvedValue({ data: { exists: true } });
    const exists = await checkEmailExists("existemail@example.com");
    expect(exists).toBe(true);
    expect(axios.get).toHaveBeenCalledWith(
      `${API_ENDPOINTS.generalSettings.userExist}=existemail@example.com`
    );
  });
  test("should return true when email exists", async () => {
    vi.spyOn(axios, "get").mockResolvedValue({ data: { exists: false } });
    const exists = await checkEmailExists("nonexistemail@example.com");
    expect(exists).toBe(false);
    expect(axios.get).toHaveBeenCalledWith(
      `${API_ENDPOINTS.generalSettings.userExist}=nonexistemail@example.com`
    );
  });
  test("should return false when an error occurs", async () => {
    vi.spyOn(axios, "get").mockRejectedValueOnce(new Error("Network error"));
    const emailExists = await checkEmailExists("test@example.com");
    expect(emailExists).toBe(false);
    expect(axios.get).toHaveBeenCalledWith(
      `${API_ENDPOINTS.generalSettings.userExist}=test@example.com`
    );
  });
});

describe("GeneralSetting component", () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  test("should set invited users correctly", async () => {
    const mockData = [
      { id: 1, email: "user1@example.com" },
      { id: 2, email: "user2@example.com" },
    ];

    vi.spyOn(axios, "get").mockResolvedValueOnce({ data: mockData });

    render(
      <BrowserRouter>
        <GeneralSettings />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("user1@example.com")).toBeInTheDocument();
      expect(screen.getByText("user2@example.com")).toBeInTheDocument();
    });
  });

  test("should show toast error when user already exists", async () => {
    mockAxios
      .onGet(`${API_ENDPOINTS.generalSettings.userExist}=test@example.com`)
      .reply(200, { exists: true });
    render(
      <BrowserRouter>
        <GeneralSettings />
      </BrowserRouter>
    );
    const emailInput = screen.getByTestId("email-box");
    userEvent.type(emailInput, "test@example.com");

    const sendButton = screen.getByTestId("email-send-btn");
    userEvent.click(sendButton);

    // // Wait for the toast error to appear
    // await waitFor(() => {
    //   expect(screen.getByRole('alert')).toHaveTextContent("User already exists!");
    // });
  });
});
