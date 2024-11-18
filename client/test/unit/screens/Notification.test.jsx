import { render, BrowserRouter } from "../../utils/test-utils";
import Notification from "../../../src/screens/admin/Notification";

describe('Add products screen', ()=>{
    test('should render without errors', ()=>{
        render(
            <BrowserRouter>
                <Notification/>
            </BrowserRouter>
        );
    });
})