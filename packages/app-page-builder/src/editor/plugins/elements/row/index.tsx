import React from "react";
import styled from "@emotion/styled";
import { set } from "dot-prop-immutable";
import { dispatch } from "@webiny/app-page-builder/editor/redux";
import {
    createElement,
    createColumn,
    cloneElement,
    addElementToParent
} from "@webiny/app-page-builder/editor/utils";
import {
    updateElement,
    deleteElement,
    elementCreated
} from "@webiny/app-page-builder/editor/actions";
import "./actions";
import Row from "./Row";
import { ReactComponent as RowIcon } from "@webiny/app-page-builder/editor/assets/icons/row-icon.svg";
import {PbElement, PbEditorPageElementPlugin} from "@webiny/app-page-builder/admin/types";

export default (): PbEditorPageElementPlugin => {
    const PreviewBox = styled("div")({
        textAlign: "center",
        height: 50,
        svg: {
            height: 50,
            width: 50
        }
    });

    return {
        name: "pb-editor-page-element-row",
        type: "pb-editor-page-element",
        elementType: "row",
        toolbar: {
            title: "Row",
            group: "pb-editor-element-group-layout",
            // Render element preview
            preview() {
                return (
                    <PreviewBox>
                        <RowIcon />
                    </PreviewBox>
                );
            }
        },
        settings: [
            "pb-editor-page-element-settings-background",
            "pb-editor-page-element-settings-animation",
            "",
            "pb-editor-page-element-settings-border",
            "pb-editor-page-element-settings-shadow",
            "",
            "pb-editor-page-element-settings-padding",
            "pb-editor-page-element-settings-margin",
            "pb-editor-page-element-settings-width",
            "",
            "pb-editor-page-element-settings-clone",
            "pb-editor-page-element-settings-delete",
            ""
        ],
        // Target drop zones that will accept this type
        target: ["block", "column"],
        // This function is called when `createElement` is called for this plugin
        create(options = {}) {
            const row = {
                type: "row",
                elements: [],
                data: {
                    settings: {
                        margin: {
                            desktop: { all: 0 },
                            mobile: { all: 0 }
                        },
                        padding: {
                            desktop: { all: 0 },
                            mobile: { all: 0 }
                        }
                    }
                },
                ...options
            };

            // A row MUST contain at least 1 column
            if (!row.elements.length) {
                row.elements.push(createColumn({ data: { width: 100 } }));
            }

            return row;
        },

        // Render element in editor
        render(props) {
            return <Row {...props} />;
        },

        // This callback is executed when another element is dropped on the drop zones with type "row"
        onReceived({ source, target, position = null }) {
            let dispatchNew = false;
            let element;
            if (source.path) {
                element = cloneElement(source as PbElement);
            } else {
                dispatchNew = true;
                element = createElement(source.type, {}, target);
            }

            let column;
            if (element.type !== "column") {
                column = createColumn({ elements: [element] });
            }

            // Add new child element
            let row = addElementToParent(column || element, target, position);

            // Recalculate column widths
            row = distributeColumnWidths(row);

            // Dispatch update action
            dispatch(updateElement({ element: row }));

            if (source.path) {
                dispatch(deleteElement({ element: source }));
            }

            if (dispatchNew) {
                dispatch(elementCreated({ element, source }));
            }
        },

        onChildDeleted({ element }) {
            dispatch(updateElement({ element: distributeColumnWidths(element) }));
        }
    };
};

const distributeColumnWidths = row => {
    const width = Math.round((100 / row.elements.length) * 100) / 100;
    const columns = row.elements.map(el => {
        return set(el, "data.width", width);
    });
    return set(row, "elements", columns);
};
