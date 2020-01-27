import React, { useState } from "react";
import { useApolloClient } from "react-apollo";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { get } from "lodash";
import { css } from "emotion";
import { Grid, Cell } from "@webiny/ui/Grid";
import { Typography } from "@webiny/ui/Typography";
import { useHandler } from "@webiny/app/hooks/useHandler";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { AutoComplete } from "@webiny/ui/AutoComplete";
import { getPlugins } from "@webiny/plugins";
import { Form } from "@webiny/form";
import { Input } from "@webiny/ui/Input";
import { ButtonPrimary } from "@webiny/ui/Button";
import { CircularProgress } from "@webiny/ui/Progress";
import MailchimpElement from "./MailchimpElement";
import settingsGql from "./graphql";
import { validation } from "@webiny/validation";
import { PbPageElementMailchimpComponentPlugin } from "../../types";

const formPreview = css({
    padding: 25,
    border: "1px solid var(--mdc-theme-background)",
    overflow: "scroll"
});

const saveApiKeyButtonWrapper = css({
    textAlign: "right",
    marginTop: 10
});

const enableMailchimpLink = css({
    cursor: "pointer"
});

const MAILCHIMP_SETTINGS = gql`
    {
        mailchimp {
            getSettings {
                data {
                    enabled
                    apiKey
                }
            }
            listLists {
                data {
                    id
                    name
                }
            }
        }
    }
`;

const MailchimpElementAdvancedSettings = ({ Bind }) => {
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();
    const client = useApolloClient();

    const submitApiKeyForm = useHandler({}, () => async ({ data = {}, settingsLists }) => {
        setLoading(true);
        const response = await client.mutate({
            mutation: settingsGql.mutation,
            variables: { data: { ...data, enabled: true } }
        });
        setLoading(false);
        const error = get(response, "data.mailchimp.updateSettings.error");
        if (error) {
            showSnackbar(error.message);
        } else {
            showSnackbar("Settings updated successfully.");
            settingsLists.refetch();
        }
    });

    return (
        <Query query={MAILCHIMP_SETTINGS}>
            {settingsLists => {
                const { apiKey, enabled } =
                    get(settingsLists.data, "mailchimp.getSettings.data") || {};

                return (
                    <>
                        <Grid>
                            {(loading || settingsLists.loading) && <CircularProgress />}
                            {apiKey && enabled ? (
                                <>
                                    <Cell span={12}>
                                        <Bind
                                            name={"settings.list"}
                                            validators={validation.create("required")}
                                        >
                                            {({ value: id, onChange, ...rest }) => {
                                                const options = (
                                                    get(
                                                        settingsLists.data,
                                                        "mailchimp.listLists.data"
                                                    ) || []
                                                ).map(({ id, name }) => ({ id, name }));

                                                const value = options.find(item => item.id === id);

                                                return (
                                                    <AutoComplete
                                                        disabled={!apiKey}
                                                        options={options}
                                                        value={value}
                                                        onChange={onChange}
                                                        label={"Mailchimp list"}
                                                        {...rest}
                                                    />
                                                );
                                            }}
                                        </Bind>
                                    </Cell>
                                    <Cell span={12}>
                                        <Bind
                                            name={"settings.component"}
                                            validators={validation.create("required")}
                                        >
                                            {({ onChange, value: name, ...rest }) => {
                                                const options = getPlugins<
                                                    PbPageElementMailchimpComponentPlugin
                                                >("pb-page-element-mailchimp-component").map(
                                                    ({ componentName, title }) => {
                                                        return {
                                                            name: componentName,
                                                            title
                                                        };
                                                    }
                                                );

                                                const value = options.find(
                                                    item => item.name === name
                                                );

                                                return (
                                                    <AutoComplete
                                                        disabled={!apiKey}
                                                        value={value}
                                                        options={options}
                                                        onChange={onChange}
                                                        textProp="title"
                                                        valueProp="name"
                                                        label="Mailchimp component"
                                                        description="Select a component that renders the signup form."
                                                        {...rest}
                                                    />
                                                );
                                            }}
                                        </Bind>
                                    </Cell>
                                    <Cell span={12} className={formPreview}>
                                        <span>
                                            <Typography use={"overline"}>Form preview</Typography>
                                        </span>
                                        <Bind name={"settings"}>
                                            {({ value }) => (
                                                <div>
                                                    <MailchimpElement
                                                        element={{ settings: value }}
                                                    />
                                                </div>
                                            )}
                                        </Bind>
                                    </Cell>
                                </>
                            ) : (
                                <>
                                    {!apiKey ? (
                                        <>
                                            <Cell span={12}>
                                                Before continuing, please enter a{" "}
                                                <a
                                                    target={"_blank"}
                                                    href="https://mailchimp.com/help/about-api-keys/"
                                                >
                                                    Mailchimp API key
                                                </a>
                                                .
                                            </Cell>
                                            <Cell span={12}>
                                                <Form
                                                    onSubmit={data =>
                                                        submitApiKeyForm({
                                                            data,
                                                            settingsLists
                                                        })
                                                    }
                                                >
                                                    {({ Bind, submit }) => (
                                                        <>
                                                            <Cell span={12}>
                                                                <Bind
                                                                    validators={validation.create(
                                                                        "required"
                                                                    )}
                                                                    name={"apiKey"}
                                                                >
                                                                    <Input label="API key" />
                                                                </Bind>
                                                            </Cell>
                                                            <Cell
                                                                span={12}
                                                                className={saveApiKeyButtonWrapper}
                                                            >
                                                                <ButtonPrimary onClick={submit}>
                                                                    Save API key
                                                                </ButtonPrimary>
                                                            </Cell>
                                                        </>
                                                    )}
                                                </Form>
                                            </Cell>
                                        </>
                                    ) : (
                                        <>
                                            <Cell span={12}>
                                                Before continuing, please{" "}
                                                <a
                                                    className={enableMailchimpLink}
                                                    onClick={() =>
                                                        submitApiKeyForm({
                                                            settingsLists
                                                        })
                                                    }
                                                >
                                                    enable
                                                </a>{" "}
                                                the Mailchimp integration.
                                            </Cell>
                                        </>
                                    )}
                                </>
                            )}
                        </Grid>
                    </>
                );
            }}
        </Query>
    );
};

export default MailchimpElementAdvancedSettings;
