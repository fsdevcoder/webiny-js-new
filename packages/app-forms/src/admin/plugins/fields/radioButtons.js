// @flow
import React from "react";
import { Grid, Cell } from "@webiny/ui/Grid";
import { ReactComponent as Icon } from "./icons/round-radio_button_checked-24px.svg";
import OptionsList from "./components/OptionsList";
import type { FormEditorFieldPluginType } from "@webiny/app-forms/types";

export default ({
    type: "form-editor-field-type",
    name: "form-editor-field-type-radio",
    field: {
        type: "radio",
        name: "radio",
        validators: ["required"],
        label: "Radio",
        description: "Choose a single option",
        icon: <Icon />,
        createField() {
            return {
                type: this.type,
                name: this.name,
                validation: [],
                settings: {
                    defaultValue: []
                }
            };
        },
        renderSettings({ form }) {
            return (
                <Grid>
                    <Cell span={12}>
                        <OptionsList form={form} />
                    </Cell>
                </Grid>
            );
        }
    }
}:FormEditorFieldPluginType);
