//@flow
import React from "react";
import { addReducer, dispatch } from "webiny-app/redux";
import { ELEMENT_DROPPED, togglePlugin } from "webiny-app-cms/editor/actions";
import { ReactComponent as AddIcon } from "webiny-app-cms/editor/assets/icons/add_circle_outline.svg";
import AddElement from "./AddElement";
import Action from "../Action";

addReducer([ELEMENT_DROPPED], "editor.ui.activeElement", () => null);

export default {
    name: "cms-toolbar-add-element",
    type: "cms-toolbar-top",
    renderAction({ active }: { active: Boolean }) {
        return (
            <Action
                tooltip={"Add Element"}
                active={active}
                onClick={() => dispatch(togglePlugin({ name: this.name }))}
                icon={<AddIcon />}
            />
        );
    },
    renderDrawer({ withDrawer }: { withDrawer: Function }) {
        return withDrawer(<AddElement />);
    }
};
