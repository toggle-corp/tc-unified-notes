import {
    useMemo,
    useState,
} from 'react';
import {
    IoGridOutline,
    IoMenu,
    IoSearchOutline,
    IoSettings,
    IoTrash,
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

import styles from './styles.module.css';

type NotesListTable = {
    url: string;
    id: string
};
const keySelector = (option: NotesListTable) => option.id;
const PAGE_SIZE = 10;

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const [page, setPage] = useState<number>(1);

    const columns = useMemo(() => ([
        createElementColumn<NotesListTable, string, {url: string}>(
            'url',
            'URL',
            ({ url }) => (
                <a
                    className={styles.actions}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {url}
                </a>
            ),
            (_key, item) => ({ url: item.url }),
        ),
        createDateColumn<NotesListTable, string>(
            'createdAt',
            'Created at',
            (item) => (item.url),
            { sortable: true },
        ),
        createStringColumn<NotesListTable, string>(
            'author',
            'Author',
            (item) => (item.url),
            { sortable: true },
        ),
        createStringColumn<NotesListTable, string>(
            'permission',
            'Permission',
            (item) => (item.url),
            { sortable: true },
        ),
        createDateColumn<NotesListTable, string>(
            'updatedAt',
            'Updated at',
            (item) => (item.url),
            { sortable: true },
        ),
        createElementColumn<NotesListTable, string, {id:number}>(
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
                                onChange={() => {}}
                                value={undefined}
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
                >
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
                                        onChange={() => {}}
                                        value={undefined}
                                        name="title"
                                    />
                                    <TextInput
                                        name="createdBy"
                                        label="Created by"
                                        value={undefined}
                                        onChange={() => {}}
                                    />
                                    <DateInput
                                        name="createdDate"
                                        label="Created date"
                                        value={undefined}
                                    />
                                    <DateInput
                                        name="modifiedDate"
                                        label="Modified date"
                                        value={undefined}
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
                                itemsCount={5}
                                maxItemsPerPage={PAGE_SIZE}
                                onActivePageChange={setPage}
                            />
                        )}
                    />
                    <Table
                        keySelector={keySelector}
                        columns={columns}
                        headerCellClassName={styles.headerCell}
                        headerRowClassName={styles.headerRow}
                        data={undefined}
                        className={styles.table}
                    />
                </Container>
            </Page>
        </>
    );
}

Component.displayName = 'Home';
