import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Product_photo_view from "../../../../src/screens/admin/Product_photo_view";
import axios from "axios";
import ProductManage from "../../../../src/screens/admin/ProductManage";
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
      <Product_photo_view />
    </BrowserRouter>
  );
});
test("handleCardClick is called with correct arguments when Checkbox is clicked", () => {
  // Mock product data
  waitFor(() => {
    // Mock handleCardClick function
    const handleCardClick = vitest.fn();

    // Simulate click on the Checkbox
    const checkbox = screen.getByTestId("cb");
    fireEvent.click(checkbox);

    // Expect handleCardClick to be called with the correct arguments
    expect(handleCardClick).toHaveBeenCalledWith(product);
  });
});
