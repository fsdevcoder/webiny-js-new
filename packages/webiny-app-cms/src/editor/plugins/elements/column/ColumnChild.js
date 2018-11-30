// @flow
import * as React from "react";
import { compose, withHandlers } from "recompose";
import { connect } from "react-redux";
import isEqual from "lodash/isEqual";
import DropZone from "webiny-app-cms/editor/components/DropZone";
import Element from "webiny-app-cms/editor/components/Element";
import { dropElement } from "webiny-app-cms/editor/actions";
import { getElement } from "webiny-app-cms/editor/selectors";

type Props = {
    element: Object,
    index: number,
    last: boolean,
    target: Object,
    dropElementAbove: Function,
    dropElementBelow: Function
};

const ColumnChild = ({
    target,
    element,
    last = false,
    dropElementAbove,
    dropElementBelow
}: Props) => {
    return (
        <React.Fragment>
            <DropZone.Above type={target.type} onDrop={dropElementAbove} />
            <Element id={element.id} />
            {last && <DropZone.Below type={target.type} onDrop={dropElementBelow} />}
        </React.Fragment>
    );
};

export default compose(
    connect(
        (state, props) => ({
            element: getElement(state, props.id)
        }),
        { dropElement },
        null,
        { areStatePropsEqual: isEqual }
    ),
    withHandlers({
        dropElementAbove: ({ dropElement, target, index }) => (source: Object) => {
            dropElement({ source, target: { ...target, position: index } });
        },
        dropElementBelow: ({ dropElement, target, count }) => (source: Object) => {
            dropElement({ source, target: { ...target, position: count } });
        }
    })
)(ColumnChild);
