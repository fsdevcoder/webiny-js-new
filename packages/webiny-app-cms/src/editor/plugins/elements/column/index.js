//@flow
import React from "react";
import styled from "react-emotion";
import { set } from "dot-prop-immutable";
import Column from "./Column";
import { createElement, createColumn, cloneElement } from "webiny-app-cms/editor/utils";
import { updateElement, deleteElement } from "webiny-app-cms/editor/actions";
import { getParentElement } from "webiny-app-cms/editor/selectors";
import { ReactComponent as ColumnIcon } from "webiny-app-cms/editor/assets/icons/column-icon.svg";
import type { ElementPluginType } from "webiny-app-cms/types";

export default (): ElementPluginType => {
    const PreviewBox = styled("div")({
        textAlign: "center",
        height: 50,
        svg: {
            height: 50,
            width: 50
        }
    });

    return {
        name: "cms-element-column",
        type: "cms-element",
        element: {
            title: "Column",
            group: "cms-element-group-layout",
            settings: [
                "cms-element-settings-background",
                "",
                "cms-element-settings-border",
                "cms-element-settings-shadow",
                "",
                "cms-element-settings-padding",
                "cms-element-settings-margin",
                "cms-element-settings-align",
                "",
                "cms-element-settings-clone",
                "cms-element-settings-delete",
                "",
                "cms-element-settings-advanced"
            ]
        },
        target: ["cms-element-row"],
        create(options = {}) {
            return {
                type: "cms-element-column",
                settings: {
                    style: {
                        margin: "20px"
                    }
                },
                ...options
            };
        },
        render(props) {
            return <Column {...props} />;
        },
        preview() {
            return (
                <PreviewBox>
                    <ColumnIcon />
                </PreviewBox>
            );
        },
        canDelete({ parent }) {
            return parent.elements.length > 1;
        },
        onReceived({ store, source, target, position = null }) {
            const droppedOnCenter = position === null;

            let row = getParentElement(store.getState(), target.path);
            const targetIndex = row.elements.findIndex(el => el.id === target.id);

            // Dropped a column onto a center drop zone
            if (source.type === "column" && droppedOnCenter) {
                // Split target column in half
                row.elements[targetIndex].data.width /= 2;
                // Create a new column with half of the original target width
                let newColumn = source.path ? cloneElement(source) : createColumn();
                newColumn = set(newColumn, "data.width", row.elements[targetIndex].data.width);

                row = addElementToParent(newColumn, row, targetIndex + 1);
                store.dispatch(updateElement({ element: row }));
                if (source.path) {
                    store.dispatch(deleteElement({ element: source }));
                }
                return;
            }

            let element = source.path
                ? cloneElement(source)
                : createElement(source.type, {}, target);

            target = addElementToParent(element, target, position);
            store.dispatch(updateElement({ element: target }));

            if (source.path) {
                store.dispatch(deleteElement({ element: source }));
            }
        }
    };
};

const addElementToParent = (element, parent, position) => {
    if (position === null) {
        return set(parent, "elements", [...parent.elements, element]);
    }

    return set(parent, "elements", [
        ...parent.elements.slice(0, position),
        element,
        ...parent.elements.slice(position)
    ]);
};
