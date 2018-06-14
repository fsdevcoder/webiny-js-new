import React from "react";
import _ from "lodash";
import { inject, i18n } from "webiny-client";

@inject({ modules: ["List"], tableField: true })
class TimeField extends React.Component {
    render() {
        const { modules: { List }, format, render, ...props } = this.props;

        if (render) {
            return render.call(this);
        }

        const time = _.get(this.props.data, this.props.name);

        return (
            <List.Table.Field {...props}>
                {() => {
                    try {
                        return i18n.time(time, format);
                    } catch (e) {
                        return this.props.default;
                    }
                }}
            </List.Table.Field>
        );
    }
}

TimeField.defaultProps = {
    name: null,
    default: "-",
    format: null
};

export default TimeField;
