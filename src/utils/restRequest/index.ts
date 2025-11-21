import {
    RequestContext,
    RequestOptions,
    useRequest,
} from '@togglecorp/toggle-request';

import { NotesList } from '#utils/types';

import { TransformedError } from './unified';

type NotesResponse = {
    page: number;
    page_size: number;
    results: NotesList[];
}

/** @knipignore */
// eslint-disable-next-line max-len
const useUnifiedRequest: (
    requestOptions: RequestOptions<NotesResponse, TransformedError, unknown>
) => {
    response: NotesResponse | undefined;
    pending: boolean;
    error: TransformedError | undefined;
    retrigger: () => void;
} = useRequest;

export {
    RequestContext,
    useUnifiedRequest as useRequest,
};
