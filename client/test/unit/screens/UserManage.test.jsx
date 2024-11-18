import { render, BrowserRouter } from "../../utils/test-utils";
import UserManage from "../../../src/screens/admin/UserManage";

describe('Add products screen', ()=>{
    test('should render without errors', ()=>{
        render(
            <BrowserRouter>
                <UserManage/>
            </BrowserRouter>
        );
    });
})