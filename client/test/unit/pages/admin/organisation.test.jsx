import { test, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Organisation from "../../../../src/screens/home/Organisation";
import Overview from "../../../../src/screens/home/OverviewPage";
import AdminDashboard from "../../../../src/screens/admin/AdminDashboard";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import API_ENDPOINTS from "../../../../src/config/url.config";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import axios from "axios";
vi.mock("axios");

const renderOrganisationPage = () => {
  render(
    <MemoryRouter initialEntries={["/organisationRegistration"]}>
      <Routes>
        <Route
          path="/organisationRegistration"
          element={<Organisation />}
        ></Route>
        <Route path="/overview" element={<Overview />}></Route>
        <Route path="/admin" element={<AdminDashboard />}></Route>
      </Routes>
    </MemoryRouter>
  );
};

test("renders UserRegistration component", () => {
  renderOrganisationPage();
});

test("updates state when input fields change", () => {
  renderOrganisationPage();
  fireEvent.change(screen.getByTestId("companyName").querySelector("input"), {
    target: { value: "Adeptview" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "9876543215" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "gowthamravi1904@gmail.com" },
  });

  const countrySelect = screen.getByTestId("country");
  countrySelect.value = "China";
  fireEvent.change(countrySelect);

  const stateSelect = screen.getByTestId("state");
  stateSelect.value = "Sichuan";
  fireEvent.change(stateSelect);

  const languageSelect = screen.getByTestId("language");
  languageSelect.value = "English";
  fireEvent.change(languageSelect);

  const companySizeSelect = screen.getByTestId("companySize");
  companySizeSelect.value = "1 - 10";
  fireEvent.change(companySizeSelect);

  const primaryInterestSelect = screen.getByTestId("primaryInterest");
  primaryInterestSelect.value = "I am teacher";
  fireEvent.change(primaryInterestSelect);

  expect(screen.getByTestId("companyName").querySelector("input")).toHaveValue(
    "Adeptview"
  );
  expect(
    screen.getByTestId("contactNumber").querySelector("input")
  ).toHaveValue("9876543215");
  expect(screen.getByTestId("email").querySelector("input")).toHaveValue(
    "gowthamravi1904@gmail.com"
  );
  expect(screen.getByTestId("country")).toHaveValue("China");
  expect(screen.getByTestId("state")).toHaveValue("Sichuan");
  expect(screen.getByTestId("language")).toHaveValue("English");
  expect(screen.getByTestId("companySize")).toHaveValue("1 - 10");
  expect(screen.getByTestId("primaryInterest")).toHaveValue("I am teacher");
});

test("displays error message for invalid email format", async () => {
  renderOrganisationPage();
  const email = screen.getByTestId("email").querySelector("input");
  fireEvent.change(email, {
    target: { value: "invalid_email" },
  });
  fireEvent.click(screen.getByTestId("Register_button"));
  await waitFor(() => {
    expect(screen.queryByText("Invalid email address")).toBeInTheDocument();
  });
});

test("displays error message for invalid contact number format", async () => {
  renderOrganisationPage();
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "123" },
  });
  fireEvent.click(screen.getByTestId("Register_button"));
  await waitFor(() => {
    expect(
      screen.queryByText("Enter valid contact number")
    ).toBeInTheDocument();
  });
});

test("displays error message for companyName null", async () => {
  renderOrganisationPage();
  fireEvent.change(screen.getByTestId("companyName").querySelector("input"), {
    target: { value: "" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "9876543215" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "gowthamravi1904@gmail.com" },
  });

  const countrySelect = screen.getByTestId("country");
  countrySelect.value = "China";
  fireEvent.change(countrySelect);

  const stateSelect = screen.getByTestId("state");
  stateSelect.value = "Sichuan";
  fireEvent.change(stateSelect);

  const languageSelect = screen.getByTestId("language");
  languageSelect.value = "English";
  fireEvent.change(languageSelect);

  const companySizeSelect = screen.getByTestId("companySize");
  companySizeSelect.value = "1 - 10";
  fireEvent.change(companySizeSelect);

  const primaryInterestSelect = screen.getByTestId("primaryInterest");
  primaryInterestSelect.value = "I am teacher";
  fireEvent.change(primaryInterestSelect);

  fireEvent.click(screen.getByTestId("Register_button"));
  await waitFor(() => {
    expect(screen.queryByText("Company name is required")).toBeInTheDocument();
  });
});

