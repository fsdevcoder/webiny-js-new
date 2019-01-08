// @flow
import * as React from "react";
import { css } from "emotion";
import { ElementRoot } from "webiny-app-cms/render/components/ElementRoot";
import ConnectedElement from "webiny-app-cms/editor/components/ConnectedElement";

const center = css({ textAlign: "center" });

const Icon = ({ element }: Object) => {
    return (
        <ElementRoot element={element}>
            {({ getAllClasses, elementStyle }) => (
                <ConnectedElement elementId={element.id}>
                    {element => {
                        const { svg = null } = element.data.icon;
                        const className = getAllClasses(
                            "webiny-cms-base-element-style webiny-cms-element-icon",
                            center
                        );

                        if (!svg) {
                            return null;
                        }

                        return (
                            <div
                                style={elementStyle}
                                className={className}
                                dangerouslySetInnerHTML={{ __html: svg }}
                            />
                        );
                    }}
                </ConnectedElement>
            )}
        </ElementRoot>
    );
};

export default Icon;
