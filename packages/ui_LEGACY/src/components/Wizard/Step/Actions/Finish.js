import React from "react";
import { inject, i18n } from "webiny-app";
import _ from "lodash";

const t = i18n.namespace("Webiny.Ui.Wizard.Actions.Finish");
@inject({ modules: ["Button"] })
class Finish extends React.Component {
    render() {
        const {
            modules: { Button },
            onClick,
            render,
            wizard,
            ...props
        } = this.props;
        if (render) {
            return render.call(this);
        }

        if (!wizard.isLastStep()) {
            return null;
        }

        const btnProps = {
            type: "primary",
            onClick: async () => {
                await onClick();
                wizard.form.validate().then(valid => valid && wizard.finish());
            },
            align: "right",
            ...props
        };

        return <Button {...btnProps} />;
    }
}

// Receives all standard Button component props
Finish.defaultProps = {
    wizard: null,
    onClick: _.noop,
    label: t`Finish`
};

export default Finish;