test("displays error message for contactNumber null", async () => {
  renderOrganisationPage();
  fireEvent.change(screen.getByTestId("companyName").querySelector("input"), {
    target: { value: "Adeptview" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "gowthamravi1904@gmail.com" },
  });

  const countrySelect = screen.getByTestId("country");
  countrySelect.value = "China";
  fireEvent.change(countrySelect);

  const stateSelect = screen.getByTestId("state");
  stateSelect.value = "Sichuan";
  fireEvent.change(stateSelect);

  const languageSelect = screen.getByTestId("language");
  languageSelect.value = "English";
  fireEvent.change(languageSelect);

  const companySizeSelect = screen.getByTestId("companySize");
  companySizeSelect.value = "1 - 10";
  fireEvent.change(companySizeSelect);

  const primaryInterestSelect = screen.getByTestId("primaryInterest");
  primaryInterestSelect.value = "I am teacher";
  fireEvent.change(primaryInterestSelect);

  fireEvent.click(screen.getByTestId("Register_button"));
  await waitFor(() => {
    expect(
      screen.queryByText("Contact number is required")
    ).toBeInTheDocument();
  });
});

test("displays error message for email null", async () => {
  renderOrganisationPage();
  fireEvent.change(screen.getByTestId("companyName").querySelector("input"), {
    target: { value: "Adeptview" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "9876543215" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "" },
  });

  const countrySelect = screen.getByTestId("country");
  countrySelect.value = "China";
  fireEvent.change(countrySelect);

  const stateSelect = screen.getByTestId("state");
  stateSelect.value = "Sichuan";
  fireEvent.change(stateSelect);

  const languageSelect = screen.getByTestId("language");
  languageSelect.value = "English";
  fireEvent.change(languageSelect);

  const companySizeSelect = screen.getByTestId("companySize");
  companySizeSelect.value = "1 - 10";
  fireEvent.change(companySizeSelect);

  const primaryInterestSelect = screen.getByTestId("primaryInterest");
  primaryInterestSelect.value = "I am teacher";
  fireEvent.change(primaryInterestSelect);

  fireEvent.click(screen.getByTestId("Register_button"));
  await waitFor(() => {
    expect(screen.queryByText("Email is required")).toBeInTheDocument();
  });
});

test("displays error message for country null", async () => {
  renderOrganisationPage();
  fireEvent.change(screen.getByTestId("companyName").querySelector("input"), {
    target: { value: "Adeptview" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "9876543215" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "gowthamravi1904@gmail.com" },
  });

  const countrySelect = screen.getByTestId("country");
  countrySelect.value = "";
  fireEvent.change(countrySelect);

  const stateSelect = screen.getByTestId("state");
  stateSelect.value = "Sichuan";
  fireEvent.change(stateSelect);

  const languageSelect = screen.getByTestId("language");
  languageSelect.value = "English";
  fireEvent.change(languageSelect);

  const companySizeSelect = screen.getByTestId("companySize");
  companySizeSelect.value = "1 - 10";
  fireEvent.change(companySizeSelect);

  const primaryInterestSelect = screen.getByTestId("primaryInterest");
  primaryInterestSelect.value = "I am teacher";
  fireEvent.change(primaryInterestSelect);

  fireEvent.click(screen.getByTestId("Register_button"));
  await waitFor(() => {
    expect(screen.queryByText("Country is required")).toBeInTheDocument();
  });
});

