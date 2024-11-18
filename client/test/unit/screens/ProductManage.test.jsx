import { render, BrowserRouter } from "../../utils/test-utils";
import ProductManage from "../../../src/screens/admin/ProductManage";

describe('Add products screen', ()=>{
    test('should render without errors', ()=>{
        render(
            <BrowserRouter>
                <ProductManage/>
            </BrowserRouter>
        );
    });
})