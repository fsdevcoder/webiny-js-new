import React, { ReactElement, SyntheticEvent } from "react";

type ResizerProps = {
    axis: "x" | "y";
    onResizeStart?: () => void;
    onResizeStop?: () => void;
    onResize(position: number): void;
    children(params: { isResizing: boolean; onMouseDown(e: SyntheticEvent): void }): ReactElement;
};

class Resizer extends React.Component<ResizerProps> {
    state = {
        dragging: false
    };

    startPosition: number;

    getMousePosition = e => {
        return this.props.axis === "x" ? e.pageX : e.pageY;
    };

    onMouseDown = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.startPosition = this.getMousePosition(e);
        this.setState(
            {
                dragging: true
            },
            () => {
                document.addEventListener("mousemove", this.onMouseMove);
                document.addEventListener("mouseup", this.onMouseUp);
            }
        );
        this.props.onResizeStart();
    };

    onMouseUp = () => {
        if (this.state.dragging) {
            this.setState({ dragging: false });
            this.props.onResizeStop();
        }
    };

    onMouseMove = e => {
        if (!this.state.dragging) {
            return;
        }

        const mousePosition = this.getMousePosition(e);
        this.props.onResize(this.startPosition - mousePosition);
        this.startPosition = mousePosition;
    };

    render() {
        return this.props.children({
            isResizing: this.state.dragging,
            onMouseDown: this.onMouseDown
        });
    }
}

export default Resizer;
