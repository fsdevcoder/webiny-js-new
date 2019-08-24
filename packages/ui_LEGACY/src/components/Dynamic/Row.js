
import React from "react";
import { inject } from 'webiny-app';

@inject()
class Row extends React.Component {
    render() {
        return this.props.children;
    }
}

export default Row;