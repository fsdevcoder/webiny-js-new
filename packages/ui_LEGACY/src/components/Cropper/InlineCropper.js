import React from "react";
import { inject } from "webiny-app";
import withBaseCropper from "./withBaseCropper";

@withBaseCropper()
@inject({ modules: ["Button"] })
class InlineCropper extends React.Component {
    render() {
        if (this.props.render) {
            return this.props.render.call(this);
        }

        const props = { ...this.props };
        if (!props.image) {
            return null;
        }

        const { Button } = props.modules;

        return (
            <webiny-image-cropper>
                {props.children}
                <div className="col-xs-12 no-padding">
                    <img
                        onLoad={e => props.initCropper(e.currentTarget)}
                        width="100%"
                        style={{ maxWidth: "100%" }}
                        src={
                            props.image &&
                            (props.image.data || props.image.src) + props.getCacheBust()
                        }
                    />
                    Cropped image size:{" "}
                    <strong>
                        {props.width}x{props.height}
                    </strong>
                </div>
                <div className="col-xs-12">
                    <Button
                        type="primary"
                        className="pull-right ml5"
                        onClick={this.props.applyCropping}
                    >
                        {this.props.action}
                    </Button>
                    <Button type="default" className="pull-right ml5" onClick={this.props.onHidden}>
                        Cancel
                    </Button>
                </div>
            </webiny-image-cropper>
        );
    }
}

export default InlineCropper;
