import '@togglecorp/toggle-ui/build/index.css';

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import RouteContext from '#contexts/route';
import { RequestContext } from '#utils/restRequest';
import {
    unifiedError,
    unifiedOptions,
    unifiedResponse,
    unifiedUrls,
} from '#utils/restRequest/unified';

import wrappedRoutes, { unwrappedRoutes } from './routes';

const requestContextValue = {
    transformUrl: unifiedUrls,
    transformOptions: unifiedOptions,
    transformResponse: unifiedResponse,
    transformError: unifiedError,
};

const router = createBrowserRouter(unwrappedRoutes);

function App() {
    return (
        <RouteContext.Provider value={wrappedRoutes}>
            <RequestContext.Provider value={requestContextValue}>
                <RouterProvider router={router} />
            </RequestContext.Provider>
        </RouteContext.Provider>
    );
}

export default App;
