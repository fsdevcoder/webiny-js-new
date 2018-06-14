import React from "react";
import _ from "lodash";
import { Component } from "webiny-client";
import Growl from "./Growl";

@Component()
class SuccessGrowl extends React.Component {
    render() {
        if (this.props.render) {
            return this.props.render.call(this);
        }

        return <Growl {..._.omit(this.props, ["render"])} />;
    }
}

SuccessGrowl.defaultProps = {
    title: null,
    ttl: 3000,
    sticky: false,
    message: null,
    type: "success"
};

export default SuccessGrowl;
