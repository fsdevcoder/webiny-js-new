// @flow
// $FlowFixMe
import React, { useEffect } from "react";
import { get, cloneDeep } from "lodash";
import { withCms } from "webiny-app-cms/context";
import { onFormMounted, createFormSubmission, handleFormTriggers } from "./functions";
import { withApollo } from "react-apollo";
import { getPlugins } from "webiny-plugins";
import { I18NValue } from "webiny-app-i18n/components";
import { compose } from "recompose";
import type { FormRenderPropsType, FormRenderComponentPropsType } from "webiny-app-forms/types";

const FormRender = compose(
    withCms(),
    withApollo
)((props: FormRenderComponentPropsType) => {
    if (!props.data) {
        // TODO: handle this
        return null;
    }

    const data = cloneDeep(props.data);
    const { layout, fields, settings } = data;

    useEffect(() => onFormMounted(props), [data.id]);

    const getFieldById = id => {
        return fields.find(field => field._id === id);
    };

    const getFieldByFieldId = id => {
        return fields.find(field => field.fieldId === id);
    };

    const getFields = () => {
        const fields = cloneDeep(layout);
        const validatorPlugins = getPlugins("form-field-validator");

        fields.forEach(row => {
            row.forEach((id, idIndex) => {
                row[idIndex] = getFieldById(id);
                row[idIndex].validators = row[idIndex].validation
                    .map(item => {
                        const validatorPlugin = validatorPlugins.find(
                            plugin => plugin.validator.name === item.name
                        );

                        if (
                            !validatorPlugin ||
                            typeof validatorPlugin.validator.validate !== "function"
                        ) {
                            return;
                        }

                        return async value => {
                            let isInvalid = true;
                            try {
                                const result = await validatorPlugin.validator.validate(
                                    value,
                                    item
                                );
                                isInvalid = result === false;
                            } catch (e) {
                                isInvalid = true;
                            }

                            if (isInvalid) {
                                throw new Error(
                                    I18NValue({ value: item.message }) || "Invalid value."
                                );
                            }
                        };
                    })
                    .filter(Boolean);
            });
        });
        return fields;
    };

    const getDefaultValues = (overrides = {}) => {
        const values = {};
        fields.forEach(field => {
            if (
                "defaultValue" in field.settings &&
                typeof field.settings.defaultValue !== "undefined"
            ) {
                values[field.fieldId] = field.settings.defaultValue;
            }
        });
        return { ...values, ...overrides };
    };

    const submit = async data => {
        const formSubmission = await createFormSubmission({ props, data });
        await handleFormTriggers({ props, data, formSubmission });
        return formSubmission;
    };

    // Get form layout, defined in theme.
    let LayoutRenderComponent = get(props.cms, "theme.forms.layouts", []).find(
        item => item.name === settings.layout.renderer
    );

    if (!LayoutRenderComponent) {
        return <span>Cannot render form, layout missing.</span>;
    }

    LayoutRenderComponent = LayoutRenderComponent.component;

    const layoutProps: FormRenderPropsType = {
        getFieldById,
        getFieldByFieldId,
        getDefaultValues,
        getFields,
        submit,
        form: data
    };

    return <LayoutRenderComponent {...layoutProps} />;
});

export default FormRender;
