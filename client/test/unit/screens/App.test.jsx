import { render } from "../../utils/test-utils";

import App from "../../../src/App";
import { describe } from "vitest";

describe('App component', ()=>{
    it('render the routes component', ()=>{
        render(<App/>)
    })
})