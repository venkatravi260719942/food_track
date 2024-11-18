import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MockAdapter } from "react-router-dom";
import AddProduct from "../../../../src/screens/admin/AddProduct";
import axios from "axios";
vi.mock("axios");
const mockUnits = [
  { unitId: "1", units: "Kilogram" },
  { unitId: "2", units: "Liter" },
];
const mockCategory = [{ categoryId: "1", category: "Fruit" }];

const mockFileReader = {
  onloadend: vitest.fn(),
  readAsDataURL: vitest.fn(),
};
global.FileReader = vitest.fn(() => mockFileReader);
beforeEach(() => {
  axios.get.mockResolvedValue({ data: mockUnits });
  axios.get.mockResolvedValue({ data: mockCategory });
  render(
    <BrowserRouter>
      <AddProduct />
    </BrowserRouter>
  );
});
test("render component", () => {
  expect(screen.getByText("Add Products")).toBeInTheDocument();
});

test("Input with value and underscore", () => {
  const input = screen.getByTestId("product-name-input").querySelector("input");
  fireEvent.change(input, { target: { value: "Mango_" } });
  expect(input.value).toBe("Mango_");
});

test("Input with value and underscore", async () => {
  const input = screen.getByTestId("product-name-input").querySelector("input");
  fireEvent.change(input, { target: { value: "" } });

  const submitButton = screen.getByTestId(/Add/i);
  fireEvent.click(submitButton);

  expect(
    await screen.findByText("Product name is required")
  ).toBeInTheDocument();
});
test("Input with invalidname", async () => {
  const input = screen.getByTestId("product-name-input").querySelector("input");
  fireEvent.change(input, { target: { value: "hello@" } });

  const submitButton = screen.getByTestId(/Add/i);
  fireEvent.click(submitButton);

  expect(
    await screen.findByText("Product name can only contain letters and numbers")
  ).toBeInTheDocument();
});
test("Dropdown with invalid selection", async () => {
  const dropdown = screen.getByTestId("category-select").querySelector("input");
  fireEvent.change(dropdown, { target: { value: "" } }); // Assuming an empty value is invalid

  const submitButton = screen.getByTestId(/Add/i);
  fireEvent.click(submitButton);

  expect(await screen.findByText("Category is required")).toBeInTheDocument();
});
test("Dropdown with values", () => {
  const input = screen.getByTestId("category-select").querySelector("input");
  fireEvent.click(input, { target: { value: "Fruit" } });
  expect(input.value).toBe("Fruit");
});

test("Description with values", () => {
  const input = screen.getByTestId("description-input").querySelector("input");
  fireEvent.change(input, { target: { value: "i have added des" } });
  expect(input.value).toBe("i have added des");
});
test("Description with special character", async () => {
  const input = screen.getByTestId("description-input").querySelector("input");
  fireEvent.change(input, { target: { value: "i have added des@" } });
  const submitButton = screen.getByTestId(/Add/i);
  fireEvent.click(submitButton);
  expect(
    await screen.findByText("Description can only contain letters and numbers")
  ).toBeInTheDocument();
});
test("Checkbox 'Can be sold'", () => {
  const checkbox = screen.getByTestId("Can-be-sold").querySelector("input");
  fireEvent.click(checkbox);
  expect(checkbox.checked).toBe(true); // Check if the checkbox is checked

  fireEvent.click(checkbox);
  expect(checkbox.checked).toBe(false); // Check if the checkbox is unchecked
});

test("Checkbox 'Can be purchased'", () => {
  const checkbox = screen
    .getByTestId("Can-be-purchased")
    .querySelector("input");
  fireEvent.click(checkbox);
  expect(checkbox.checked).toBe(true); // Check if the checkbox is checked

  fireEvent.click(checkbox);
  expect(checkbox.checked).toBe(false); // Check if the checkbox is unchecked
});
test("Unit of measure Dropdown with invalid selection", async () => {
  const dropdown = screen.getByTestId("unitofmeasure").querySelector("input");
  fireEvent.change(dropdown, { target: { value: "" } }); // Assuming an empty value is invalid

  const submitButton = screen.getByTestId(/Add/i);
  fireEvent.click(submitButton);

  expect(
    await screen.findByText("Unit of measure is required")
  ).toBeInTheDocument();
});
test("Unit of measure Dropdown with values", () => {
  const input = screen.getByTestId("unitofmeasure").querySelector("input");
  fireEvent.click(input, { target: { value: "Kilogram" } });
  expect(input.value).toBe("Kilogram");
});
// test("fetch and render units", async () => {
//   // Wait for the units to be fetched and rendered
//   await waitFor(() =>
//     expect(axios.get).toHaveBeenCalledWith(
//       "http://localhost:3000/api/v1/unit-of-measure"
//     )
//   );

//   // Check if the units are rendered as MenuItems
//   const unitSelect = screen
//     .getByTestId("unitofmeasure")
//     .querySelector("select");
//   fireEvent.click(unitSelect); // Open the dropdown

//   expect(await screen.findByText("Kilogram")).toBeInTheDocument();
//   expect(await screen.findByText("Liter")).toBeInTheDocument();
// });
test("shows error for empty input", async () => {
  const input = screen.getByTestId("cost-price-input").querySelector("input");
  fireEvent.change(input, { target: { value: "" } });

  const submitButton = screen.getByTestId(/Add/i);
  fireEvent.click(submitButton);

  expect(await screen.findByText("Cost price is required")).toBeInTheDocument();
});
test("cost price value", async () => {
  const input = screen.getByTestId("cost-price-input").querySelector("input");
  fireEvent.change(input, { target: { value: "1" } });
  expect(input.value).toBe("1");
});
test("accepts valid input", async () => {
  const input = screen.getByTestId("sales-price-input").querySelector("input");
  fireEvent.change(input, { target: { value: "150" } });
  expect(input.value).toBe("150");
});
test("handles image change", () => {
  const { getByTestId } = render();
  const fileInput = getByTestId("product_image");

  // Create a fake file
  const file = new File(["dummy content"], "test.png", {
    type: "image/png",
  });

  // Simulate file selection
  fireEvent.change(fileInput, { target: { files: [file] } });

  // Assert that the selected image has been updated
  expect(getByTestId("image").getAttribute("src")).toContain(
    "/src/assets/images/productimagedefault.svg"
  );
});
// test("handles image change", async () => {
//   const mock = MockAdapter;
//   mock
//     .onPost("http://localhost:3000/api/v1/product/upload-product-image")
//     .reply(200, {
//       imageUrl: "http://example.com/test.png",
//     });

//   const { getByTestId } = render(<AddProduct />);
//   const fileInput = getByTestId("product_image");

//   // Create a fake file
//   const file = new File(["dummy content"], "test.png", {
//     type: "image/png",
//   });

//   // Simulate file selection
//   fireEvent.change(fileInput, { target: { files: [file] } });

//   // Wait for the image update (assuming it's asynchronous)
//   await waitFor(() => {
//     expect(getByTestId("image").getAttribute("src")).toContain(
//       "http://example.com/test.png"
//     );
//   });
// });
