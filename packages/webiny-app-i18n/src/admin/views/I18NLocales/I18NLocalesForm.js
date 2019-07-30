// @flow
import * as React from "react";
import { i18n } from "webiny-app/i18n";
import { Form } from "webiny-form";
import { Grid, Cell } from "webiny-ui/Grid";
import { ButtonPrimary } from "webiny-ui/Button";
import { Switch } from "webiny-ui/Switch";
import type { WithCrudFormProps } from "webiny-admin/components";
import { CircularProgress } from "webiny-ui/Progress";
import LocaleCodesAutoComplete from "./LocaleCodesAutoComplete";
import { I18NInput } from "webiny-app-i18n/admin/components";
import {
    SimpleForm,
    SimpleFormFooter,
    SimpleFormContent,
    SimpleFormHeader
} from "webiny-admin/components/SimpleForm";

const t = i18n.namespace("I18N.I18NLocalesForm");

const I18NLocaleForm = ({ onSubmit, loading, data, invalidFields }: WithCrudFormProps) => {
    return (
        <Form invalidFields={invalidFields} data={data} onSubmit={onSubmit}>
            {({ data, form, Bind }) => (
                <SimpleForm>
                    {loading && <CircularProgress />}
                    <SimpleFormHeader title={data.code || "New Locale"} />
                    <SimpleFormContent>
                        <Grid>
                            <Cell span={12}>
                                <Bind name="code" validators={["required"]}>
                                    <LocaleCodesAutoComplete
                                        label={t`Code`}
                                        description={`For example: "en-GB"`}
                                    />
                                </Bind>
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell span={12}>
                                <Bind name="default">
                                    <Switch label={t`Default`} />
                                </Bind>
                            </Cell>
                        </Grid>

                        {/* TODO: @sven*/}
                        <Grid>
                            <Cell span={12}>
                                <Bind name="simpleText">
                                    <I18NInput label={"Simple text"} />
                                </Bind>
                            </Cell>
                            <Cell span={12}>
                                <Bind name="simpleText">
                                    <Bind name="richText">
                                        <I18NInput label={"Rich text"} richText />
                                    </Bind>
                                </Bind>
                            </Cell>
                        </Grid>
                    </SimpleFormContent>
                    <SimpleFormFooter>
                        <ButtonPrimary type="primary" onClick={form.submit} align="right">
                            {t`Save locale`}
                        </ButtonPrimary>
                    </SimpleFormFooter>
                </SimpleForm>
            )}
        </Form>
    );
};

export default I18NLocaleForm;
