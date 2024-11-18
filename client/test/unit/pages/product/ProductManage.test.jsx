import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProductManage from "../../../../src/screens/admin/ProductManage";
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
    <BrowserRouter>
      <ProductManage />
    </BrowserRouter>
  );
});
test("search input", async () => {
  const Search = screen.getByTestId("psearch_content").querySelector("input");
  fireEvent.change(Search, { target: { value: "test" } });
  await waitFor(() => expect(Search).toHaveValue("test"));
});
test("Dropdown with values", () => {
  const input = screen.getByTestId("cdrop").querySelector("input");
  fireEvent.click(input, { target: { value: "Fruit" } });
  fireEvent.click(input, { target: { value: "Flour" } });
  expect(input.value).toBe("Flour", "Fruit");
});

test("Add product button  ", () => {
  const input = screen.getByTestId("addproduct").querySelector("button");
  fireEvent.click(input);
});
test("FontAwesomeIcon with data-testid='list' is in the document", () => {
  const icon = screen.getByTestId("pview");
  expect(icon).toBeInTheDocument();
});

test("renders Product_photo_view after clicking a link", async () => {
  // Click on a link to navigate to Product_photo_view
  fireEvent.click(screen.getByTestId("ptview"));

  await waitFor(() => {
    const pview = screen.getByTestId("pview");
    expect(pview).toBeInTheDocument();
  });
});
test("renders table view after clicking a link", async () => {
  // Click on a link to navigate to Product_photo_view
  fireEvent.click(screen.getByTestId("ttview"));

  // Wait for Product_photo_view to be rendered
  await waitFor(() => {
    const pview = screen.getByTestId("tttview");
    expect(pview).toBeInTheDocument();
    // Add additional assertions specific to Product_photo_view if needed
  });
});

test("selectall button", async () => {
  waitFor(() => {
    const selectall = screen.getByTestId("selectall");
    expect(selectall).toBeInTheDocument();
    fireEvent.click(selectall);
    const deleted = screen.getByTestId("deleteb");
    expect(deleted).toBeInTheDocument();
    fireEvent.click(deleted);
    expect(
      /Are you sure you want to delete selected products?/i
    ).toBeInTheDocument();
  });
});
test("deletes selected products when delete button is clicked", () => {
  // Mock the axios.delete method
  axios.delete.mockResolvedValue({ status: 204 });

  waitFor(() => {
    const selectAllButton = screen.getByTestId("selectall");
    fireEvent.click(selectAllButton);

    // Click the delete button to open the confirmation dialog
    const deleteButton = screen.getByTestId("deleteb");
    fireEvent.click(deleteButton);

    // Click the confirm button in the confirmation dialog
    const confirmButton = screen.getByText(/confirm/i);
    fireEvent.click(confirmButton);
  });

  // Ensure the delete request is made
  waitFor(() => {
    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenCalledWith(
      "http://localhost:3000/api/v1/product/1"
    );
  });

  // Ensure the success message is displayed
  waitFor(() => {
    const snackbar = screen.getByText(/products deleted successfully/i);
    expect(snackbar).toBeInTheDocument();
  });
});
