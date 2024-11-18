import { render, BrowserRouter } from "../../utils/test-utils";
import AddProducts from "../../../src/screens/admin/AddProduct";

describe('Add products screen', ()=>{
    test('should render without errors', ()=>{
        render(
            <BrowserRouter>
                <AddProducts/>
            </BrowserRouter>
        );
    });
})