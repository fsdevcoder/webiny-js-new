import React from "react";
import _ from "lodash";
import { createComponent, i18n } from "webiny-client";
import { ModalComponent } from "webiny-client-ui";
import Dialog from "./Dialog";
import Content from "./Content";
import Body from "./Body";
import Footer from "./Footer";
import styles from "../styles.css";

const t = i18n.namespace("Webiny.Ui.Modal.Success");
class Success extends React.Component {
    renderFooter() {
        let { Button, closeBtn, onClose } = this.props;
        let button = null;

        if (_.isFunction(closeBtn)) {
            closeBtn = closeBtn(this);
        }

        if (_.isString(closeBtn)) {
            button = (
                <Button
                    type="primary"
                    label={closeBtn}
                    onClick={() => this.props.hide().then(onClose)}
                />
            );
        }

        if (React.isValidElement(closeBtn)) {
            button = closeBtn;
        }

        return <Footer>{button}</Footer>;
    }

    render() {
        if (this.props.render) {
            return this.props.render.call(this);
        }

        let content = this.props.message || this.props.children;

        if (_.isFunction(content)) {
            content = content(this);
        }

        const { Icon, onShown } = this.props;
        return (
            <Dialog
                modalContainerTag="success-modal"
                className={styles.alertModal}
                onShown={onShown}
            >
                <Content>
                    <Body>
                        <div className="text-center">
                            <Icon type="success" size="4x" icon="icon-check-circle" element="div" />
                            <h4>{this.props.title}</h4>

                            <div>{content}</div>
                        </div>
                    </Body>
                    {this.renderFooter()}
                </Content>
            </Dialog>
        );
    }
}

Success.defaultProps = {
    title: t`Awesome!`,
    closeBtn: t`Close`,
    onClose: _.noop,
    onShown: _.noop
};

export default createComponent([Success, ModalComponent], { modules: ["Button", "Icon"] });
