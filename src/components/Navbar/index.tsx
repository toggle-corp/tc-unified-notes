import { IoChevronDown } from 'react-icons/io5';
import { Button } from '@ifrc-go/ui';
import { _cs } from '@togglecorp/fujs';

import Heading from '#components/Heading';
import PageContainer from '#components/PageContainer';

import styles from './styles.module.css';

interface Props {
    className?: string;
}

function Navbar(props: Props) {
    const { className } = props;

    return (
        <nav className={_cs(styles.navbar, className)}>
            <PageContainer
                className={styles.top}
                contentClassName={styles.topContent}
            >
                <Heading level={5}>
                    Unified Notes
                </Heading>
                <Button
                    name={undefined}
                    icons={<IoChevronDown />}
                />
            </PageContainer>

        </nav>
    );
}

export default Navbar;
