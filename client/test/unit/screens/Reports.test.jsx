import { render, BrowserRouter } from "../../utils/test-utils";
import Reports from "../../../src/screens/admin/Reports";

describe('Add products screen', ()=>{
    test('should render without errors', ()=>{
        render(
            <BrowserRouter>
                <Reports/>
            </BrowserRouter>
        );
    });
})