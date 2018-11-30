// @flow
import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { set } from "dot-prop-immutable";
import ConnectedSlate from "webiny-app-cms/editor/components/ConnectedSlate";
import { ElementStyle, getElementStyleProps } from "webiny-app-cms/render/components/ElementStyle";
import { updateElement } from "webiny-app-cms/editor/actions";
import { getElement } from "webiny-app-cms/editor/selectors";

export const className = "webiny-cms-element-text";

const Text = ({ element, onChange }) => {
    return (
        <ElementStyle {...getElementStyleProps(element)} className={className}>
            <ConnectedSlate elementId={element.id} onChange={onChange} />
        </ElementStyle>
    );
};

export default compose(
    connect(
        (state, props) => ({
            element: getElement(state, props.elementId)
        }),
        { updateElement }
    ),
    withHandlers({
        onChange: ({ element, updateElement }) => value => {
            updateElement({ element: set(element, "data.text", value) });
        }
    })
)(Text);
