import React from "react";
import { ListItem, ListItemGraphic, ListItemMeta } from "@webiny/ui/List";
import { Switch } from "@webiny/ui/Switch";
import { Icon } from "@webiny/ui/Icon";
import { ReactComponent as DarkModeIcon } from "@webiny/app-admin/assets/icons/round-invert_colors-24px.svg";
import { useTheme } from "@webiny/app-admin/hooks/useTheme";
import { css } from "emotion";

const darkModeSwitch = css({
    margin: "5px 0 0 5px"
});

const DarkMode = () => {
    const { toggleDarkMode, theme } = useTheme();

    return (
        <ListItem ripple={false} onClick={toggleDarkMode}>
            <ListItemGraphic>
                <Icon icon={<DarkModeIcon />} />
            </ListItemGraphic>
            Dark mode:
            <ListItemMeta>
                <Switch className={darkModeSwitch} value={theme.dark} onChange={() => {}} />
            </ListItemMeta>
        </ListItem>
    );
};

export default DarkMode;
