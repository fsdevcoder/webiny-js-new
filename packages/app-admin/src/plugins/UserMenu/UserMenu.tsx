import React from "react";
import { css } from "emotion";
import { renderPlugins, renderPlugin } from "@webiny/app/plugins";
import { Menu } from "@webiny/ui/Menu";
import { List } from "@webiny/ui/List";
import { TopAppBarActionItem } from "@webiny/ui/TopAppBar";

const menuDialog = css({
    "&.mdc-menu": {
        minWidth: 300
    }
});

const UserMenu = () => {
    return (
        <TopAppBarActionItem
            icon={
                <Menu
                    className={menuDialog}
                    anchor={"topEnd"}
                    handle={<menu-handle>{renderPlugin("user-menu-handle")}</menu-handle>}
                >
                    <List data-testid="logged-in-user-menu-list">
                        {renderPlugin("header-user-menu-user-info")}
                        {renderPlugins("header-user-menu")}
                    </List>
                </Menu>
            }
        />
    );
};

export default UserMenu;
