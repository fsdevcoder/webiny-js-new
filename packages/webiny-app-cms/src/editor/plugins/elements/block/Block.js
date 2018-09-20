//@flow
import React from "react";
import { css } from "emotion";
import styled from "react-emotion";
import { connect } from "react-redux";
import Element from "webiny-app-cms/editor/components/Element";
import ElementStyle from "webiny-app-cms/render/components/ElementStyle";
import DropZone from "webiny-app-cms/editor/components/DropZone";
import { dropElement } from "webiny-app-cms/editor/actions";

const BlockContainer = styled("div")({
    position: "relative",
    color: "#666",
    padding: 5,
    boxSizing: "border-box",
});

const Block = ({ element, dropElement }) => {
    const { id, type, path, elements } = element;
    return (
        <BlockContainer id={id} style={{zIndex: 20, position: 'relative'}}>
            <ElementStyle style={{ margin: "0 auto", boxSizing: "border-box"}} element={element}>
                {({ elementStyle, inlineStyle, customClasses, combineClassNames }) => {
                    const { width, ...containerStyle } = elementStyle;
                    return (
                        <div style={{ width: "100%" }} className={css(containerStyle)}>
                            <div
                                style={{ width, margin: "0 auto" }}
                                className={combineClassNames(inlineStyle, ...customClasses)}
                            >
                                {!elements.length && (
                                    <DropZone.Center element={element}>
                                        Add an element here
                                    </DropZone.Center>
                                )}
                                {elements.map((element, index) => (
                                    <React.Fragment key={element.id}>
                                        <DropZone.Above
                                            type={type}
                                            onDrop={source =>
                                                dropElement({
                                                    source,
                                                    target: { path, type, position: index }
                                                })
                                            }
                                        />
                                        <Element key={element.id} element={element} />
                                        {index === elements.length - 1 && (
                                            <DropZone.Below
                                                type={type}
                                                onDrop={source =>
                                                    dropElement({
                                                        source,
                                                        target: {
                                                            path,
                                                            type,
                                                            position: elements.length
                                                        }
                                                    })
                                                }
                                            />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    );
                }}
            </ElementStyle>
        </BlockContainer>
    );
};

export default connect(
    null,
    { dropElement }
)(Block);