test("displays error message for state null", async () => {
  renderOrganisationPage();
  fireEvent.change(screen.getByTestId("companyName").querySelector("input"), {
    target: { value: "Adeptview" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "9876543215" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "gowthamravi1904@gmail.com" },
  });

  const countrySelect = screen.getByTestId("country");
  countrySelect.value = "China";
  fireEvent.change(countrySelect);

  const stateSelect = screen.getByTestId("state");
  stateSelect.value = "";
  fireEvent.change(stateSelect);

  const languageSelect = screen.getByTestId("language");
  languageSelect.value = "English";
  fireEvent.change(languageSelect);

  const companySizeSelect = screen.getByTestId("companySize");
  companySizeSelect.value = "1 - 10";
  fireEvent.change(companySizeSelect);

  const primaryInterestSelect = screen.getByTestId("primaryInterest");
  primaryInterestSelect.value = "I am teacher";
  fireEvent.change(primaryInterestSelect);

  fireEvent.click(screen.getByTestId("Register_button"));
  await waitFor(() => {
    expect(screen.queryByText("State is required")).toBeInTheDocument();
  });
});

test("displays error message for language null", async () => {
  renderOrganisationPage();
  fireEvent.change(screen.getByTestId("companyName").querySelector("input"), {
    target: { value: "Adeptview" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "9876543215" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "gowthamravi1904@gmail.com" },
  });

  const countrySelect = screen.getByTestId("country");
  countrySelect.value = "China";
  fireEvent.change(countrySelect);

  const stateSelect = screen.getByTestId("state");
  stateSelect.value = "Sichuan";
  fireEvent.change(stateSelect);

  const languageSelect = screen.getByTestId("language");
  languageSelect.value = "";
  fireEvent.change(languageSelect);

  const companySizeSelect = screen.getByTestId("companySize");
  companySizeSelect.value = "1 - 10";
  fireEvent.change(companySizeSelect);

  const primaryInterestSelect = screen.getByTestId("primaryInterest");
  primaryInterestSelect.value = "I am teacher";
  fireEvent.change(primaryInterestSelect);

  fireEvent.click(screen.getByTestId("Register_button"));
  await waitFor(() => {
    expect(screen.queryByText("Language is required")).toBeInTheDocument();
  });
});

test("displays error message for companySize null", async () => {
  renderOrganisationPage();
  fireEvent.change(screen.getByTestId("companyName").querySelector("input"), {
    target: { value: "Adeptview" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "9876543215" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "gowthamravi1904@gmail.com" },
  });

  const countrySelect = screen.getByTestId("country");
  countrySelect.value = "China";
  fireEvent.change(countrySelect);

  const stateSelect = screen.getByTestId("state");
  stateSelect.value = "Sichuan";
  fireEvent.change(stateSelect);

  const languageSelect = screen.getByTestId("language");
  languageSelect.value = "English";
  fireEvent.change(languageSelect);

  const companySizeSelect = screen.getByTestId("companySize");
  companySizeSelect.value = "";
  fireEvent.change(companySizeSelect);

  const primaryInterestSelect = screen.getByTestId("primaryInterest");
  primaryInterestSelect.value = "I am teacher";
  fireEvent.change(primaryInterestSelect);

  fireEvent.click(screen.getByTestId("Register_button"));
  await waitFor(() => {
    expect(screen.queryByText("Company size is required")).toBeInTheDocument();
  });
});

