import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Supplier from "../../../src/screens/admin/Supplier";
import axios from "axios";
vi.mock("axois");
const mockSupplierCategory = [
  { categoryId: "1", categoryName: "retail" },
  { categoryId: "2", categoryName: "wholesale" },
];

beforeEach(() => {
  // axios.get.mockResolvedValue({ data: mockSupplierCategory });
  render(
    <BrowserRouter>
      <Supplier />
    </BrowserRouter>
  );
});
test("Find the supplier text", () => {
  expect(screen.getByText("Add New Supplier")).toBeInTheDocument();
});
test("Render the component", () => {});
test("Input with value and underscore", () => {
  const input = screen.getByTestId("suppliername").querySelector("input");
  fireEvent.change(input, { target: { value: "Mohan" } });
  expect(input.value).toBe("Mohan");
});
test("Input with empty values", async () => {
  const input = screen.getByTestId("suppliername").querySelector("input");
  fireEvent.change(input, { target: { value: "" } });

  const submitButton = screen.getByTestId(/nextbutton/i);
  fireEvent.click(submitButton);

  expect(
    await screen.findByText("Supplier name is required")
  ).toBeInTheDocument();
});
test("Input with invalid values", async () => {
  const input = screen.getByTestId("suppliername").querySelector("input");
  fireEvent.change(input, { target: { value: "12" } });

  const submitButton = screen.getByTestId(/nextbutton/i);
  fireEvent.click(submitButton);

  expect(await screen.findByText("Enter a valid name")).toBeInTheDocument();
});
test("Dropdown with invalid selection", async () => {
  const dropdown = screen
    .getByTestId("suppliercategory")
    .querySelector("input");
  fireEvent.change(dropdown, { target: { value: "" } });

  const submitButton = screen.getByTestId(/nextbutton/i);
  fireEvent.click(submitButton);

  expect(
    await screen.findByText("Supplier category is required")
  ).toBeInTheDocument();
});
test("Dropdown with  supplier category", () => {
  const input = screen.getByTestId("suppliercategory").querySelector("input");
  fireEvent.click(input, { target: { value: "retail" } });
  expect(input.value).toBe("retail");
}); //   const input = screen.getByTestId("suppliercategory").querySelector("input");
//   fireEvent.mouseDown(input); // Open the dropdown

//   await screen.findByText("Retail"); // Ensure the options are loaded
//   fireEvent.click(screen.getByText("Retail")); // Select "Retail"

//   expect(input.value).toBe("Retail");
// });
test("Dropdown with location", () => {
  const input = screen.getByTestId("supplierlocation").querySelector("input");
  fireEvent.click(input, { target: { value: "India" } });
  expect(input.value).toBe("India");
});
test("Invalid email number", async () => {
  const input = screen.getByTestId("semail").querySelector("input");
  fireEvent.change(input, { target: { value: "12" } });

  const submitButton = screen.getByTestId(/nextbutton/i);
  fireEvent.click(submitButton);

  expect(await screen.findByText("Invalid email address")).toBeInTheDocument();
});
test("valid email number", async () => {
  const input = screen.getByTestId("semail").querySelector("input");
  fireEvent.change(input, { target: { value: "rithick@gmail.com" } });
  expect(input.value).toBe("rithick@gmail.com");
});
test("Rendering based on location", async () => {
  const input = screen.getByTestId("suppliername").querySelector("input");
  fireEvent.change(input, { target: { value: "Rithick" } });
  expect(input.value).toBe("Rithick");

  const input1 = screen.getByTestId("suppliercategory").querySelector("input");
  fireEvent.click(input1, { target: { value: "retail" } });
  expect(input1.value).toBe("retail");

  const input2 = screen.getByTestId("semail").querySelector("input");
  fireEvent.change(input2, { target: { value: "rithick@gmail.com" } });
  expect(input2.value).toBe("rithick@gmail.com");
  const input3 = screen.getByTestId("supplierlocation").querySelector("input");
  fireEvent.click(input3, { target: { value: "India" } });
  expect(input3.value).toBe("India");
  const input4 = screen.getByTestId("cn").querySelector("input");
  fireEvent.click(input4, { target: { value: "9898989898" } });
  expect(input4.value).toBe("9898989898");
  // const input5 = screen.getByTestId("producttest").querySelector("input");
  // const products = ["potato", "mango"];
  // fireEvent.change(input5, { target: { value: JSON.stringify(products) } });

  // expect(input5.value).toBe(JSON.stringify(products));

  const autocomplete = screen.getByTestId("producttest");

  fireEvent.pick(autocomplete, { target: { value: "1" } });
  // fireEvent.click(screen.getByText("mango"));

  expect(formik.values.productId).toEqual(["1"]);
  const input6 = screen.getByTestId("saddress").querySelector("input");
  fireEvent.change(input6, { target: { value: "3/12,chennai" } });
  expect(input6.value).toBe("3/12,chennai");
  const submitButton = screen.getByTestId(/nextbutton/i);
  fireEvent.click(submitButton);

  // expect(await screen.findByText("BANK DETAILS")).toBeInTheDocument();
});
