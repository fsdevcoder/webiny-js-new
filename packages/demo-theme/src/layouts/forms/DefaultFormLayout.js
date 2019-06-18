// @flow
// $FlowFixMe
import React, { useState, useCallback } from "react";
import Input from "./fields/Input";
import Select from "./fields/Select";
import Radio from "./fields/Radio";
import Checkbox from "./fields/Checkbox";
import Textarea from "./fields/Textarea";
import { Form } from "webiny-form";

import type { FieldType, FormRenderPropsType } from "webiny-app-forms/types";

function renderField(props: { field: FieldType, bind: Object, validation: Object }) {
    switch (props.field.type) {
        case "text":
            return <Input {...props} />;
        case "textarea":
            return <Textarea {...props} />;
        case "number":
            return <Input type="number" {...props} />;
        case "rich-text":
            return <span>rich text</span>;
        case "select":
            return <Select {...props} />;
        case "radio":
            return <Radio {...props} />;
        case "checkbox":
            return <Checkbox {...props} />;
        case "hidden":
            return <input type={"hidden"} {...props} />;
        default:
            return <span>Cannot render field.</span>;
    }
}

const FormRenderer = ({ getFields, getDefaultValues, submit }: FormRenderPropsType) => {
    const fields = getFields();
    const [loading, setLoading] = useState(false);

    const submitForm = useCallback(async data => {
        setLoading(true);
        await submit(data);
        setLoading(false);
    }, []);

    return (
        <Form onSubmit={submitForm} data={getDefaultValues()}>
            {({ submit, Bind }) => (
                <div className={"webiny-cms-form"}>
                    {loading && <span>Loading...</span>}
                    <div>
                        {fields.map((row, rowIndex) => (
                            <div
                                key={rowIndex}
                                className={"webiny-cms-base-element-style webiny-cms-layout-row"}
                            >
                                {row.map(field => (
                                    <div
                                        key={field.id}
                                        className={
                                            "webiny-cms-base-element-style webiny-cms-layout-column"
                                        }
                                    >
                                        <Bind name={field.fieldId} validators={field.validators}>
                                            {({ validation, ...bind }) => (
                                                <React.Fragment>
                                                    {/* Render input or whatever */}
                                                    {renderField({ field, bind, validation })}
                                                    {/* Render validation message */}
                                                    {validation.valid === false
                                                        ? validation.message
                                                        : null}
                                                </React.Fragment>
                                            )}
                                        </Bind>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div>
                        <button
                            className={
                                "webiny-cms-element-button webiny-cms-element-button--primary"
                            }
                            onClick={submit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </Form>
    );
};

export default FormRenderer;
