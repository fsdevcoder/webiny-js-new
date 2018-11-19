import * as React from "react";
import {
    Card,
    CardPrimaryAction,
    CardMedia,
    CardAction,
    CardActions,
    CardActionButtons
} from "@rmwc/card";
import { css } from "emotion";
import { Typography } from "@rmwc/typography";

const PageItem = ({ data, className }) => {
    return (
        <Card className={className} style={{ width: "21rem", backgroundColor: "transparent" }}>
            <CardPrimaryAction>
                <div style={{ padding: "0 1rem 1rem 1rem" }}>
                    <Typography use="headline6" tag="h2">
                        {data.title}
                    </Typography>
                    <Typography
                        use="subtitle2"
                        tag="h4"
                        theme="text-primary-on-background"
                        style={{ marginTop: "-1rem" }}
                    >
                        by {data.createdBy.firstName} {data.createdBy.lastName[0]}.
                    </Typography>
                    <Typography use="body1" tag="div" theme="text-primary-on-background">
                        Page ID: {data.id} - Snippet text (TODO)
                    </Typography>
                </div>
            </CardPrimaryAction>
            <CardActions>
                <CardActionButtons>
                    <CardAction>Read ({data.slug})</CardAction>
                </CardActionButtons>
            </CardActions>
        </Card>
    );
};

const pageList = css({
    display: "flex",
    justifyContent: "center"
});

const pageItem = css({
    padding: 20,
    margin: 10,
    color: "var(--mdc-theme-primary)"
});

const PageList = ({ data }) => {
    return (
        <div className={pageList}>
            {data.map(page => (
                <PageItem
                    className={pageItem}
                    key={page.id}
                    data={page}
                />
            ))}
        </div>
    );
};

export default PageList;
