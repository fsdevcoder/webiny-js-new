import React from "react";
import { createComponent } from "webiny-client";
import { ModalComponent } from "webiny-client-ui";

class CropperDialog extends React.Component {
    render() {
        const { Modal, children, ...props } = this.props;
        return <Modal.Dialog {...props}>{children}</Modal.Dialog>;
    }
}

export default createComponent([CropperDialog, ModalComponent], { modules: ["Modal"] });
