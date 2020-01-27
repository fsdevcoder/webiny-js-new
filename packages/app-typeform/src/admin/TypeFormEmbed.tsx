import React from "react";
import { connect } from "@webiny/app-page-builder/editor/redux";
import { getElement } from "@webiny/app-page-builder/editor/selectors";

const TypeFormEmbed = (props: { element }) => {
    const { source } = props.element.data;
    if (!source || !source.url) {
        return <span>You must configure your embed in the settings!</span>;
    }

    return <iframe frameBorder="0" src={source.url} style={{ height: "100%", width: "100%" }} />;
};

export default connect((state, props: any) => ({
    element: getElement(state, props.elementId)
}))(TypeFormEmbed);
