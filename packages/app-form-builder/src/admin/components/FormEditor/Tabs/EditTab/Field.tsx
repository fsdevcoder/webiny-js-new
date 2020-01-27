import React from "react";
import styled from "@emotion/styled";
import { IconButton } from "@webiny/ui/Button";
import { Typography } from "@webiny/ui/Typography";
import { ReactComponent as EditIcon } from "../../icons/edit.svg";
import { ReactComponent as DeleteIcon } from "../../icons/delete.svg";
import { useI18N } from "@webiny/app-i18n/hooks/useI18N";
import { useFormEditor } from "@webiny/app-form-builder/admin/components/FormEditor/Context";

const FieldContainer = styled("div")({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
});

const Info = styled("div")({
    display: "flex",
    flexDirection: "column",
    "> *": {
        flex: "1 100%",
        lineHeight: "150%"
    }
});

const Actions = styled("div")({
    display: "flex",
    flexDirection: "row",
    alignItems: "right",
    "> *": {
        flex: "1 100%"
    }
});

const Field = props => {
    const { field, onEdit, onDelete } = props;
    const { getValue } = useI18N();
    const { getFieldPlugin } = useFormEditor();

    const fieldPlugin = getFieldPlugin({ name: field.name });
    return (
        <FieldContainer>
            <Info>
                <Typography use={"subtitle1"}>{getValue(field.label)}</Typography>
                <Typography use={"caption"}>{fieldPlugin && fieldPlugin.field.label}</Typography>
            </Info>
            <Actions>
                <IconButton icon={<EditIcon />} onClick={() => onEdit(field)} />
                <IconButton icon={<DeleteIcon />} onClick={() => onDelete(field)} />
            </Actions>
        </FieldContainer>
    );
};

export default Field;
