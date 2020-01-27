import * as React from "react";
import { Editor } from "slate-react";
import { ReactComponent as OrderedListIcon } from "@webiny/app-page-builder/editor/assets/icons/format_list_numbered.svg";
import { ReactComponent as UnorderedListIcon } from "@webiny/app-page-builder/editor/assets/icons/format_list_bulleted.svg";
import {
    PbEditorSlateEditorPlugin,
    PbEditorSlateMenuItemPlugin
} from "@webiny/app-page-builder/admin/types";

const hasBlock = (value, type) => {
    return value.blocks.some(node => node.type === type);
};

const onClickBlock = (type, onChange, editor) => {
    editor.change(change => {
        const { value } = change;
        const { document } = value;

        // Handle the extra wrapping required for list buttons.
        const isList = hasBlock(editor.value, "list-item");
        const isType = value.blocks.some(block => {
            return !!document.getClosest(block.key, parent => parent.type === type);
        });

        if (isList && isType) {
            change
                .setBlocks("paragraph")
                .unwrapBlock("unordered-list")
                .unwrapBlock("ordered-list");
        } else if (isList) {
            change
                .unwrapBlock(type === "unordered-list" ? "ordered-list" : "unordered-list")
                .wrapBlock(type);
        } else {
            change.setBlocks("list-item").wrapBlock(type);
        }

        onChange(change);
    });
};

export default () => {
    return {
        menu: [
            {
                name: "pb-editor-slate-menu-item-ordered-list",
                type: "pb-editor-slate-menu-item",
                render({ MenuButton, editor, onChange }) {
                    const isActive = hasBlock(editor.value, "ordered-list");

                    return (
                        // eslint-disable-next-line react/jsx-no-bind
                        <MenuButton
                            onClick={() => onClickBlock("ordered-list", onChange, editor)}
                            active={isActive}
                        >
                            <OrderedListIcon />
                        </MenuButton>
                    );
                }
            } as PbEditorSlateMenuItemPlugin,
            {
                name: "pb-editor-slate-menu-item-unordered-list",
                type: "pb-editor-slate-menu-item",
                render({ MenuButton, editor, onChange }) {
                    const isActive = hasBlock(editor.value, "unordered-list");

                    return (
                        // eslint-disable-next-line react/jsx-no-bind
                        <MenuButton
                            onClick={() => onClickBlock("unordered-list", onChange, editor)}
                            active={isActive}
                        >
                            <UnorderedListIcon />
                        </MenuButton>
                    );
                }
            } as PbEditorSlateMenuItemPlugin
        ],
        editor: [
            {
                name: "pb-editor-slate-editor-lists",
                type: "pb-editor-slate-editor",
                slate: {
                    renderNode(props, next) {
                        const { attributes, children, node } = props;

                        // @ts-ignore
                        switch (node.type) {
                            case "unordered-list":
                                return (
                                    <ul
                                        className={"webiny-pb-typography-unordered-list"}
                                        {...attributes}
                                    >
                                        {children}
                                    </ul>
                                );
                            case "list-item":
                                return <li {...attributes}>{children}</li>;
                            case "ordered-list":
                                return (
                                    <ol
                                        className={"webiny-pb-typography-ordered-list"}
                                        {...attributes}
                                    >
                                        {children}
                                    </ol>
                                );
                            default:
                                return next();
                        }
                    }
                }
            } as PbEditorSlateEditorPlugin
        ]
    };
};
