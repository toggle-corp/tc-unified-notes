import {
    useMemo,
    useState,
} from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import {
    DateInput,
    Pager,
    SelectInput,
    Table,
    TextInput,
} from '@ifrc-go/ui';
import { SortContext } from '@ifrc-go/ui/contexts';
import {
    createDateColumn,
    createElementColumn,
    createStringColumn,
} from '@ifrc-go/ui/utils';

import Container from '#components/Container';
import Navbar from '#components/Navbar';
import Page from '#components/Page';
import { components } from '#generated/types';
import useDebouncedValue from '#hooks/useDebouncedValue';
import useFilterState from '#hooks/useFilterState';
import {
    UnifiedApiResponse,
    useRequest,
} from '#utils/restRequest';

import styles from './styles.module.css';

type OrderByType = components['schemas']['NoteOrderBy'];

type UsersResponse = UnifiedApiResponse<'/users'>
type NotesResponse = UnifiedApiResponse<'/notes'>
type NotesList = NonNullable<NonNullable<NotesResponse>['results']>[number];
type UsersList = NonNullable<UsersResponse>[number]

const keySelector = (option: NotesList) => option.id;

function usersListKeySelector(type: UsersList) {
    return type.id;
}
function labelSelector(type: UsersList) {
    return type.display_name ?? '?';
}
const PAGE_SIZE = 10;

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const {
        ordering: orderingByFilterState,
        orderingByDesc,
        filter,
        page,
        limit,
        sortState,
        setPage,
        setFilterField,
    } = useFilterState<{
        createdAt?: string;
        lastChangeAt?: string;
        search?: string;
        title?: string;
    }>({
        filter: {},
        pageSize: PAGE_SIZE,
    });

    const [searchText, setSearchText] = useState<string | undefined>(undefined);
    const [titleText, setTitleText] = useState<string | undefined>(undefined);
    const [createdByValue, setCreatedByValue] = useState<string | undefined>(undefined);

    const debouncedSearch = useDebouncedValue(searchText)?.trim();
    const debouncedTitle = useDebouncedValue(titleText)?.trim();
    const debouncedCreatedBy = useDebouncedValue(createdByValue)?.trim();

    const columns = useMemo(() => ([
        // NOTE: we need to create link column.
        createElementColumn<NotesList, string, { url: string; title: string }>(
            'TITLE',
            'Title',
            ({ url, title }) => (
                <a
                    className={styles.urlAction}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {title}
                </a>
            ),
            (_key, item) => ({ url: item.url, title: item.title }),
        ),
        createStringColumn<NotesList, string>(
            'OWNER',
            'Author',
            (item) => item?.owner?.display_name,
            { sortable: true },
        ),
        createStringColumn<NotesList, string>(
            'PERMISSION',
            'Permission',
            (item) => item.permission,
            { sortable: true },
        ),
        createDateColumn<NotesList, string>(
            'CREATED_AT',
            'Created at',
            (item) => item.created_at,
            { sortable: true },
        ),
        createDateColumn<NotesList, string>(
            'LAST_CHANGE_AT',
            'Updated at',
            (item) => item.last_change_at,
            { sortable: true },
        ),
    ]), []);

    const ordering = orderingByFilterState as OrderByType;

    const query = useMemo(() => ({
        page,
        page_size: PAGE_SIZE,
        search: debouncedSearch,
        title: debouncedTitle,
        created_at__lte: filter.createdAt,
        last_change_at__lte: filter.lastChangeAt,
        created_by: debouncedCreatedBy,
        order_by: ordering,
        order_as_desc: orderingByDesc,
    }), [
        debouncedSearch,
        orderingByDesc,
        debouncedTitle,
        ordering,
        debouncedCreatedBy,
        page,
        filter.createdAt,
        filter.lastChangeAt,
    ]);

    const {
        response: notesResponse,
        pending: notesResponsePending,
    } = useRequest({
        url: '/notes',
        query,
        pathVariables: {},
    });

    const {
        response: usersResponse,
        pending: usersResponsePending,
    } = useRequest({
        url: '/users',
        preserveResponse: true,
    });

    return (
        <>
            <Navbar />
            <Page>
                <Container
                    heading="All Notes"
                    headingLevel={5}
                    showHeader
                    headingDescription={(
                        <div className={styles.filters}>
                            <TextInput
                                name="search"
                                label="Search"
                                onChange={setSearchText}
                                value={searchText}
                                icons={
                                    <IoSearchOutline />
                                }
                            />
                            <TextInput
                                name="title"
                                label="Title"
                                onChange={setTitleText}
                                value={titleText}
                                icons={
                                    <IoSearchOutline />
                                }
                            />
                            <SelectInput
                                name="createdBy"
                                label="Author"
                                placeholder="All Authors"
                                value={createdByValue}
                                onChange={setCreatedByValue}
                                keySelector={usersListKeySelector}
                                labelSelector={labelSelector}
                                options={usersResponse}
                            />
                            <DateInput
                                name="createdAt"
                                label="Created date"
                                value={filter.createdAt}
                                onChange={setFilterField}
                            />
                            <DateInput
                                name="lastChangeAt"
                                label="Modified date"
                                value={filter.lastChangeAt}
                                onChange={setFilterField}
                            />
                        </div>
                    )}
                    footerActions={(
                        <Pager
                            activePage={page}
                            itemsCount={notesResponse?.total ?? 0}
                            maxItemsPerPage={limit}
                            onActivePageChange={setPage}
                        />
                    )}
                >
                    <SortContext.Provider value={sortState}>
                        <Table
                            keySelector={keySelector}
                            filtered
                            pending={notesResponsePending || usersResponsePending}
                            columns={columns}
                            data={notesResponse?.results}
                        />
                    </SortContext.Provider>
                </Container>
            </Page>
        </>
    );
}

Component.displayName = 'Home';
