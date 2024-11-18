import { test, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserRegistration from "../../../../src/screens/home/UserRegistration";
import Login from "../../../../src/screens/home/Login";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import API_ENDPOINTS from "../../../../src/config/url.config";

import axios from "axios";
vi.mock("axios");

const renderUserRegisterationPage = () => {
  render(
    <MemoryRouter initialEntries={["/userRegistration"]}>
      <Routes>
        <Route path="/userRegistration" element={<UserRegistration />}></Route>
        <Route path="/" element={<Login />}></Route>
      </Routes>
    </MemoryRouter>
  );
};

test("renders UserRegistration component", () => {
  renderUserRegisterationPage();
});
test("updates state when input fields change", () => {
  renderUserRegisterationPage();
  fireEvent.change(screen.getByTestId("firstName").querySelector("input"), {
    target: { value: "John" },
  });
  fireEvent.change(screen.getByTestId("lastName").querySelector("input"), {
    target: { value: "Doe" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "johndoe@gmail.com" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "1234567890" },
  });
  fireEvent.change(screen.getByTestId("password").querySelector("input"), {
    target: { value: "Doe@123" },
  });
  fireEvent.change(
    screen.getByTestId("confirmPassword").querySelector("input"),
    {
      target: { value: "Doe@123" },
    }
  );
  expect(screen.getByTestId("firstName").querySelector("input")).toHaveValue(
    "John"
  );
  expect(screen.getByTestId("lastName").querySelector("input")).toHaveValue(
    "Doe"
  );
  expect(screen.getByTestId("email").querySelector("input")).toHaveValue(
    "johndoe@gmail.com"
  );
  expect(
    screen.getByTestId("contactNumber").querySelector("input")
  ).toHaveValue("1234567890");
  expect(screen.getByTestId("password").querySelector("input")).toHaveValue(
    "Doe@123"
  );
  expect(
    screen.getByTestId("confirmPassword").querySelector("input")
  ).toHaveValue("Doe@123");
});
test("displays error message for invalid email format", async () => {
  renderUserRegisterationPage();
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "invalid_email" },
  });
  fireEvent.click(screen.getByTestId("register_button"));
  await waitFor(() => {
    expect(screen.queryByText("Invalid email format")).toBeInTheDocument();
  });
});
test("displays error message for invalid contact number format", async () => {
  renderUserRegisterationPage();
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "123" },
  });
  fireEvent.click(screen.getByTestId("register_button"));
  await waitFor(() => {
    expect(
      screen.queryByText("Invalid contact number format")
    ).toBeInTheDocument();
  });
});
test("displays error message for invalid password format", async () => {
  renderUserRegisterationPage();
  fireEvent.change(screen.getByTestId("password").querySelector("input"), {
    target: { value: "weakpassword" },
  });
  fireEvent.click(screen.getByTestId("register_button"));
  await waitFor(() => {
    expect(screen.queryByText("Invalid Password format")).toBeInTheDocument();
  });
});
test("displays error message for passwords not matching", async () => {
  renderUserRegisterationPage();
  fireEvent.change(screen.getByTestId("password").querySelector("input"), {
    target: { value: "strongPassword1" },
  });
  fireEvent.change(
    screen.getByTestId("confirmPassword").querySelector("input"),
    {
      target: { value: "passwordMismatch" },
    }
  );
  fireEvent.click(screen.getByTestId("register_button"));
  await waitFor(() => {
    expect(screen.queryByText("Passwords do not match")).toBeInTheDocument();
  });
});
test("displays error message for first name null", async () => {
  renderUserRegisterationPage();
  fireEvent.change(screen.getByTestId("firstName").querySelector("input"), {
    target: { value: "" },
  });
  fireEvent.change(screen.getByTestId("lastName").querySelector("input"), {
    target: { value: "Doe" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "johndoe@gmail.com" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "1234567890" },
  });
  fireEvent.change(screen.getByTestId("password").querySelector("input"), {
    target: { value: "Doe@123" },
  });
  fireEvent.change(
    screen.getByTestId("confirmPassword").querySelector("input"),
    {
      target: { value: "Doe@123" },
    }
  );
  fireEvent.click(screen.getByTestId("register_button"));
  await waitFor(() => {
    expect(screen.queryByText("This field is required")).toBeInTheDocument();
  });
});
test("displays error message for last name null", async () => {
  renderUserRegisterationPage();
  fireEvent.change(screen.getByTestId("firstName").querySelector("input"), {
    target: { value: "John" },
  });
  fireEvent.change(screen.getByTestId("lastName").querySelector("input"), {
    target: { value: "" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "johndoe@gmail.com" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "1234567890" },
  });
  fireEvent.change(screen.getByTestId("password").querySelector("input"), {
    target: { value: "Doe@123" },
  });
  fireEvent.change(
    screen.getByTestId("confirmPassword").querySelector("input"),
    {
      target: { value: "Doe@123" },
    }
  );
  fireEvent.click(screen.getByTestId("register_button"));
  await waitFor(() => {
    expect(screen.queryByText("This field is required")).toBeInTheDocument();
  });
});
test("displays error message for email null", async () => {
  renderUserRegisterationPage();
  fireEvent.change(screen.getByTestId("firstName").querySelector("input"), {
    target: { value: "John" },
  });
  fireEvent.change(screen.getByTestId("lastName").querySelector("input"), {
    target: { value: "Doe" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "1234567890" },
  });
  fireEvent.change(screen.getByTestId("password").querySelector("input"), {
    target: { value: "Doe@123" },
  });
  fireEvent.change(
    screen.getByTestId("confirmPassword").querySelector("input"),
    {
      target: { value: "Doe@123" },
    }
  );
  fireEvent.click(screen.getByTestId("register_button"));
  await waitFor(() => {
    expect(screen.queryByText("This field is required")).toBeInTheDocument();
  });
});
test("displays error message for contact number null", async () => {
  renderUserRegisterationPage();
  fireEvent.change(screen.getByTestId("firstName").querySelector("input"), {
    target: { value: "John" },
  });
  fireEvent.change(screen.getByTestId("lastName").querySelector("input"), {
    target: { value: "Doe" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "johndoe@gmail.com" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "" },
  });
  fireEvent.change(screen.getByTestId("password").querySelector("input"), {
    target: { value: "Doe@123" },
  });
  fireEvent.change(
    screen.getByTestId("confirmPassword").querySelector("input"),
    {
      target: { value: "Doe@123" },
    }
  );
  fireEvent.click(screen.getByTestId("register_button"));
  await waitFor(() => {
    expect(screen.queryByText("This field is required")).toBeInTheDocument();
  });
});
test("displays error message for password null", async () => {
  renderUserRegisterationPage();
  fireEvent.change(screen.getByTestId("firstName").querySelector("input"), {
    target: { value: "John" },
  });
  fireEvent.change(screen.getByTestId("lastName").querySelector("input"), {
    target: { value: "Doe" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "johndoe@gmail.com" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "1234567890" },
  });
  fireEvent.change(screen.getByTestId("password").querySelector("input"), {
    target: { value: "" },
  });
  fireEvent.change(
    screen.getByTestId("confirmPassword").querySelector("input"),
    {
      target: { value: "Doe@123" },
    }
  );
  fireEvent.click(screen.getByTestId("register_button"));
  await waitFor(() => {
    expect(screen.queryByText("This field is required")).toBeInTheDocument();
  });
});

test("should submit form successfully and reset form after successful registration", async () => {
  const mockResponse = {
    status: 201,
    data: {},
  };

  axios.post.mockResolvedValueOnce(mockResponse);

  renderUserRegisterationPage();

  fireEvent.change(screen.getByTestId("firstName").querySelector("input"), {
    target: { value: "John" },
  });
  fireEvent.change(screen.getByTestId("lastName").querySelector("input"), {
    target: { value: "Doe" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "test@gmail.com" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "9999999999" },
  });
  fireEvent.change(screen.getByTestId("password").querySelector("input"), {
    target: { value: "johnDoe@123" },
  });
  fireEvent.change(
    screen.getByTestId("confirmPassword").querySelector("input"),
    {
      target: { value: "johnDoe@123" },
    }
  );

  fireEvent.click(screen.getByTestId("register_button"));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(`${API_ENDPOINTS.auth.register}`, {
      firstName: "John",
      lastName: "Doe",
      email: "test@gmail.com",
      contactNumber: 9999999999,
      password: "johnDoe@123",
    });
  });
});
