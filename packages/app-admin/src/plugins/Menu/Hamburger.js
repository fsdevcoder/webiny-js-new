import React, { useCallback } from "react";
import ReactDOM from "react-dom";
import { get, set } from "dot-prop-immutable";
import { useUi } from "@webiny/app/hooks/useUi";
import { IconButton } from "@webiny/ui/Button";
import { ReactComponent as MenuIcon } from "@webiny/app-admin/assets/icons/baseline-menu-24px.svg";
import Navigation from "./Navigation";

let el = null;
const getElement = () => {
    if (!el) {
        el = document.createElement("div");
        el.id = "navigation-drawer";
        document.body.appendChild(el);
    }

    return el;
};

const Hamburger = () => {
    const ui = useUi();

    const toggleMenu = useCallback(() => {
        ui.setState(ui => set(ui, "appsMenu.show", !(get(ui, "appsMenu.show") || false)));
    }, [ui]);

    return (
        <React.Fragment>
            <IconButton icon={<MenuIcon style={{ color: "white" }} />} onClick={toggleMenu} />
            {ReactDOM.createPortal(<Navigation />, getElement())}
        </React.Fragment>
    );
};

export default Hamburger;
