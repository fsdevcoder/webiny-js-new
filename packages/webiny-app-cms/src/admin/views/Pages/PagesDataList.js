// @flow
import * as React from "react";
import TimeAgo from "timeago-react";
import { withRouter } from "webiny-app/components";
import { i18n } from "webiny-app/i18n";
import { css } from "emotion";
import { Typography } from "webiny-ui/Typography";
import {
    DataList,
    List,
    ListItem,
    ListItemText,
    ListItemTextSecondary,
    ListTextOverline,
    ListItemMeta
} from "webiny-ui/List";

const t = i18n.namespace("Cms.PagesDataList");

const rightAlign = css({
    alignItems: "flex-end !important"
});

const PagesDataList = props => {
    const { dataList, router } = props;

    return (
        <DataList
            {...dataList}
            title={t`CMS Pages`}
            sorters={[
                {
                    label: "Newest to oldest",
                    sorters: { createdOn: -1 }
                },
                {
                    label: "Oldest to newest",
                    sorters: { createdOn: 1 }
                },
                {
                    label: "Title A-Z",
                    sorters: { title: 1 }
                },
                {
                    label: "Title Z-A",
                    sorters: { title: -1 }
                }
            ]}
        >
            {({ data = [] }) => (
                <List>
                    {data.map(page => (
                        <ListItem key={page.id}>
                            <ListItemText
                                onClick={() =>
                                    router.goToRoute({
                                        params: { id: page.id },
                                        merge: true
                                    })
                                }
                            >
                                {page.title}
                                <ListTextOverline>{page.category.name}</ListTextOverline>
                                {page.createdBy && (
                                    <ListItemTextSecondary>
                                        Created by: {page.createdBy.firstName}. Last modified:{" "}
                                        <TimeAgo datetime={page.savedOn} />.
                                    </ListItemTextSecondary>
                                )}
                            </ListItemText>
                            <ListItemMeta className={rightAlign}>
                                <Typography use={"subtitle2"}>
                                    {page.locked ? "Published" : "Draft"} (v{page.version})
                                </Typography>
                            </ListItemMeta>
                        </ListItem>
                    ))}
                </List>
            )}
        </DataList>
    );
};

export default withRouter()(PagesDataList);
