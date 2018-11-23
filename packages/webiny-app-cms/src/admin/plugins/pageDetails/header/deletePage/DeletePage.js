// @flow
import React from "react";
import { compose, withHandlers } from "recompose";
import dot from "dot-prop-immutable";
import { graphql } from "react-apollo";
import { withRouter } from "webiny-app/components";
import { withDialog, withSnackbar } from "webiny-app-admin/components";
import { IconButton } from "webiny-ui/Button";
import { Tooltip } from "webiny-ui/Tooltip";
import { withConfirmation, type WithConfirmationProps } from "webiny-ui/ConfirmationDialog";
import { ReactComponent as DeleteIcon } from "webiny-app-cms/admin/assets/delete.svg";
import { deletePage } from "webiny-app-cms/admin/graphql/pages";

type Props = WithConfirmationProps & {
    confirmDelete: Function
};

const DeletePage = ({ confirmDelete }: Props) => {
    return (
        <Tooltip content={"Delete"} placement={"top"}>
            <IconButton icon={<DeleteIcon />} onClick={confirmDelete} />
        </Tooltip>
    );
};

export default compose(
    withRouter(),
    withConfirmation(({ pageDetails: { page } }) => ({
        title: "Delete page",
        message: (
            <p>
                You are about to delete the entire page and all of its revisions! <br />
                Are you sure you want to permanently delete the page <strong>{page.title}</strong>?
            </p>
        )
    })),
    graphql(deletePage, { name: "deletePage" }),
    withDialog(),
    withSnackbar(),
    withHandlers({
        confirmDelete: ({
            pageDetails: { page },
            router,
            showConfirmation,
            deletePage,
            showDialog,
            showSnackbar
        }) => () => {
            showConfirmation(async () => {
                const { data: res } = await deletePage({
                    variables: { id: page.id },
                    refetchQueries: ["CmsListPages"]
                });
                const { error } = dot.get(res, "cms.deletePage");
                if (error) {
                    return showDialog(error.message, { title: "Could not delete page" });
                }

                showSnackbar(
                    <span>
                        The page{" "}
                        <strong>
                            {page.title.substr(0, 20)}
                            ...
                        </strong>{" "}
                        was deleted successfully!
                    </span>
                );

                router.goToRoute({ name: "Cms.Pages" });
            });
        }
    })
)(DeletePage);
