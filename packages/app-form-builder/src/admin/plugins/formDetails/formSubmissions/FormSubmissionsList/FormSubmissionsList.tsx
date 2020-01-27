import React, { useState } from "react";
import TimeAgo from "timeago-react";
import { css } from "emotion";
import { Typography } from "@webiny/ui/Typography";
import { Checkbox } from "@webiny/ui/Checkbox";
import Block from "../Block";
import {
    DataList,
    List,
    ListItem,
    ListItemText,
    ListTextOverline,
    ListItemMeta,
    ListSelectBox
} from "@webiny/ui/List";
import FormSubmissionDialog from "./FormSubmissionDialog";
import { ReactComponent as ImportExport } from "./icons/round-cloud_download-24px.svg";
import { IconButton } from "@webiny/ui/Button";
import { EXPORT_FORM_SUBMISSIONS } from "@webiny/app-form-builder/admin/viewsGraphql";
import { Mutation } from "react-apollo";
import { Tooltip } from "@webiny/ui/Tooltip";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { i18n } from "@webiny/app/i18n";
const t = i18n.namespace("FormsApp.FormsDataList");

const rightAlign = css({
    alignItems: "flex-end !important"
});

const FullName = ({ submission }) => {
    const {
        data: { firstName, lastName, email }
    } = submission;

    const output = [firstName, lastName, email && `<${email}>`].filter(Boolean).join(" ");
    return <span>{output || "N/A"}</span>;
};

const FormVersion = ({ submission }) => {
    return <span>Form revision #${submission.form.revision.version}</span>;
};

const renderExportFormSubmissionsTooltip = dataList => {
    const submissionsCount = dataList.getMultiSelected().length;
    if (submissionsCount > 0) {
        return t`Export {submissionsCount|count:1:form submission:default:form submissions}.`({
            submissionsCount
        });
    }

    return t`Export all form submissions`;
};

const FormSubmissionsList = props => {
    const { dataList, form } = props;
    const [selectedFormSubmission, selectFormSubmission] = useState(null);
    const [exportInProgress, setExportInProgress] = useState(false);
    const { showSnackbar } = useSnackbar();

    if (!dataList) {
        return;
    }

    return (
        <>
            <Block title="Submissions">
                <DataList
                    {...dataList}
                    multiSelectAll={dataList.multiSelectAll}
                    multiSelect={dataList.multiSelect}
                    multiSelectActions={
                        <Mutation mutation={EXPORT_FORM_SUBMISSIONS}>
                            {update => (
                                <Tooltip
                                    content={renderExportFormSubmissionsTooltip(dataList)}
                                    placement={"bottom"}
                                >
                                    <IconButton
                                        disabled={exportInProgress}
                                        icon={<ImportExport />}
                                        onClick={async () => {
                                            setExportInProgress(true);
                                            const args = {
                                                variables: {
                                                    parent: null,
                                                    ids: null
                                                }
                                            };
                                            if (dataList.isNoneMultiSelected()) {
                                                args.variables.parent = form.parent;
                                            } else {
                                                args.variables.ids = dataList
                                                    .getMultiSelected()
                                                    .map(item => item.id);
                                            }

                                            const { data } = await update(args);
                                            setExportInProgress(false);
                                            if (data.forms.exportFormSubmissions.error) {
                                                showSnackbar(
                                                    data.forms.exportFormSubmissions.error.message
                                                );
                                                return;
                                            }

                                            window.open(
                                                data.forms.exportFormSubmissions.data.src,
                                                "_blank"
                                            );
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Mutation>
                    }
                    sorters={[
                        {
                            label: t`Newest to oldest`,
                            sorters: { "meta.submittedOn": -1 }
                        },
                        {
                            label: t`Oldest to newest`,
                            sorters: { "meta.submittedOn": 1 }
                        }
                    ]}
                >
                    {({ data = [] }) => (
                        <List>
                            {data.map(submission => (
                                <ListItem key={submission.id}>
                                    <ListSelectBox>
                                        <Checkbox
                                            onChange={() => dataList.multiSelect(submission)}
                                            value={dataList.isMultiSelected(submission)}
                                        />
                                    </ListSelectBox>
                                    <ListItemText onClick={() => selectFormSubmission(submission)}>
                                        <FullName submission={submission} />
                                        <ListTextOverline>
                                            Visitor IP: {submission.meta.ip || "N/A"}
                                        </ListTextOverline>
                                    </ListItemText>
                                    <ListItemMeta className={rightAlign}>
                                        <Typography use={"subtitle2"}>
                                            {t`Submitted: {time}.`({
                                                time: (
                                                    <TimeAgo
                                                        datetime={submission.meta.submittedOn}
                                                    />
                                                )
                                            })}
                                            <br />
                                            <FormVersion submission={submission} />
                                        </Typography>
                                    </ListItemMeta>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DataList>
            </Block>
            <FormSubmissionDialog
                onClose={() => {
                    selectFormSubmission(null);
                }}
                formSubmission={selectedFormSubmission}
            />
        </>
    );
};

export default FormSubmissionsList;
