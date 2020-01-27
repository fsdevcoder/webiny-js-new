import React from "react";
import { PbRenderSlateEditorPlugin } from "@webiny/app-page-builder/types";

export default (): PbRenderSlateEditorPlugin => {
    return {
        name: "pb-render-slate-editor-underline",
        type: "pb-render-slate-editor",
        slate: {
            renderMark(props, next) {
                if (props.mark.type === "underline") {
                    return <u {...props.attributes}>{props.children}</u>;
                }

                return next();
            }
        }
    };
};
