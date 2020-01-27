import React from "react";
import Droppable from "@webiny/app-page-builder/editor/components/Droppable";
import styled from "@emotion/styled";

const InnerDiv = styled("div")({
    height: 5,
    width: "100%", //"calc(100% - 50px)",
    zIndex: 3,
    borderRadius: 5,
    boxSizing: "border-box",
    display: "none"
});

const OuterDiv = React.memo(
    // @ts-ignore
    styled("div")(
        {
            margin: 0,
            padding: 0,
            width: "100%",
            zIndex: 10,
            backgroundColor: "transparent",
            position: "absolute",
            display: "flex",
            justifyContent: "center"
        },
        props => ({
            [props.below ? "bottom" : "top"]: 0,
            // @ts-ignore
            [InnerDiv]: {
                backgroundColor: props.isOver
                    ? "var(--mdc-theme-primary)"
                    : "var(--mdc-theme-secondary)",
                display: props.isOver ? "block" : "none"
            }
        })
    )
);

type Props = {
    type: string;
    onDrop: Function;
    below: boolean;
    isVisible: boolean;
};

const Horizontal = ({ below, onDrop, isVisible, type }: Props) => {
    return (
        <Droppable type={type} isVisible={isVisible} onDrop={onDrop}>
            {({ isOver, drop }) => (
                <div
                    ref={drop}
                    style={{
                        height: "25px",
                        width: "100%",
                        position: "absolute",
                        [below ? "bottom" : "top"]: 0,
                        left: 0,
                        zIndex: 1000
                    }}
                >
                    <OuterDiv isOver={isOver} below={below}>
                        <InnerDiv />
                    </OuterDiv>
                </div>
            )}
        </Droppable>
    );
};

export default React.memo(Horizontal);
