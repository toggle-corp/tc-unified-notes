import '@togglecorp/toggle-ui/build/index.css';

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import RouteContext from '#contexts/route';

import wrappedRoutes, { unwrappedRoutes } from './routes';

const router = createBrowserRouter(unwrappedRoutes);

function App() {
    return (
        <RouteContext.Provider value={wrappedRoutes}>
            <RouterProvider router={router} />
        </RouteContext.Provider>
    );
}

export default App;
