import { render, BrowserRouter } from "../../utils/test-utils";
import AdminDashboard from "../../../src/screens/admin/AdminDashboard";

describe('Add products screen', ()=>{
    test('should render without errors', ()=>{
        render(
            <BrowserRouter>
                <AdminDashboard/>
            </BrowserRouter>
        );
    });
})