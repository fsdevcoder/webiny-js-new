// @flow
import React from "react";
import { CmsContextConsumer } from "./CmsContext";

export type WithCmsPropsType = {
    theme: Object,
    editor?: boolean
};

export function withCms() {
    return function decorator(Component: *) {
        return function withCmsComponent(props: *) {
            return (
                <CmsContextConsumer>
                    <Component {...props} />
                </CmsContextConsumer>
            );
        };
    };
}
