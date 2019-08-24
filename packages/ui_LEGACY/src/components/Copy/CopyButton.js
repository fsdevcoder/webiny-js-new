import React from "react";
import _ from "lodash";
import { app, i18n, inject } from "webiny-app";

const t = i18n.namespace("Webiny.Ui.Copy.CopyButton");
@inject({
    modules: ["Button", { Clipboard: "Vendor.Clipboard" }]
})
class CopyButton extends React.Component {
    constructor() {
        super();

        this.dom = null;
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            if (this.dom) {
                clearInterval(this.interval);
                this.interval = null;
                this.setup();
            }
        }, 100);
    }

    componentWillUnmount() {
        this.clipboard.destroy();
    }

    setup() {
        this.clipboard = new this.props.modules.Clipboard(this.dom, {
            text: () => {
                return this.props.value;
            }
        });

        this.clipboard.on("success", () => {
            const onSuccessMessage = this.props.onSuccessMessage;
            if (_.isFunction(onSuccessMessage)) {
                onSuccessMessage();
            } else if (_.isString(onSuccessMessage)) {
                app.services.get("growler").info(onSuccessMessage);
            }
        });
    }

    render() {
        if (this.props.render) {
            return this.props.render.call(this);
        }

        const props = _.omit(this.props, ["renderer", "onSuccessMessage", "onCopy", "value"]);
        const { Button } = props.modules;

        return <Button onRef={ref => (this.dom = ref)} {...props} />;
    }
}

CopyButton.defaultProps = {
    label: t`Copy`,
    onSuccessMessage: t`Copied to clipboard!`,
    onCopy: _.noop,
    style: null,
    value: null
};

export default CopyButton;
