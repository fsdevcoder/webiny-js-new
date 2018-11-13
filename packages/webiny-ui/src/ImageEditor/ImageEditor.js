// @flow
import * as React from "react";
import * as toolbar from "./toolbar";
import type { ImageEditorTool } from "./toolbar/types";
import styled from "react-emotion";
import classNames from "classnames";
import { ButtonSecondary, ButtonPrimary } from "webiny-ui/Button";
import loadScript from "load-script";

export type ToolbarTool = "crop" | "flip" | "rotate" | "filter";

type RenderPropArgs = {
    render: Function,
    getCanvasDataUrl: () => string,
    activeTool: ?ImageEditorTool,
    applyActiveTool: Function,
    cancelActiveTool: Function
};

type Props = {
    src: string,
    tools: Array<ToolbarTool>,
    onToolActivate?: Function,
    onToolDeactivate?: Function,
    children?: RenderPropArgs => React.Node
};

type State = {
    tool: ?Object,
    src: string
};

const Toolbar = styled("div")({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "var(--mdc-theme-secondary)",
    margin: "-20px -24px 0px -24px",
    padding: 2,
    "> div.disabled": {
        opacity: 0.5,
        pointerEvents: "none"
    }
});

const ToolOptions = styled("div")({
    margin: "0 -24px 10px -24px",
    boxSizing: "border-box",
    padding: 10,
    backgroundColor: "var(--mdc-theme-background)",
    borderTop: "1px solid var(--mdc-theme-on-background)"
});

const ApplyCancelActions = styled("div")({
    textAlign: "center"
});

const initScripts = () => {
    return new Promise(resolve => {
        if (window.Caman) {
            return resolve();
        }
        return loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/camanjs/4.1.2/caman.full.min.js",
            resolve
        );
    });
};

class ImageEditor extends React.Component<Props, State> {
    static defaultProps = {
        tools: ["crop", "flip", "rotate", "filter"]
    };

    state = {
        tool: null,
        src: ""
    };

    canvas = React.createRef();
    image = null;

    componentDidMount() {
        initScripts().then(this.updateCanvas);
    }

    componentDidUpdate(previousProps: Object) {
        if (previousProps.src !== this.props.src) {
            this.deactivateTool();
            this.updateCanvas();
        }
    }

    updateCanvas = () => {
        const { src } = this.props;
        this.image = new window.Image();
        const canvas = this.canvas.current;
        if (canvas) {
            this.image.onload = () => {
                if (this.image) {
                    canvas.width = this.image.width;
                    canvas.height = this.image.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(this.image, 0, 0);
                }
            };

            this.image.src = src;
        }
    };

    activateTool = (tool: ImageEditorTool) => {
        this.setState({ tool });
    };

    deactivateTool = () => {
        this.setState({ tool: null });
    };

    getCanvasDataUrl = () => {
        const { current: canvas } = this.canvas;
        return canvas ? canvas.toDataURL() : "";
    };

    applyActiveTool = async () => {
        const { tool } = this.state;
        if (!tool) {
            return;
        }

        tool.apply &&
            (await tool.apply({
                canvas: this.canvas
            }));
        this.deactivateTool();
    };

    cancelActiveTool = async () => {
        const { tool } = this.state;
        if (!tool) {
            return;
        }

        tool.cancel &&
            (await tool.cancel({
                canvas: this.canvas
            }));
        this.deactivateTool();
    };

    render() {
        const { src, tools, children } = this.props;
        const { tool } = this.state;
        const editor = (
            <React.Fragment>
                <Toolbar>
                    {tools.map(key => {
                        const tool: ?ImageEditorTool = toolbar[key];
                        if (!tool) {
                            return null;
                        }

                        return (
                            <div key={key} className={classNames({ disabled: this.state.tool })}>
                                {tool.icon({
                                    canvas: this.canvas,
                                    activateTool: () => this.activateTool(tool)
                                })}
                            </div>
                        );
                    })}
                </Toolbar>

                <ToolOptions>
                    {tool ? (
                        <>
                            {typeof tool.renderForm === "function" &&
                                tool.renderForm({
                                    image: this.image,
                                    canvas: this.canvas
                                })}

                            <ApplyCancelActions>
                                <ButtonSecondary onClick={this.cancelActiveTool}>
                                    Cancel
                                </ButtonSecondary>
                                &nbsp;
                                <ButtonPrimary onClick={this.applyActiveTool}>Apply</ButtonPrimary>
                            </ApplyCancelActions>
                        </>
                    ) : (
                        <div style={{ textAlign: "center" }}>
                            Select a tool to start working on your image.
                        </div>
                    )}
                </ToolOptions>

                <div style={{ margin: "0 auto", textAlign: "center" }}>
                    <canvas key={src} id={"canvas"} style={{ maxWidth: 700 }} ref={this.canvas} />
                </div>
            </React.Fragment>
        );

        if (typeof children === "function") {
            return children({
                render: () => editor,
                canvas: this.canvas,
                getCanvasDataUrl: this.getCanvasDataUrl,
                activeTool: this.state.tool,
                applyActiveTool: this.applyActiveTool,
                cancelActiveTool: this.cancelActiveTool
            });
        }

        return editor;
    }
}

export { ImageEditor };
