import React from "react";
import { addReducer } from "@webiny/app-page-builder/editor/redux";
import { DEACTIVATE_ELEMENT } from "@webiny/app-page-builder/editor/actions";
import Bar from "./ElementSettingsBar";
import { PbEditorBarPlugin } from "@webiny/app-page-builder/admin/types";

addReducer([DEACTIVATE_ELEMENT], "ui.plugins.element-settings", () => null);

export default {
    name: "pb-editor-element-settings-bar",
    type: "pb-editor-bar",
    shouldRender({ activeElement }) {
        return activeElement;
    },

    render() {
        return <Bar />;
    }
} as PbEditorBarPlugin;
