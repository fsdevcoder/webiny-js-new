import * as React from "react";
import { get } from "lodash";
import { Form } from "@webiny/form";
import { Grid, Cell } from "@webiny/ui/Grid";
import { Switch } from "@webiny/ui/Switch";
import { Input } from "@webiny/ui/Input";
import { ButtonPrimary } from "@webiny/ui/Button";
import { Query, Mutation } from "react-apollo";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { CircularProgress } from "@webiny/ui/Progress";
import graphql from "./graphql";

import {
    SimpleForm,
    SimpleFormFooter,
    SimpleFormContent,
    SimpleFormHeader
} from "@webiny/app-admin/components/SimpleForm";

const MailchimpSettings = () => {
    const { showSnackbar } = useSnackbar();

    return (
        <Query query={graphql.query}>
            {({ data, loading: queryInProgress }) => {
                const settings = get(data, "mailchimp.getSettings.data") || {};
                return (
                    <Mutation mutation={graphql.mutation}>
                        {(update, { loading: mutationInProgress }) => (
                            <Form
                                data={settings}
                                onSubmit={async data => {
                                    const response = await update({
                                        variables: {
                                            data
                                        }
                                    });

                                    const error = get(
                                        response,
                                        "data.mailchimp.updateSettings.error.message"
                                    );

                                    if (error) {
                                        return showSnackbar(error);
                                    }
                                    showSnackbar("Settings updated successfully.");
                                }}
                            >
                                {({ Bind, form, data }) => (
                                    <SimpleForm>
                                        {(queryInProgress || mutationInProgress) && (
                                            <CircularProgress />
                                        )}
                                        <SimpleFormHeader title="Mailchimp Settings">
                                            <Bind
                                                name={"enabled"}
                                                afterChange={enabled => {
                                                    if (!enabled) {
                                                        form.submit();
                                                    }
                                                }}
                                            >
                                                <Switch label="Enabled" />
                                            </Bind>
                                        </SimpleFormHeader>
                                        {data.enabled ? (
                                            <>
                                                <SimpleFormContent>
                                                    <Grid>
                                                        <Cell span={12}>
                                                            <Grid>
                                                                <Cell span={6}>
                                                                    <Bind name={"apiKey"}>
                                                                        <Input
                                                                            label="API key"
                                                                            description={
                                                                                <>
                                                                                    Click{" "}
                                                                                    <a
                                                                                        /* eslint-disable-next-line react/jsx-no-target-blank */
                                                                                        target={
                                                                                            "_blank"
                                                                                        }
                                                                                        href="https://mailchimp.com/help/about-api-keys/"
                                                                                    >
                                                                                        here
                                                                                    </a>{" "}
                                                                                    for more
                                                                                    information
                                                                                    about Mailchimp
                                                                                    API keys.
                                                                                </>
                                                                            }
                                                                        />
                                                                    </Bind>
                                                                </Cell>
                                                            </Grid>
                                                        </Cell>
                                                    </Grid>
                                                </SimpleFormContent>
                                                <SimpleFormFooter>
                                                    <ButtonPrimary onClick={form.submit}>
                                                        Save
                                                    </ButtonPrimary>
                                                </SimpleFormFooter>
                                            </>
                                        ) : null}
                                    </SimpleForm>
                                )}
                            </Form>
                        )}
                    </Mutation>
                );
            }}
        </Query>
    );
};

export default MailchimpSettings;
