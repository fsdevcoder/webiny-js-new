import React from "react";
import styled from "react-emotion";
import { IconButton } from "webiny-ui/Button";
import { Typography } from "webiny-ui/Typography";
import { ReactComponent as EditIcon } from "../../icons/edit.svg";
import { ReactComponent as DeleteIcon } from "../../icons/delete.svg";
import { useI18N } from "webiny-app-forms/__i18n/components";
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
        flex: "1 100%"
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
    const { translate } = useI18N();

    return (
        <FieldContainer>
            <Info>
                <Typography use={"subtitle1"}>{translate(field.label)}</Typography>
            </Info>
            <Actions>
                <IconButton icon={<EditIcon />} onClick={() => onEdit(field)} />
                <IconButton icon={<DeleteIcon />} onClick={() => onDelete(field)} />
            </Actions>
        </FieldContainer>
    );
};

export default Field;
