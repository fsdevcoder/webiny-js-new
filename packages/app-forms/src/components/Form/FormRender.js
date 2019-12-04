// @flow
// $FlowFixMe
import React, { useEffect, useRef } from "react";
import { useApolloClient } from "react-apollo";
import { get, cloneDeep } from "lodash";
import { usePageBuilder } from "@webiny/app-page-builder/hooks/usePageBuilder";
import { getPlugins } from "@webiny/plugins";
import { I18NValue } from "@webiny/app-i18n/components";
import { createTermsOfServiceComponent, createReCaptchaComponent } from "./components";
import {
    onFormMounted,
    createFormSubmission,
    handleFormTriggers,
    reCaptchaEnabled,
    termsOfServiceEnabled
} from "./functions";

import type {
    FormRenderPropsType,
    FormRenderComponentPropsType,
    FormSubmitResponseType,
    FormDataType,
    FormSubmissionData
} from "@webiny/app-forms/types";

const FormRender = (props: FormRenderComponentPropsType) => {
    const { theme } = usePageBuilder();
    const client = useApolloClient();
    const data = props.data || {};

    useEffect(() => {
        if (data.id) {
            onFormMounted({ ...props, client });
        }
    }, [data.id]);

    const reCaptchaResponseToken = useRef("");
    const termsOfServiceAccepted = useRef(false);

    if (!data.id) {
        return null;
    }

    const formData: FormDataType = cloneDeep(data);
    const { layout, fields, settings } = formData;

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
            const fieldId = field.fieldId;

            if (
                fieldId &&
                "defaultValue" in field.settings &&
                typeof field.settings.defaultValue !== "undefined"
            ) {
                values[fieldId] = field.settings.defaultValue;
            }
        });
        return { ...values, ...overrides };
    };

    const submit = async (data: FormSubmissionData): Promise<FormSubmitResponseType> => {
        if (reCaptchaEnabled(formData) && !reCaptchaResponseToken.current) {
            return {
                data: null,
                preview: Boolean(props.preview),
                error: {
                    code: "RECAPTCHA_NOT_PASSED",
                    message: settings.reCaptcha.errorMessage
                }
            };
        }

        if (termsOfServiceEnabled(formData) && !termsOfServiceAccepted.current) {
            return {
                data: null,
                preview: Boolean(props.preview),
                error: {
                    code: "TOS_NOT_ACCEPTED",
                    message: settings.termsOfServiceMessage.errorMessage
                }
            };
        }

        const formSubmission = await createFormSubmission({
            client,
            props,
            data,
            reCaptchaResponseToken: reCaptchaResponseToken.current
        });

        await handleFormTriggers({ props, data, formSubmission });
        return formSubmission;
    };

    const layoutsFromTheme = get(theme, "forms.layouts") || [];
    const layoutsFromPlugins = getPlugins("form-layout");
    const layouts = [...layoutsFromTheme, ...layoutsFromPlugins];

    // Get form layout, defined in theme.
    let LayoutRenderComponent = layouts.find(item => item.name === settings.layout.renderer);

    if (!LayoutRenderComponent) {
        return <span>Cannot render form, layout missing.</span>;
    }

    LayoutRenderComponent = LayoutRenderComponent.component;

    const ReCaptcha = createReCaptchaComponent({
        props,
        formData,
        setResponseToken: value => (reCaptchaResponseToken.current = value)
    });

    const TermsOfService = createTermsOfServiceComponent({
        props,
        formData,
        setTermsOfServiceAccepted: value => (termsOfServiceAccepted.current = value)
    });

    const layoutProps: FormRenderPropsType = {
        getFieldById,
        getFieldByFieldId,
        getDefaultValues,
        getFields,
        submit,
        formData,
        ReCaptcha,
        TermsOfService
    };

    return <LayoutRenderComponent {...layoutProps} />;
};

export default FormRender;
