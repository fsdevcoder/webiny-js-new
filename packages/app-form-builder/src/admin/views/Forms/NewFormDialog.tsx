import React from "react";
import { css } from "emotion";
import useReactRouter from "use-react-router";
import { Mutation } from "react-apollo";
import { Form } from "@webiny/form";
import { Input } from "@webiny/ui/Input";
import { CREATE_FORM } from "../../viewsGraphql";
import get from "lodash.get";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { CircularProgress } from "@webiny/ui/Progress";

import { i18n } from "@webiny/app/i18n";
const t = i18n.namespace("Forms.NewFormDialog");

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogOnClose
} from "@webiny/ui/Dialog";
import { ButtonDefault } from "@webiny/ui/Button";

const narrowDialog = css({
    ".mdc-dialog__surface": {
        width: 400,
        minWidth: 400
    }
});

export type NewFormDialogProps = {
    open: boolean;
    onClose: DialogOnClose;
    formsDataList: any;
};

const NewFormDialog: React.FC<NewFormDialogProps> = ({ open, onClose, formsDataList }) => {
    const [loading, setLoading] = React.useState(false);
    const { showSnackbar } = useSnackbar();
    const { history } = useReactRouter();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            className={narrowDialog}
            data-testid="fb-new-form-modal"
        >
            <Mutation mutation={CREATE_FORM}>
                {update => (
                    <Form
                        onSubmit={async data => {
                            setLoading(true);
                            const response = get(
                                await update({
                                    variables: data,
                                    refetchQueries: ["FormsListForms"],
                                    awaitRefetchQueries: true
                                }),
                                "data.forms.form"
                            );

                            if (response.error) {
                                setLoading(false);
                                return showSnackbar(response.error.message);
                            }

                            await formsDataList.refresh();
                            history.push("/forms/" + response.data.id);
                        }}
                    >
                        {({ Bind, submit }) => (
                            <>
                                {loading && <CircularProgress />}
                                <DialogTitle>{t`New form`}</DialogTitle>
                                <DialogContent>
                                    <Bind name={"name"}>
                                        <Input placeholder={"Enter a name for your new form"} />
                                    </Bind>
                                </DialogContent>
                                <DialogActions>
                                    <ButtonDefault onClick={submit}>+ {t`Create`}</ButtonDefault>
                                </DialogActions>
                            </>
                        )}
                    </Form>
                )}
            </Mutation>
        </Dialog>
    );
};

export default NewFormDialog;
