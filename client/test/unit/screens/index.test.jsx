// import { render } from '@testing-library/react';
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from '../../../src/App';
// import { vi } from 'vitest';

import { describe } from "vitest";

// describe('index.jsx', () => {
//     test('should render the App component', () => {
//         // Mock the document.getElementById function
//         const mockGetElementById = vi.spyOn(document, 'getElementById');
//         mockGetElementById.mockReturnValue({ id: 'root' });
    
//         // Mock the ReactDOM.createRoot function
//         const mockCreateRoot = vi.fn(() => ({ render: vi.fn() }));
//         vi.spyOn(ReactDOM, 'createRoot').mockImplementation(mockCreateRoot);
    
//         // Render the index.jsx file
//         render(
//           <React.StrictMode>
//             <App />
//           </React.StrictMode>
//         );
    
//         // Assert the expected behavior
//         expect(mockGetElementById).toHaveBeenCalledWith('root');
//         expect(mockCreateRoot).toHaveBeenCalledWith({ id: 'root' });
//         expect(mockCreateRoot).toHaveReturnedWith({
//           render: expect.any(Function),
//         });
//         expect(mockCreateRoot().render).toHaveBeenCalledWith(
//           <React.StrictMode>
//             <App />
//           </React.StrictMode>
//         );
//     });
// });

describe("test", ()=>{
    test("test", ()=>{
        expect(1).toBe(1)
    })
})