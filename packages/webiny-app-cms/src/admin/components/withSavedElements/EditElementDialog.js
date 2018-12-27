// @flow
import React from "react";
import { compose, shouldUpdate } from "recompose";
import { css } from "emotion";
import { getPlugin } from "webiny-plugins";
import {
    Dialog,
    DialogHeader,
    DialogHeaderTitle,
    DialogBody,
    DialogFooter,
    DialogFooterButton,
    DialogCancel
} from "webiny-ui/Dialog";
import { Input } from "webiny-ui/Input";
import { Grid, Cell } from "webiny-ui/Grid";
import { Form } from "webiny-form";
import styled from "react-emotion";

const narrowDialog = css({
    ".mdc-dialog__surface": {
        width: 600,
        minWidth: 600
    }
});

const PreviewBox = styled("div")({
    width: 500,
    minHeight: 250,
    border: "1px solid var(--mdc-theme-on-background)",
    backgroundColor: "#fff", // this must always be white
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    img: {
        maxHeight: 500,
        maxWidth: 500
    }
});

type Props = {
    open: boolean,
    plugin: string,
    onClose: Function,
    onSubmit: Function
};

const EditElementDialog = (props: Props) => {
    const { open, onClose, onSubmit, plugin: pluginName } = props;

    const plugin = getPlugin(pluginName);

    return (
        <Dialog open={open} onClose={onClose} className={narrowDialog}>
            {plugin && (
                <Form onSubmit={onSubmit} data={plugin}>
                    {({ submit, Bind }) => (
                        <React.Fragment>
                            <DialogHeader>
                                <DialogHeaderTitle>Update {plugin.title}</DialogHeaderTitle>
                            </DialogHeader>
                            <DialogBody>
                                <Grid>
                                    <Cell span={12}>
                                        <Bind name={"title"} validators={"required"}>
                                            <Input label={"Name"} autoFocus />
                                        </Bind>
                                    </Cell>
                                </Grid>
                                <Grid>
                                    <Cell span={12}>
                                        <PreviewBox>{plugin.toolbar.preview()}</PreviewBox>
                                    </Cell>
                                </Grid>
                            </DialogBody>
                            <DialogFooter>
                                <DialogCancel>Cancel</DialogCancel>
                                <DialogFooterButton onClick={submit}>Save</DialogFooterButton>
                            </DialogFooter>
                        </React.Fragment>
                    )}
                </Form>
            )}
        </Dialog>
    );
};

export default compose(
    shouldUpdate((props, nextProps) => {
        return props.open !== nextProps.open;
    })
)(EditElementDialog);
