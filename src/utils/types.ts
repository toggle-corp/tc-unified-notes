export type NotesList = {
    id: string;
    title: string;
    url: string;
    permission: string;
    view_count: number;
    content: string;
    created_at: string | null;
    last_change_at: string | null
    owner: {
        id: string;
        display_name: string | null;
        display_image: string | null;
    };
    last_changed_by: {
        id: string;
        display_name: string;
        display_image: string | null;
    };
};
