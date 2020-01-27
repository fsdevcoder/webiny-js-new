import React, { useMemo } from "react";
import { getPlugins } from "@webiny/plugins";
import { Switch } from "@webiny/ui/Switch";
import {
    SimpleForm,
    SimpleFormContent,
    SimpleFormHeader
} from "@webiny/app-admin/components/SimpleForm";
import { useFormEditor } from "@webiny/app-form-builder/admin/components/FormEditor/Context";
import { Form } from "@webiny/form";
import { cloneDeep, debounce } from "lodash";
import { Grid, Cell } from "@webiny/ui/Grid";
import { I18NInput } from "@webiny/app-i18n/admin/components";
import { useI18N } from "@webiny/app-i18n/hooks/useI18N";
import { validation } from "@webiny/validation";
import { FbBuilderFormFieldValidatorPlugin } from "@webiny/app-form-builder/types";

const onEnabledChange = ({ i18n, data, validationValue, onChangeValidation, validator }) => {
    if (data) {
        const index = validationValue.findIndex(item => item.name === validator.name);
        onChangeValidation([
            ...validationValue.slice(0, index),
            ...validationValue.slice(index + 1)
        ]);
    } else {
        onChangeValidation([
            ...validationValue,
            {
                name: validator.name,
                settings: validator.defaultSettings,
                message: {
                    values: [
                        {
                            locale: i18n.getDefaultLocale().id,
                            value: validator.defaultMessage
                        }
                    ]
                }
            }
        ]);
    }
};

const onFormChange = debounce(({ data, validationValue, onChangeValidation, validatorIndex }) => {
    const newValidationValue = cloneDeep(validationValue);
    newValidationValue[validatorIndex] = {
        ...newValidationValue[validatorIndex],
        ...cloneDeep(data)
    };
    onChangeValidation(newValidationValue);
}, 200);

const ValidatorsTab = props => {
    const i18n = useI18N();
    const { getFieldPlugin } = useFormEditor();
    const {
        field,
        form: { Bind }
    } = props;

    const fieldPlugin = getFieldPlugin({ name: field.name });

    const validators = useMemo(() => {
        return getPlugins<FbBuilderFormFieldValidatorPlugin>("form-editor-field-validator")
            .map(plugin => plugin.validator)
            .map(validator => {
                if (fieldPlugin.field.validators.includes(validator.name)) {
                    return { optional: true, validator };
                } else if (fieldPlugin.field.validators.includes(`!${validator.name}`)) {
                    return { optional: false, validator };
                }
                return null;
            })
            .filter(Boolean)
            .sort((a, b) => {
                if (!a.optional && b.optional) {
                    return -1;
                }

                if (a.optional && !b.optional) {
                    return 1;
                }

                return 0;
            });
    }, []);

    return (
        <Bind name={"validation"}>
            {({ value: validationValue, onChange: onChangeValidation }) =>
                validators.map(({ optional, validator }) => {
                    const validatorIndex = validationValue.findIndex(
                        item => item.name === validator.name
                    );
                    const data = validationValue[validatorIndex];

                    return (
                        <SimpleForm key={validator.name}>
                            {/*TODO: @ts-adrian nema descriptiona?*/}
                            <SimpleFormHeader title={validator.label}>
                                {optional && (
                                    <Switch
                                        label="Enabled"
                                        value={validatorIndex >= 0}
                                        onChange={() =>
                                            onEnabledChange({
                                                i18n,
                                                data,
                                                validationValue,
                                                onChangeValidation,
                                                validator
                                            })
                                        }
                                    />
                                )}
                            </SimpleFormHeader>
                            {data && (
                                <Form
                                    data={data}
                                    onChange={data =>
                                        onFormChange({
                                            data,
                                            validationValue,
                                            onChangeValidation,
                                            validatorIndex
                                        })
                                    }
                                >
                                    {({ Bind, setValue }) => (
                                        <SimpleFormContent>
                                            <Grid>
                                                <Cell span={12}>
                                                    {/*TODO: @ts-adrian kako ovo?*/}
                                                    <Bind
                                                        name={"message"}
                                                        validators={validation.create("required")}
                                                    >
                                                        <I18NInput
                                                            label={"Message"}
                                                            description={
                                                                "This message will be displayed to the user"
                                                            }
                                                        />
                                                    </Bind>
                                                </Cell>
                                            </Grid>

                                            {typeof validator.renderSettings === "function" &&
                                                validator.renderSettings({
                                                    setValue,
                                                    setMessage: message => {
                                                        setValue("message", {
                                                            values: [
                                                                {
                                                                    locale: i18n.getDefaultLocale()
                                                                        .id,
                                                                    value: message
                                                                }
                                                            ]
                                                        });
                                                    },
                                                    data,
                                                    Bind
                                                })}
                                        </SimpleFormContent>
                                    )}
                                </Form>
                            )}
                        </SimpleForm>
                    );
                })
            }
        </Bind>
    );
};

export default ValidatorsTab;
