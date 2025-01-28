import styles from './styles.module.css';

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    return (
        <h1 className={styles.card}>
            TC Unified Notes
        </h1>
    );
}

Component.displayName = 'Home';
