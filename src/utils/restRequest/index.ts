import {
    LazyRequestOptions,
    RequestContext,
    RequestOptions,
    useLazyRequest,
    useRequest,
} from '@togglecorp/toggle-request';

import { TransformedError } from './unified';

/** @knipignore */
// eslint-disable-next-line max-len
const useUnifiedLazyRequest: <R, C = null>(requestOptions: LazyRequestOptions<R, null, C, null>) => {
    response: R | undefined;
    pending: boolean;
    trigger: (ctx: C) => void;
    context: C | undefined,
} = useLazyRequest;

const useUnifiedRequest: <R>(
    requestOptions: RequestOptions<R, TransformedError, null>
) => {
    response: R | undefined;
    pending: boolean;
    error: TransformedError | undefined;
    retrigger: () => void;
} = useRequest;

export {
    RequestContext,
    useUnifiedLazyRequest as useLazyRequest,
    useUnifiedRequest as useRequest,
};
