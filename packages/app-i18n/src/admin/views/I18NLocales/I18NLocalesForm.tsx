import * as React from "react";
import { i18n } from "@webiny/app/i18n";
import { Form } from "@webiny/form";
import { Grid, Cell } from "@webiny/ui/Grid";
import { ButtonPrimary } from "@webiny/ui/Button";
import { Switch } from "@webiny/ui/Switch";
import { CircularProgress } from "@webiny/ui/Progress";
import LocaleCodesAutoComplete from "./LocaleCodesAutoComplete";
import { useCrud } from "@webiny/app-admin/hooks/useCrud";
import { useI18N } from "@webiny/app-i18n/hooks/useI18N";
import {
    SimpleForm,
    SimpleFormFooter,
    SimpleFormContent,
    SimpleFormHeader
} from "@webiny/app-admin/components/SimpleForm";
import { validation } from "@webiny/validation";

const t = i18n.ns("app-i18n/admin/locales/form");

const I18NLocaleForm = () => {
    const { form: crudForm } = useCrud();
    const { refetchLocales } = useI18N();

    return (
        <Form
            {...crudForm}
            onSubmit={async data => {
                await crudForm.onSubmit(data);
                refetchLocales();
            }}
        >
            {({ data, form, Bind }) => (
                <SimpleForm>
                    {crudForm.loading && <CircularProgress />}
                    <SimpleFormHeader title={data.code || t`New locale`} />
                    <SimpleFormContent>
                        <Grid>
                            <Cell span={12}>
                                <Bind name="code" validators={validation.create("required")}>
                                    <LocaleCodesAutoComplete
                                        label={t`Code`}
                                        description={t`For example: "en-GB"`}
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
                    </SimpleFormContent>
                    <SimpleFormFooter>
                        <ButtonPrimary onClick={form.submit}>{t`Save locale`}</ButtonPrimary>
                    </SimpleFormFooter>
                </SimpleForm>
            )}
        </Form>
    );
};

export default I18NLocaleForm;
