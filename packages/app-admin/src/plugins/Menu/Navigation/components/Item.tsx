import * as React from "react";
import { List, ListItem } from "@webiny/ui/List";
import { Link } from "@webiny/react-router";
import useNavigation from "./useNavigation";
import { css } from "emotion";

const linkStyle = css({
    color: "var(--mdc-theme-text-primary-on-background)",
    textDecoration: "none",
    display: "block",
    width: "100%",
    outline: "none",
    paddingLeft: 65,
    "&:hover": {
        textDecoration: "none"
    }
});

const submenuItems = css({
    ".mdc-drawer &.mdc-list-item": {
        paddingLeft: 0
    }
});

const submenuList = css({
    "&.mdc-list": {
        padding: 0
    }
});

type Props = { label: React.ReactNode; path: string };

export default function Item(props: Props) {
    const { path, label } = props;
    const { hideMenu } = useNavigation();
    return (
        <React.Fragment>
            <List className={submenuList}>
                <ListItem className={submenuItems}>
                    <Link className={linkStyle} to={path} onClick={hideMenu}>
                        {label}
                    </Link>
                </ListItem>
            </List>
        </React.Fragment>
    );
}
