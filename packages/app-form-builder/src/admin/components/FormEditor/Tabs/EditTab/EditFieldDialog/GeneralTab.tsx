import React, { useEffect, useCallback, useRef } from "react";
import { Input } from "@webiny/ui/Input";
import { Grid, Cell } from "@webiny/ui/Grid";
import { camelCase } from "lodash";
import { useFormEditor } from "@webiny/app-form-builder/admin/components/FormEditor/Context";
import { I18NInput } from "@webiny/app-i18n/admin/components";
import { useI18N } from "@webiny/app-i18n/hooks/useI18N";
import { validation } from "@webiny/validation";
import { FbFormModelField } from "@webiny/app-form-builder/types";
import {FormChildrenFunctionParams} from "@webiny/form/Form";

type GeneralTabProps = {
    field: FbFormModelField;
    form: FormChildrenFunctionParams;
};

const GeneralTab = ({ field, form }: GeneralTabProps) => {
    const { Bind, setValue } = form;
    const inputRef = useRef(null);
    const { getField, getFieldPlugin } = useFormEditor();
    const { getValue } = useI18N();

    const setRef = useCallback(ref => (inputRef.current = ref), []);

    useEffect(() => {
        inputRef.current && inputRef.current.focus();
    }, []);

    const afterChangeLabel = useCallback(value => {
        setValue("fieldId", camelCase(getValue(value)));
    }, []);

    const uniqueFieldIdValidator = useCallback(fieldId => {
        const existingField = getField({ fieldId });
        if (!existingField) {
            return;
        }

        if (existingField._id === field._id) {
            return true;
        }
        throw new Error("Please enter a unique Field ID");
    }, undefined);

    const fieldPlugin = getFieldPlugin({ name: field.name });

    let additionalSettings = null;
    if (typeof fieldPlugin.field.renderSettings === "function") {
        additionalSettings = fieldPlugin.field.renderSettings({
            form,
            afterChangeLabel,
            uniqueFieldIdValidator
        });
    }

    return (
        <>
            <Grid>
                <Cell span={6}>
                    <Bind
                        name={"label"}
                        validators={validation.create("required")}
                        afterChange={afterChangeLabel}
                    >
                        <I18NInput label={"Label"} inputRef={setRef} />
                    </Bind>
                </Cell>
                <Cell span={6}>
                    <Bind
                        name={"fieldId"}
                        validators={[validation.create("required"), uniqueFieldIdValidator]}
                    >
                        <Input label={"Field ID"} />
                    </Bind>
                </Cell>
                <Cell span={12}>
                    <Bind name={"helpText"}>
                        <I18NInput label={"Help text"} description={"Help text (optional)"} />
                    </Bind>
                </Cell>
            </Grid>
            {additionalSettings}
        </>
    );
};

export default GeneralTab;
