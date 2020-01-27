import React from "react";
import { connect } from "@webiny/app-page-builder/editor/redux";
import { ConfirmationDialog } from "@webiny/ui/ConfirmationDialog";
import { ButtonPrimary } from "@webiny/ui/Button";
import { getPage } from "@webiny/app-page-builder/editor/selectors";
import { omit, isEqual } from "lodash";
import { Mutation } from "react-apollo";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { withRouter } from "@webiny/react-router";
import { PUBLISH_REVISION } from "./PublishPageButton/graphql";

const PublishPageButton = ({ page, history }) => {
    const { showSnackbar } = useSnackbar();
    return (
        <ConfirmationDialog
            data-testid={"pb-editor-publish-confirmation-dialog"}
            title="Publish page"
            message="You are about to publish this page, are you sure want to continue?"
        >
            {({ showConfirmation }) => (
                <Mutation mutation={PUBLISH_REVISION} refetchQueries={["PbListPages"]}>
                    {update => (
                        <ButtonPrimary
                            onClick={async () => {
                                showConfirmation(async () => {
                                    const response = await update({
                                        variables: {
                                            id: page.id
                                        }
                                    });

                                    const { error } = response.data.pageBuilder.publishRevision;
                                    if (error) {
                                        return showSnackbar(error.message);
                                    }

                                    history.push(`/page-builder/pages?id=${page.id}`);

                                    // Let's wait a bit, because we are also redirecting the user.
                                    setTimeout(() => {
                                        showSnackbar("Your page was published successfully!");
                                    }, 500);
                                });
                            }}
                        >
                            {page.version > 1 ? "Publish changes" : "Publish"}
                        </ButtonPrimary>
                    )}
                </Mutation>
            )}
        </ConfirmationDialog>
    );
};

export default connect<any, any, any>(
    state => ({ page: omit(getPage(state), ["content"]) }),
    null,
    null,
    { areStatePropsEqual: isEqual }
)(withRouter(PublishPageButton));
