import { render, BrowserRouter } from "../../utils/test-utils";
import SalesForcast from "../../../src/screens/admin/SalesForecast";

describe("Add products screen", () => {
  test("should render without errors", () => {
    render(
      <BrowserRouter>
        <SalesForcast />
      </BrowserRouter>
    );
  });
});
