import { render, BrowserRouter } from "../../utils/test-utils";
import MenuManage from "../../../src/screens/admin/ProductManage";

describe("Menu manage screen", () => {
  test("should render without errors", () => {
    render(
      <BrowserRouter>
        <MenuManage />
      </BrowserRouter>
    );
  });
});