test("displays error message for primaryInterest null", async () => {
  renderOrganisationPage();
  fireEvent.change(screen.getByTestId("companyName").querySelector("input"), {
    target: { value: "Adeptview" },
  });
  fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
    target: { value: "9876543215" },
  });
  fireEvent.change(screen.getByTestId("email").querySelector("input"), {
    target: { value: "gowthamravi1904@gmail.com" },
  });

  const countrySelect = screen.getByTestId("country");
  countrySelect.value = "China";
  fireEvent.change(countrySelect);

  const stateSelect = screen.getByTestId("state");
  stateSelect.value = "Sichuan";
  fireEvent.change(stateSelect);

  const languageSelect = screen.getByTestId("language");
  languageSelect.value = "English";
  fireEvent.change(languageSelect);

  const companySizeSelect = screen.getByTestId("companySize");
  companySizeSelect.value = "1 - 10";
  fireEvent.change(companySizeSelect);

  const primaryInterestSelect = screen.getByTestId("primaryInterest");
  primaryInterestSelect.value = "";
  fireEvent.change(primaryInterestSelect);

  fireEvent.click(screen.getByTestId("Register_button"));
  await waitFor(() => {
    expect(
      screen.queryByText("Primary interest is required")
    ).toBeInTheDocument();
  });
});

// test("should show success toast and reset form after successful registration", async () => {
//   const mockResponse = {
//     status: 201,
//     data: {},
//   };

//   axios.post.mockResolvedValueOnce(mockResponse);

//   renderOrganisationPage();
//   fireEvent.change(screen.getByTestId("companyName").querySelector("input"), {
//     target: { value: "Adeptview" },
//   });
//   fireEvent.change(screen.getByTestId("contactNumber").querySelector("input"), {
//     target: { value: "9876043215" },
//   });
//   fireEvent.change(screen.getByTestId("email").querySelector("input"), {
//     target: { value: "gowthamravi1904@gmail.com" },
//   });

//   const countrySelect = screen.getByTestId("country");
//   countrySelect.value = "China";
//   fireEvent.change(countrySelect);

//   const stateSelect = screen.getByTestId("state");
//   stateSelect.value = "Sichuan";
//   fireEvent.change(stateSelect);

//   const languageSelect = screen.getByTestId("language");
//   languageSelect.value = "English";
//   fireEvent.change(languageSelect);

//   const companySizeSelect = screen.getByTestId("companySize");
//   companySizeSelect.value = "1 - 10";
//   fireEvent.change(companySizeSelect);

//   const primaryInterestSelect = screen.getByTestId("primaryInterest");
//   primaryInterestSelect.value = "I am teacher";
//   fireEvent.change(primaryInterestSelect);

//   fireEvent.click(screen.getByTestId("Register_button"));

//   await waitFor(() => {
//     expect(axios.post).toHaveBeenCalledWith(
//       `${API_ENDPOINTS.organisation.postOrganisation}`,
//       {
//         companyName: "Adeptview",
//         contactNumber: "9876043215",
//         email: "gowthamravi1904@gmail.com",
//         country: "China",
//         state: "Sichuan",
//         language: "English",
//         companySize: "1 - 10",
//         primaryInterest: "I am teacher",
//       }
//     );
//   });
// });

test("fetches data from the API on component mount", async () => {
  renderOrganisationPage();
  // Mock data returned from the API
  const languageData = ["Language"];
  const countryData = ["Country"];
  const primaryInterestData = ["Primary Interest"];
  const companySizeData = ["Company Size"];
  const stateData = ["State"];

  // Mock axios.get to return the mocked data for each endpoint
  axios.get
    .mockResolvedValueOnce({ data: languageData })
    .mockResolvedValueOnce({ data: countryData })
    .mockResolvedValueOnce({ data: primaryInterestData })
    .mockResolvedValueOnce({ data: companySizeData })
    .mockResolvedValueOnce({ data: stateData });

  // Wait for all data to be fetched and displayed
  await waitFor(() => {
    // Check if the fetched data is displayed in the dropdowns
    expect(screen.getByTestId("language")).toHaveTextContent("Language");
    expect(screen.getByTestId("country")).toHaveTextContent("Country");
    expect(screen.getByTestId("primaryInterest")).toHaveTextContent(
      "Primary interest"
    );
    expect(screen.getByTestId("companySize")).toHaveTextContent("Company Size");
    expect(screen.getByTestId("state")).toHaveTextContent("state");
  });
});
