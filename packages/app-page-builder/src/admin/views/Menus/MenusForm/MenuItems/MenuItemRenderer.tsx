import * as React from "react";
import { isDescendant } from "react-sortable-tree";
import classnames from "classnames";
import { getPlugins } from "@webiny/plugins";
import { IconButton } from "@webiny/ui/Button";
import { Typography } from "@webiny/ui/Typography";
import { Icon } from "@webiny/ui/Icon";
import "react-sortable-tree/style.css";
import { rowHandle, fieldContainer, Row, RowContainer } from "./Styled";

import { ReactComponent as EditIcon } from "./icons/round-edit-24px.svg";
import { ReactComponent as DeleteIcon } from "./icons/round-delete-24px.svg";
import { ReactComponent as HandleIcon } from "./icons/round-drag_indicator-24px.svg";
import { PbMenuItemPlugin } from "@webiny/app-page-builder/types";

class NodeRendererDefault extends React.Component<any> {
    static defaultProps = {
        canDrag: false,
        toggleChildrenVisibility: null,
        buttons: [],
        className: "",
        style: {},
        parentNode: null,
        draggedNode: null,
        canDrop: false,
        title: null,
        subtitle: null
    };

    render() {
        const {
            scaffoldBlockPxWidth,
            toggleChildrenVisibility,
            connectDragPreview,
            connectDragSource,
            isDragging,
            canDrop,
            canDrag,
            node,
            title,
            draggedNode,
            path,
            treeIndex,
            editItem,
            deleteItem,
            className,
            style,
            didDrop
        } = this.props;

        const nodeTitle = title || node.title;

        const plugins = getPlugins("pb-menu-item") as PbMenuItemPlugin[];
        const plugin = plugins.find(pl => pl.menuItem.type === node.type);
        if (!plugin) {
            return null;
        }

        const handle = connectDragSource(
            <div className={rowHandle}>
                <Icon icon={<HandleIcon />} />
            </div>,
            {
                dropEffect: "copy"
            }
        );

        const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
        const isLandingPadActive = !didDrop && isDragging;

        const buttonStyle = { left: -0.5 * scaffoldBlockPxWidth };

        return (
            <div style={{ height: "100%" }} data-testid={`pb-menu-item-render-${nodeTitle}`}>
                {toggleChildrenVisibility &&
                    node.children &&
                    (node.children.length > 0 || typeof node.children === "function") && (
                        <div>
                            <button
                                type="button"
                                aria-label={node.expanded ? "Collapse" : "Expand"}
                                className={classnames(
                                    node.expanded ? "rst__collapseButton" : "rst__expandButton"
                                )}
                                style={buttonStyle}
                                onClick={() =>
                                    toggleChildrenVisibility({
                                        node,
                                        path,
                                        treeIndex
                                    })
                                }
                            />

                            {node.expanded && !isDragging && (
                                <div
                                    style={{ width: scaffoldBlockPxWidth }}
                                    className={classnames("rst__lineChildren")}
                                />
                            )}
                        </div>
                    )}

                <RowContainer className={"rst__rowWrapper"}>
                    {/* Set the row preview to be used during drag and drop */}
                    {connectDragPreview(
                        <div>
                            {handle}
                            <Row
                                className={classnames(
                                    "rst__row",
                                    isLandingPadActive && "rst__rowLandingPad",
                                    isLandingPadActive && !canDrop && "rst__rowCancelPad",
                                    className
                                )}
                                style={{
                                    opacity: isDraggedDescendant ? 0.5 : 1,
                                    ...style
                                }}
                            >
                                <div
                                    className={classnames(
                                        fieldContainer,
                                        !canDrag && "rst__rowContentsDragDisabled"
                                    )}
                                >
                                    <div className={classnames("rst__rowLabel")}>
                                        <span
                                            className={classnames(
                                                "rst__rowTitle",
                                                node.subtitle && "rst__rowTitleWithSubtitle"
                                            )}
                                        >
                                            <Typography use={"overline"}>{nodeTitle}</Typography>
                                        </span>
                                    </div>

                                    <div className="rst__rowToolbar">
                                        <IconButton
                                            data-testid={"pb-edit-icon-button"}
                                            icon={<EditIcon />}
                                            onClick={() => editItem(node)}
                                        />
                                        <IconButton
                                            data-testid={"pb-delete-icon-button"}
                                            icon={<DeleteIcon />}
                                            onClick={() => deleteItem(node)}
                                        />
                                    </div>
                                </div>
                            </Row>
                        </div>
                    )}
                </RowContainer>
            </div>
        );
    }
}

export default NodeRendererDefault;
