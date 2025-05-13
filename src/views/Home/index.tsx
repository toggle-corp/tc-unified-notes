import { useMemo } from 'react';
import {
    IoGridOutline,
    IoMenu,
    IoSearchOutline,
    IoSettings,
    IoTrash,
} from 'react-icons/io5';
import { useRequest } from '@togglecorp/toggle-request';
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

import styles from './styles.module.css';

type NotesList = {
    fullLink: string;
    id: string;
    createdAt: string;
    author: string;
    permission: string;
    updatedAt: string;
};

type NotesListTable = NonNullable<NotesList>;
const keySelector = (option: NotesListTable) => option.id;
const PAGE_SIZE = 10;

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const {
        filter,
        page,
        setPage,
        setFilterField,
    } = useFilterState<{
            title?: string;
            createdBy?: string;
            modifiedDate?: string;
            createdDate?: string;
            search?: string;
        }>({
            filter: {},
            pageSize: PAGE_SIZE,
        });

    const {
        response: notesResponse,
    } = useRequest({
        url: '/notes',
        pathVariables: {},
    });

    const columns = useMemo(() => ([
        createElementColumn<NotesListTable, string, { url: string }>(
            'fullLink',
            'URL',
            ({ url }) => (
                <a
                    className={styles.urlAction}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {url}
                </a>
            ),
            (_key, item) => ({ url: item.fullLink }),
            { columnClassName: styles.noteColumn },
        ),
        createDateColumn<NotesListTable, string>(
            'createdAt',
            'Created at',
            (item) => item.createdAt,
            {
                columnClassName: styles.noteColumn,
            },
        ),
        createStringColumn<NotesListTable, string>(
            'author',
            'Author',
            (item) => item.author,
            {
                columnClassName: styles.column,
            },
        ),
        createStringColumn<NotesListTable, string>(
            'permission',
            'Permission',
            (item) => item.permission,
            {
                columnClassName: styles.column,
            },
        ),
        createDateColumn<NotesListTable, string>(
            'updatedAt',
            'Updated at',
            (item) => item.updatedAt,
            {
                columnClassName: styles.column,
            },
        ),
        createElementColumn<NotesListTable, string, { id: number }>(
            'actions',
            'Actions',
            () => (
                <Button
                    name={undefined}
                    onClick={() => {}}
                    title="delete"
                    transparent
                >
                    <IoTrash />
                </Button>
            ),
            (_key, datum) => ({
                id: Number(datum.id),
            }),
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
                            <TextInput
                                placeholder="Search"
                                onChange={setFilterField}
                                value={filter.search}
                                name="search"
                                icons={<IoSearchOutline />}
                            />
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
                                    label="Title"
                                    placeholder="Title"
                                    onChange={setFilterField}
                                    value={filter.title}
                                    name="title"
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
                            infoHidden
                            itemsPerPageControlHidden
                            activePage={page}
                            itemsCount={2}
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
                        data={notesResponse}
                    />
                </Container>
            </Page>
        </>
    );
}

Component.displayName = 'Home';
