// @flow
import React from "react";
import { ReactComponent as OrderedListIcon } from "webiny-app-cms/editor/assets/icons/format_list_numbered.svg";
import { ReactComponent as UnorderedListIcon } from "webiny-app-cms/editor/assets/icons/format_list_bulleted.svg";

const hasBlock = (value, type) => {
    return value.blocks.some(node => node.type === type);
};

const onClickBlock = (type, editor) => {
    const { value, onChange } = editor;
    const change = value.change();
    const { document } = value;

    // Handle the extra wrapping required for list buttons.
    const isList = hasBlock(value, "list-item");
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
};

export default () => {
    return {
        menu: [
            {
                name: "ordered-list-menu-item",
                type: "cms-slate-menu-item",
                render({ MenuButton, editor }: Object) {
                    const isActive = hasBlock(editor.value, "ordered-list");

                    return (
                        // eslint-disable-next-line react/jsx-no-bind
                        <MenuButton
                            onClick={() => onClickBlock("ordered-list", editor)}
                            active={isActive}
                        >
                            <OrderedListIcon />
                        </MenuButton>
                    );
                }
            },
            {
                name: "unordered-list-menu-item",
                type: "cms-slate-menu-item",
                render({ MenuButton, editor }: Object) {
                    const isActive = hasBlock(editor.value, "unordered-list");

                    return (
                        // eslint-disable-next-line react/jsx-no-bind
                        <MenuButton
                            onClick={() => onClickBlock("unordered-list", editor)}
                            active={isActive}
                        >
                            <UnorderedListIcon />
                        </MenuButton>
                    );
                }
            }
        ],
        editor: [
            {
                name: "cms-slate-editor-lists",
                type: "cms-slate-editor",
                slate: {
                    renderNode(props: Object) {
                        const { attributes, children, node } = props;

                        switch (node.type) {
                            case "unordered-list":
                                return (
                                    <ul
                                        className={"webiny-cms-typography-unordered-list"}
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
                                        className={"webiny-cms-typography-ordered-list"}
                                        {...attributes}
                                    >
                                        {children}
                                    </ol>
                                );
                            default:
                                break;
                        }
                    }
                }
            }
        ]
    };
};
