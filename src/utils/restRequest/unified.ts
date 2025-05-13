import { ContextInterface } from '@togglecorp/toggle-request';

import { resolveUrl } from '#utils/resolveUrl';

const CONTENT_TYPE_JSON = 'application/json';
const unifiedApi = import.meta.env.APP_UNIFIED_ENDPOINT ?? '';

type ResponseError = {
    status: number;
    originalResponse: Response,
    responseText: string;
}

export interface TransformedError {
    value: {
        messageForNotification: string,
    };
    status: number | undefined;
    reason: 'network' | 'parse' | 'server';
}
type UnifiedContextInterface = ContextInterface<
    unknown,
    ResponseError,
    TransformedError,
    unknown
>

export const unifiedUrls: UnifiedContextInterface['transformUrl'] = (
    link,
) => resolveUrl(
    unifiedApi,
    link,
);

export const unifiedResponse: UnifiedContextInterface['transformResponse'] = async (
    res,
) => {
    if (res.status >= 200 && res.status < 300) {
        return res.json();
    }

    const response = await res.text();
    return {
        status: res.status,
        responseText: response,
    };
};

export const unifiedError: UnifiedContextInterface['transformError'] = (
    responseError,
    _,
    requestOptions,
) => {
    const { method } = requestOptions;

    if (responseError === 'network') {
        return {
            reason: 'network',
            value: {
                messageForNotification: 'Cannot communicate with the server! Please, make sure you have an active internet connection and try again!',
            },
            status: undefined,
        };
    }
    if (responseError === 'parse') {
        return {
            reason: 'parse',
            value: {
                messageForNotification: 'There was a problem parsing the response from server',
            },
            status: undefined,
        };
    }

    // default fallback message for GET
    let fallbackMessage = 'Failed to load data';

    if (method !== 'GET') {
        if (responseError.status >= 400 && responseError.status <= 500) {
            fallbackMessage = 'Some error occurred while performing this action.';
        }
    }

    return {
        reason: 'server',
        value: {
            messageForNotification: fallbackMessage,
        },
        status: responseError?.status,
    };
};

export const unifiedOptions: UnifiedContextInterface['transformOptions'] = (
    _,
    requestOptions,
) => {
    const {
        body,
        method = 'GET',
        ...otherOptions
    } = requestOptions;

    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        const sanitizedBody = body;
        const requestBody = sanitizedBody
            ? JSON.stringify(sanitizedBody)
            : undefined;
        const val: ReturnType<UnifiedContextInterface['transformOptions']> = {
            method,
            headers: {
                'Content-Type': CONTENT_TYPE_JSON,
            },
            body: requestBody,
            ...otherOptions,
        };
        return val;
    }

    const val: ReturnType<UnifiedContextInterface['transformOptions']> = {
        method,
        headers: {
            Accept: CONTENT_TYPE_JSON,
            'Content-Type': CONTENT_TYPE_JSON,
        },
        ...otherOptions,
    };
    return val;
};
