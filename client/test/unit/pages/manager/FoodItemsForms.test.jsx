import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FoodItemForm from "../../../../src/screens/manager/FoodItems/FoodItemsForms"; // Adjust the path to your component file
import { MemoryRouter, Router } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Cookies from "js-cookie";

// Mock necessary dependencies
vi.mock("axios");
vi.mock("js-cookie");
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// Mock language context
vi.mock("../../../LanguageContext", () => ({
  useLanguage: () => ({ language: "en", changeLanguage: vi.fn() }),
}));

// Mock Formik
vi.mock("formik", () => ({
  useFormik: (config) => {
    const formik = {
      values: {},
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      setFieldValue: vi.fn(),
      touched: {},
      errors: {},
      setStatus: vi.fn(),
    };
    // Define a mock initialValues based on config
    if (config.initialValues) {
      formik.values = config.initialValues;
    }
    return formik;
  },
}));

// Mock useParams
vi.mock("react-router-dom", () => ({
  ...vi.mocked("react-router-dom"),
  useParams: () => ({ id: "1" }), // Example ID
  useNavigate: () => vi.fn(),
  useLocation: () => ({ search: "?view=test" }),
  MemoryRouter: vi.fn(),
  Router: vi.fn(), // Add Router mock
}));

describe("FoodItemForm", () => {
  let mockAxios;
  let mockCategories = [
    { categoryId: 1, category: "Pizza" },
    { categoryId: 2, category: "Pasta" },
  ];

  beforeEach(() => {
    // Mock Axios behavior
    mockAxios = vi.mocked(axios);
    mockAxios.get.mockResolvedValueOnce({
      data: mockCategories,
    }); // Mock response for category fetching
    mockAxios.put.mockResolvedValue({});
    mockAxios.post.mockResolvedValue({ data: {} });

    // Mock Cookies
    vi.mocked(Cookies).get.mockReturnValue({
      token: "testToken",
      branchId: "1",
      username: "testUser",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the FoodItemForm component", () => {
    render(
      <MemoryRouter>
        <FoodItemForm />
      </MemoryRouter>
    );
    // expect(screen.getByText("addNewFoodItem")).toBeInTheDocument();
  });

  // it("fetches categories on mount", async () => {
  //   render(
  //     <MemoryRouter>
  //       <FoodItemForm />
  //     </MemoryRouter>
  //   );
  //   console.log(mockCategories);

  //   // Assert that the mock data was fetched
  //   expect(mockCategories.get).toHaveBeenCalled(); // Ensure the fetch happened
  //   expect(mockCategories.get).toHaveBeenCalledWith("/categories"); // Verify the endpoint
  //   expect(mockCategories.get).toHaveReturnedWith({
  //     data: mockCategories, // Verify the response data
  //   });
  // });

  // it("renders fetched categories in the dropdown", () => {
  //   render(
  //     <MemoryRouter>
  //       <FoodItemForm />
  //     </MemoryRouter>
  //   );
  //   // ... Wait for useEffect to finish fetching categories ...
  //   expect(screen.getByText("Pizza")).toBeInTheDocument();
  //   expect(screen.getByText("Pasta")).toBeInTheDocument();
  // });
});
