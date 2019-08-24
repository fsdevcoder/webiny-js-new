import React from "react";
import { inject, i18n } from "webiny-app";

@inject()
class Number extends React.Component {
    render() {
        try {
            return <span>{i18n.number(this.props.value, this.props.format)}</span>;
        } catch (e) {
            return this.props.default;
        }
    }
}

Number.defaultProps = {
    format: null,
    default: "-",
    value: null
};

export default Number;
