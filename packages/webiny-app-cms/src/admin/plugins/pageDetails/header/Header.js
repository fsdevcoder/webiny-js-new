// @flow
import React from "react";
import { css } from "emotion";
import { renderPlugins } from "webiny-app/plugins";
import { type WithPageDetailsProps } from "webiny-app-cms/admin/components";
import { Typography } from "webiny-ui/Typography";
import { Grid, Cell } from "webiny-ui/Grid";

const headerTitle = css({
    "&.mdc-layout-grid": {
        borderBottom: "1px solid var(--mdc-theme-on-background)",
        color: "var(--mdc-theme-text-primary-on-background)",
        background: "var(--mdc-theme-surface)",
        paddingTop: 10,
        paddingBottom: 9,
        ".mdc-layout-grid__inner": {
            alignItems: "center"
        }
    }
});

const pageTitle = css({
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
});

const headerActions = css({
    justifyContent: "flex-end",
    marginRight: "-15px",
    display: "flex",
    alignItems: "center"
});

type Props = WithPageDetailsProps;

const Header = (props: Props) => {
    const {
        pageDetails,
        pageDetails: { page },
        refreshPages
    } = props;
    return (
        <React.Fragment>
            <Grid className={headerTitle}>
                <Cell span={8} className={pageTitle}>
                    <Typography use="headline5">{page.title}</Typography>
                </Cell>
                <Cell span={4} className={headerActions}>
                    {renderPlugins("cms-page-details-header-left", { pageDetails, refreshPages })}
                    {renderPlugins("cms-page-details-header-right", { pageDetails, refreshPages })}
                </Cell>
            </Grid>
        </React.Fragment>
    );
};

export default Header;
