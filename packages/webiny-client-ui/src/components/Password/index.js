import React from "react";
import { inject, i18n } from "webiny-client";

const t = i18n.namespace("Webiny.Ui.Password");

@inject({
    modules: ["Link", "Icon", "Input"]
})
class Password extends React.Component {
    constructor() {
        super();

        this.state = {
            showPassword: false,
            icon: ["fa", "eye"],
            msg: t`Show content`
        };

        this.togglePassword = this.togglePassword.bind(this);
    }

    togglePassword() {
        if (this.state.showPassword === true) {
            this.setState({
                showPassword: false,
                icon: ["fa", "eye"],
                msg: t`Show content`
            });
        } else {
            this.setState({
                showPassword: true,
                icon: ["fa", "eye-slash"],
                msg: t`Hide content`
            });
        }
    }

    render() {
        const {
            modules: { Icon, Input, Link },
            render,
            ...props
        } = this.props;

        if (render) {
            return render.call(this);
        }

        props.info = (
            <Link tabIndex="-1" onClick={this.togglePassword}>
                <Icon icon={this.state.icon} /> {this.state.msg}
            </Link>
        );
        props.type = this.state.showPassword ? "text" : "password";

        return <Input {...props} />;
    }
}

Password.defaultProps = {
    defaultValidate: "password"
};

export default Password;
