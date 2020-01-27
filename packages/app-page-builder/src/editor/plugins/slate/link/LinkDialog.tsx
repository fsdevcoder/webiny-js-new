import React, { Fragment, useCallback, useMemo } from "react";
import { Form } from "@webiny/form";
import { Input } from "@webiny/ui/Input";
import { Switch } from "@webiny/ui/Switch";
import { Cell, Grid } from "@webiny/ui/Grid";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogCancel,
    DialogActions,
    DialogButton
} from "@webiny/ui/Dialog";
import { getLinkRange, isLink, TYPE } from "./utils";
import { validation } from "@webiny/validation";

const LinkDialog = ({ open, editor, onChange, closeDialog, activePlugin }) => {
    const { linkData } = useMemo(() => {
        if (!activePlugin) {
            return { linkData: null };
        }

        let { selection, inlines, anchorText } = activePlugin.value;
        let link = inlines.find(isLink);

        if (typeof anchorText !== "string") {
            anchorText = anchorText.getText();
        }

        const ns = normalizeSelection(selection);
        const start = ns.anchor.offset;
        const end = ns.focus.offset;
        const selectedText = link ? anchorText : anchorText.substr(start, end - start);

        return { linkData: { ...(link && link.data), text: selectedText } };
    }, [activePlugin]);

    const updateLink = useCallback(
        ({ text, ...data }) => {
            editor.change(change => {
                const { selection } = activePlugin.value;
                const linkSelection = getLinkRange(change, normalizeSelection(selection));
                change
                    .select(linkSelection)
                    .unwrapInline(TYPE)
                    .insertText(text)
                    .moveAnchorBackward(text.length)
                    .wrapInline({ type: TYPE, data })
                    .moveToStart();

                onChange(change);
                closeDialog();
            });
        },
        [editor, activePlugin, onChange, closeDialog]
    );

    return (
        <Dialog open={open} onClose={closeDialog}>
            <Form data={linkData} onSubmit={updateLink}>
                {({ Bind, submit }) => (
                    <Fragment>
                        <DialogTitle>Edit Link</DialogTitle>
                        <DialogContent>
                            <Grid>
                                <Cell span={12}>
                                    <Bind name={"text"} validators={validation.create("required")}>
                                        <Input label="Text to display" />
                                    </Bind>
                                </Cell>
                                <Cell span={12}>
                                    <Bind name={"href"} validators={validation.create("required")}>
                                        <Input label="URL" />
                                    </Bind>
                                </Cell>
                                <Cell span={6}>
                                    <Bind name={"newTab"}>
                                        <Switch
                                            onChange={() => submit()}
                                            label={"Open in new window"}
                                        />
                                    </Bind>
                                </Cell>
                                <Cell span={6}>
                                    <Bind name={"noFollow"}>
                                        <Switch
                                            onChange={() => submit()}
                                            label={`Add "rel=nofollow"`}
                                        />
                                    </Bind>
                                </Cell>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <DialogCancel onClick={closeDialog}>Cancel</DialogCancel>
                            <DialogButton onClick={submit}>OK</DialogButton>
                        </DialogActions>
                    </Fragment>
                )}
            </Form>
        </Dialog>
    );
};

const normalizeSelection = selection => {
    let start, end;
    if (selection.anchor.offset > selection.focus.offset) {
        start = selection.focus;
        end = selection.anchor;
    } else {
        start = selection.anchor;
        end = selection.focus;
    }

    return {
        anchor: start,
        focus: end
    };
};

export default LinkDialog;
