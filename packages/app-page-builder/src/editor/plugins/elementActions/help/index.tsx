import React from "react";
import { ReactComponent as HelpIcon } from "@webiny/app-page-builder/editor/assets/icons/help_outline.svg";
import { PbEditorPageElementActionPlugin } from "@webiny/app-page-builder/admin/types";

export default {
    name: "pb-editor-element-action-help",
    type: "pb-editor-page-element-action",
    render({ plugin }) {
        return plugin.help ? <HelpIcon onClick={() => window.open(plugin.help, "_blank")} /> : null;
    }
} as PbEditorPageElementActionPlugin;
