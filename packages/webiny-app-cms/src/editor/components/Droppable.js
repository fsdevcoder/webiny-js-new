// @flow
import React from "react";
import { DropTarget } from "react-dnd";
import { compose, pure } from "recompose";
import { connect } from "webiny-app-cms/editor/redux";
import { getIsDragging } from "webiny-app-cms/editor/selectors";

const defaultVisibility = ({ type, isDragging, item }) => {
    const target = (item && item.target) || [];

    if (!item || !target.includes(type)) {
        return false;
    }

    return isDragging;
};

const Droppable = pure(
    ({
        item,
        type,
        children,
        connectDropTarget,
        isDragging,
        isOver,
        isDroppable = () => true,
        isVisible
    }) => {
        if (!isVisible) {
            isVisible = defaultVisibility;
        }

        if (!isVisible({ type, item, isDragging })) {
            return null;
        }

        return connectDropTarget(
            <div data-type="droppable">
                {children({ isDragging, isOver, isDroppable: isDroppable(item) })}
            </div>
        );
    }
);

// Dragging
const spec = {
    drop(props, monitor) {
        props.onDrop(monitor.getItem());
    }
};

const props = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver() && monitor.isOver({ shallow: true }),
    item: monitor.getItem()
});

export default compose(
    connect(state => ({ isDragging: getIsDragging(state) })),
    DropTarget("element", spec, props)
)(Droppable);
