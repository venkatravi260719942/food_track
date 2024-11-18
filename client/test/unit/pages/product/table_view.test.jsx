import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Product_table_view from "../../../../src/screens/admin/Product_table_view";
import axios from "axios";
vi.mock("axios");

// beforeEach(() => {
//   render(
//     <BrowserRouter>
//       <Product_photo_view />
//     </BrowserRouter>
//   );
test("search input", async () => {
  render(
    <BrowserRouter>
      <Product_table_view />
    </BrowserRouter>
  );
});
// });
