import { render, BrowserRouter } from "../../utils/test-utils";
import Profile from "../../../src/screens/admin/Profile";

describe('Add products screen', ()=>{
    test('should render without errors', ()=>{
        render(
            <BrowserRouter>
                <Profile/>
            </BrowserRouter>
        );
    });
})