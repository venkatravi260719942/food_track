import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import BankDetails from "../../../src/screens/admin/BankDetails";
import axios from "axios";
test("Render the component", () => {
  //   expect(screen.getByText("Add New Supplier")).toBeInTheDocument();
  render(
    <BrowserRouter>
      <BankDetails />
    </BrowserRouter>
  );
});
