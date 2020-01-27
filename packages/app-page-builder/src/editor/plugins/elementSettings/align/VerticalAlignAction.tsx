import * as React from "react";
import { connect } from "@webiny/app-page-builder/editor/redux";
import { getPlugins } from "@webiny/plugins";
import { set } from "dot-prop-immutable";
import { updateElement } from "@webiny/app-page-builder/editor/actions";
import { getActiveElement } from "@webiny/app-page-builder/editor/selectors";
import { get } from "dot-prop-immutable";
import { ReactComponent as AlignCenterIcon } from "./icons/round-border_horizontal-24px.svg";
import { ReactComponent as AlignTopIcon } from "./icons/round-border_top-24px.svg";
import { ReactComponent as AlignBottomIcon } from "./icons/round-border_bottom-24px.svg";
import { PbEditorPageElementPlugin } from "@webiny/app-page-builder/admin/types";

// Icons map for dynamic render
const icons = {
    start: <AlignTopIcon />,
    center: <AlignCenterIcon />,
    end: <AlignBottomIcon />
};

const VerticalAlignAction = ({ element, updateElement, children }) => {
    const align = get(element, "data.settings.verticalAlign") || "start";
    const plugin = getPlugins<PbEditorPageElementPlugin>("pb-editor-page-element").find(
        pl => pl.elementType === element.type
    );

    const alignElement = React.useCallback(() => {
        const alignments = Object.keys(icons);

        const nextAlign = alignments[alignments.indexOf(align) + 1] || "start";

        updateElement({
            element: set(element, "data.settings.verticalAlign", nextAlign)
        });
    }, [align]);

    if (!plugin) {
        return null;
    }

    return React.cloneElement(children, { onClick: alignElement, icon: icons[align] });
};

export default connect<any, any, any>(
    state => ({ element: getActiveElement(state) }),
    { updateElement }
)(VerticalAlignAction);
