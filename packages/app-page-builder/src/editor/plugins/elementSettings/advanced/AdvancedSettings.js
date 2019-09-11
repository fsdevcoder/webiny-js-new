// @flow
import React, { useCallback, useEffect } from "react";
import { connect } from "@webiny/app-page-builder/editor/redux";
import { cloneDeep } from "lodash";
import { merge } from "dot-prop-immutable";
import { getPlugins } from "@webiny/plugins";
import { renderPlugins } from "@webiny/app/plugins";
import { isPluginActive } from "@webiny/app-page-builder/editor/selectors";
import { withActiveElement } from "@webiny/app-page-builder/editor/components";
import { useKeyHandler } from "@webiny/app-page-builder/editor/hooks/useKeyHandler";
import { useHandler } from "@webiny/app/hooks/useHandler";
import { css } from "emotion";
import {
    Dialog,
    DialogContent,
    DialogActions,
    DialogButton,
    DialogCancel,
    DialogTitle
} from "@webiny/ui/Dialog";
import { Form } from "@webiny/form";
import { Tabs } from "@webiny/ui/Tabs";
import { updateElement, deactivatePlugin } from "@webiny/app-page-builder/editor/actions";

const emptyElement = { data: {}, type: null };

const dialogStyle = css({
    ".mdc-dialog__surface": {
        maxWidth: 865
    },
    ".webiny-ui-dialog__content": {
        width: 865,
        maxHeight: "70vh"
    }
});

const AdvancedSettings = React.memo(
    (props: Object) => {
        const { element, open, deactivatePlugin } = props;
        const { data, type } = element || cloneDeep(emptyElement);

        const { addKeyHandler, removeKeyHandler } = useKeyHandler();

        const closeDialog = useCallback(() => {
            deactivatePlugin({ name: "pb-page-element-settings-advanced" });
        }, []);

        const onSubmit = useHandler(props, ({ element, updateElement }) => (formData: Object) => {
            // Get element settings plugins
            const plugins = getPlugins("pb-page-element-advanced-settings").filter(
                pl => pl.elementType === element.type
            );
            formData = plugins.reduce((formData, pl) => {
                if (pl.onSave) {
                    return pl.onSave(formData);
                }
                return formData;
            }, formData);

            updateElement({
                element: merge(element, "data", formData)
            });
            closeDialog();
        });

        useEffect(() => {
            open ? addKeyHandler("escape", closeDialog) : removeKeyHandler("escape");
        });

        return (
            <Dialog open={open} onClose={closeDialog} className={dialogStyle}>
                <DialogTitle>Settings</DialogTitle>
                <Form key={element && element.id} data={data} onSubmit={onSubmit}>
                    {({ submit, Bind, data, form }) => (
                        <React.Fragment>
                            <DialogContent>
                                <Tabs>
                                    {renderPlugins(
                                        "pb-page-element-advanced-settings",
                                        { Bind, data, form },
                                        { wrapper: false, filter: pl => pl.elementType === type }
                                    )}
                                </Tabs>
                            </DialogContent>
                            <DialogActions>
                                <DialogCancel>Cancel</DialogCancel>
                                <DialogButton onClick={submit}>Save</DialogButton>
                            </DialogActions>
                        </React.Fragment>
                    )}
                </Form>
            </Dialog>
        );
    },
    (prev, next) => prev.open === next.open
);

const withConnect = connect(
    state => ({
        open: isPluginActive("pb-page-element-settings-advanced")(state)
    }),
    { updateElement, deactivatePlugin }
);

export default withConnect(withActiveElement({ shallow: true })(AdvancedSettings));
