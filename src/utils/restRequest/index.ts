import {
    RequestContext,
    useRequest,
} from '@togglecorp/toggle-request';

import { paths as unifiedPaths } from '#generated/types';

import {
    ApiResponse,
    CustomRequestOptions,
    CustomRequestReturn,
    VALID_METHOD,
} from './overrideTypes';

export type UnifiedApiResponse<URL extends keyof unifiedPaths, METHOD extends 'GET' | 'POST' | 'PUT' | 'PATCH' = 'GET'> = ApiResponse<unifiedPaths, URL, METHOD>;

/** @knipignore */
// eslint-disable-next-line max-len
const useUnifiedRequest = useRequest as <
    PATH extends keyof unifiedPaths,
    METHOD extends VALID_METHOD | undefined = 'GET',
>(
    requestOptions: CustomRequestOptions<unifiedPaths, PATH, METHOD>
) => CustomRequestReturn<unifiedPaths, PATH, METHOD>;

export {
    RequestContext,
    useUnifiedRequest as useRequest,
};
