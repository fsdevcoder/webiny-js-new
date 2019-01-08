// @flow
import { get } from "lodash";
import type { CmsRenderElementStylePluginType } from "webiny-app-cms/types";

const vertical = {
    start: "flex-start",
    center: "center",
    end: "flex-end"
};

export default ([
    {
        name: "cms-render-element-style-horizontal-align",
        type: "cms-render-element-style",
        renderStyle({ element, style }: Object) {
            const { horizontalAlign } = get(element, "data.settings", {});
            if (!horizontalAlign) {
                return style;
            }
            return { ...style, textAlign: horizontalAlign };
        }
    },
    {
        name: "cms-render-element-style-horizontal-align-flex",
        type: "cms-render-element-style",
        renderStyle({ element, style }: Object) {
            const { horizontalAlignFlex } = get(element, "data.settings", {});
            if (!horizontalAlignFlex) {
                return style;
            }
            return { ...style, alignItems: horizontalAlignFlex };
        }
    },
    {
        name: "cms-render-element-style-vertical-align",
        type: "cms-render-element-style",
        renderStyle({ element, style }: Object) {
            const { verticalAlign } = get(element, "data.settings", {});
            if (!verticalAlign) {
                return style;
            }
            return { ...style, justifyContent: vertical[verticalAlign] };
        }
    }
]: Array<CmsRenderElementStylePluginType>);
