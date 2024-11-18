import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Manage_single_product from "../../../../src/screens/admin/ProductManage";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { Input } from "@mui/material";
vi.mock("axios");
const mockCategory = [
  { categoryId: "1", category: "Fruit", categoryId: "2", category: "Flour" },
];
const mockProduct = [{ productId: "1", name: "mango" }];
beforeEach(() => {
  axios.get.mockResolvedValue({ data: mockCategory });
  axios.get.mockResolvedValue({ data: mockProduct });

  render(
    <BrowserRouter history={history}>
      <Manage_single_product />
    </BrowserRouter>
  );
});
// test("Unit of measure Dropdown with values", () => {
//   const input = screen.getByTestId("unitofmeasure1").querySelector("input");
//   fireEvent.click(input, { target: { value: "Kilogram" } });
//   expect(input.value).toBe("Kilogram");
// });
test("Description with special character", async () => {
  waitFor(() => {
    const input = screen
      .getByTestId("description-input1")
      .querySelector("input");
    fireEvent.change(input, { target: { value: "i have added des@" } });
    // const submitButton = screen.getByTestId(/Save Changes/i);
    // fireEvent.click(submitButton);
    expect(
      screen.findByText("Special characters are not allowed")
    ).toBeInTheDocument();
  });
});
