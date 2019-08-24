import React from "react";
import { inject, LazyLoad } from "webiny-app";
import styles from "./../styles.module.css";

@inject()
class Label extends React.Component {
    render() {
        if (this.props.render) {
            return this.props.render.call(this);
        }

        let tooltip = null;
        if (this.props.tooltip) {
            tooltip = (
                <LazyLoad modules={["Tooltip", "Icon"]}>
                    {({ Tooltip, Icon }) => (
                        <Tooltip key="label" target={<Icon icon="info-circle" />}>
                            {this.props.tooltip}
                        </Tooltip>
                    )}
                </LazyLoad>
            );
        }
        return (
            <label className={styles.label}>
                {this.props.children} {tooltip}
            </label>
        );
    }
}

Label.defaultProps = {
    tooltip: null
};

export default Label;
