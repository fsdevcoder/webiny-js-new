import React from "react";
import _ from "lodash";
import classSet from "classnames";
import { inject } from "webiny-app";
import styles from "./styles.module.css";
import Required from "./Components/Required";
import Label from "./Components/Label";
import InfoMessage from "./Components/InfoMessage";
import ValidationIcon from "./Components/ValidationIcon";
import ValidationMessage from "./Components/ValidationMessage";
import DescriptionMessage from "./Components/DescriptionMessage";

@inject({ styles })
class FormGroup extends React.Component {
    render() {
        if (this.props.render) {
            return this.props.render.call(this);
        }

        const cssConfig = classSet(
            styles.wrapper,
            this.props.className,
            this.props.valid === false && styles.error,
            this.props.valid === true && styles.success
        );

        return (
            <div className={cssConfig}>
                <div className={styles.inputGroup}>{this.props.children}</div>
            </div>
        );
    }
}

_.assign(FormGroup, {
    Label,
    Required,
    InfoMessage,
    ValidationIcon,
    ValidationMessage,
    DescriptionMessage
});

export default FormGroup;
