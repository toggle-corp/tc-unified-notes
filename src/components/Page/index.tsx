import {
    ElementRef,
    RefObject,
    useEffect,
} from 'react';
import {
    _cs,
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import PageContainer from '#components/PageContainer';
import PageHeader from '#components/PageHeader';

import styles from './styles.module.css';

interface Props {
    className?: string;
    title?: string;
    actions?: React.ReactNode;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    descriptionContainerClassName?: string;
    mainSectionContainerClassName?: string;
    info?: React.ReactNode;
    children?: React.ReactNode;
    mainSectionClassName?: string;
    infoContainerClassName?: string;
    withBackgroundColorInMainSection?: boolean;
    elementRef?: RefObject<ElementRef<'div'>>;
    blockingContent?: React.ReactNode;
    beforeHeaderContent?: React.ReactNode;
}

function Page(props: Props) {
    const {
        className,
        title,
        actions,
        heading,
        description,
        descriptionContainerClassName,
        info,
        children,
        mainSectionContainerClassName,
        mainSectionClassName,
        infoContainerClassName,
        withBackgroundColorInMainSection,
        elementRef,
        blockingContent,
        beforeHeaderContent,
    } = props;

    useEffect(() => {
        if (isDefined(title)) {
            document.title = title;
        }
    }, [title]);

    const showPageContainer = !!heading
        || !!description
        || !!info
        || !!actions;

    return (
        <div
            className={_cs(
                styles.page,
                className,
            )}
            ref={elementRef}
        >
            {beforeHeaderContent && beforeHeaderContent}
            {isNotDefined(blockingContent) && showPageContainer && (
                <PageHeader
                    className={_cs(
                        styles.pageHeader,
                        className,
                    )}
                    actions={actions}
                    heading={heading}
                    description={description}
                    descriptionContainerClassName={descriptionContainerClassName}
                    info={info}
                    infoContainerClassName={infoContainerClassName}
                />
            )}
            {isNotDefined(blockingContent) && (
                <PageContainer
                    contentAs="main"
                    className={_cs(
                        styles.mainSectionContainer,
                        mainSectionContainerClassName,
                        withBackgroundColorInMainSection && styles.withBackgroundColor,
                    )}
                    contentClassName={_cs(
                        styles.mainSection,
                        mainSectionClassName,
                    )}
                >
                    { children }
                </PageContainer>
            )}
        </div>
    );
}

export default Page;
