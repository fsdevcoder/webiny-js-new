import React from "react";
import { inject, i18n } from "webiny-app";

@inject()
class Date extends React.Component {
    render() {
        try {
            return <span>{i18n.date(this.props.value, this.props.format)}</span>;
        } catch (e) {
            return this.props.default;
        }
    }
}

Date.defaultProps = {
    format: null,
    default: "-",
    value: null
};

export default Date;
