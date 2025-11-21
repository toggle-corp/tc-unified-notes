import { useMemo } from 'react';
import {
    IoGridOutline,
    IoMenu,
    IoSearchOutline,
    IoSettings,
} from 'react-icons/io5';
import {
    Button,
    createDateColumn,
    createStringColumn,
    DateInput,
    Pager,
    Table,
    TextInput,
} from '@togglecorp/toggle-ui';

import Container from '#components/Container';
import { createElementColumn } from '#components/CreateElementColumn';
import Navbar from '#components/Navbar';
import Page from '#components/Page';
import useFilterState from '#hooks/useFilterState';
import { useRequest } from '#utils/restRequest';
import { NotesList } from '#utils/types';

import styles from './styles.module.css';

type NotesListTable = NonNullable<NotesList>;
const keySelector = (option: NotesListTable) => option.id;
const PAGE_SIZE = 10;

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const {
        filter,
        page,
        setPage,
        setFilterField,
    } = useFilterState<{
        createdBy?: string;
        modifiedDate?: string;
        createdDate?: string;
        search?: string;
    }>({
        filter: {},
        pageSize: PAGE_SIZE,
    });

    const query = useMemo(() => ({
        page,
        page_size: PAGE_SIZE,
        search: filter.search,
    }), [filter.search, page]);

    const {
        response: notesResponse,
    } = useRequest({
        url: '/notes',
        query,
        pathVariables: {},
    });

    const columns = useMemo(() => ([
        createElementColumn<NotesList, string, { url: string; title: string }>(
            'title',
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
            { columnClassName: styles.noteColumn },
        ),
        createStringColumn<NotesList, string>(
            'author',
            'Author',
            (item) => item?.owner?.display_name,
            { columnClassName: styles.noteColumn },
        ),
        createStringColumn<NotesList, string>(
            'permission',
            'Permission',
            (item) => item.permission,
            { columnClassName: styles.noteColumn },
        ),
        createDateColumn<NotesList, string>(
            'createdAt',
            'Created at',
            (item) => item.created_at,
            { columnClassName: styles.noteColumn },
        ),
        createStringColumn<NotesList, string>(
            'updateAt',
            'Updated at',
            (item) => item.last_change_at,
            { columnClassName: styles.noteColumn },
        ),
    ]), []);

    return (
        <>
            <Navbar />
            <Page>
                <Container
                    showHeader
                    headingDescription={(
                        <div className={styles.actions}>
                            <Button
                                name="settings"
                                icons={<IoSettings />}
                                transparent
                            />
                        </div>
                    )}
                />
                <Container
                    heading="All Notes"
                    headingLevel={5}
                    showHeader
                    headingDescription={(
                        <div className={styles.filters}>
                            <div className={styles.filtersContainer}>
                                <TextInput
                                    placeholder="Search"
                                    onChange={setFilterField}
                                    value={filter.search}
                                    name="search"
                                    icons={
                                        <IoSearchOutline />
                                    }
                                />
                                <TextInput
                                    name="createdBy"
                                    label="Created by"
                                    value={filter.createdBy}
                                    onChange={setFilterField}
                                />
                                <DateInput
                                    name="createdDate"
                                    label="Created date"
                                    value={filter.createdDate}
                                    onChange={setFilterField}
                                />
                                <DateInput
                                    name="modifiedDate"
                                    label="Modified date"
                                    value={filter.modifiedDate}
                                    onChange={setFilterField}
                                />
                            </div>
                            <div className={styles.filterActions}>
                                <Button
                                    name="settings"
                                    icons={<IoMenu />}
                                    transparent
                                />
                                <Button
                                    name="settings"
                                    icons={<IoGridOutline />}
                                    transparent
                                />
                            </div>
                        </div>
                    )}
                    footerActions={(
                        <Pager
                            itemsPerPageControlHidden
                            activePage={page}
                            itemsCount={notesResponse?.results?.length || 0}
                            maxItemsPerPage={PAGE_SIZE}
                            onActivePageChange={setPage}
                        />
                    )}
                >
                    <Table
                        className={styles.table}
                        keySelector={keySelector}
                        columns={columns}
                        headerCellClassName={styles.headerCell}
                        headerRowClassName={styles.headerRow}
                        data={notesResponse?.results}
                    />
                </Container>
            </Page>
        </>
    );
}

Component.displayName = 'Home';
