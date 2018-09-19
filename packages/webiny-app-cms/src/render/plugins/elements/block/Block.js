//@flow
import React from "react";
import { css } from "emotion";
import Element from "webiny-app-cms/render/components/Element";
import ElementStyle from "webiny-app-cms/render/components/ElementStyle";
import type { ElementType } from "webiny-app-cms/types";

const Block = ({ element }: { element: ElementType }) => {
    return (
        <ElementStyle style={{ margin: "0 auto", boxSizing: "border-box" }} element={element}>
            {({ elementStyle, inlineStyle, customClasses, combineClassNames }) => {
                const { width, ...containerStyle } = elementStyle;
                return (
                    <div style={{ width: "100%" }} className={css(containerStyle)}>
                        <div
                            style={{ width, margin: "0 auto" }}
                            className={combineClassNames(inlineStyle, ...customClasses)}
                        >
                            {element.elements.map(element => (
                                <Element key={element.id} element={element} />
                            ))}
                        </div>
                    </div>
                );
            }}
        </ElementStyle>
    );
};

export default Block;
