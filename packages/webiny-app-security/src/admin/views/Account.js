// @flow
import * as React from "react";
import gql from "graphql-tag";
import { pick } from "lodash";
import { get } from "dot-prop-immutable";
import { graphql } from "react-apollo";
import { withSecurity } from "webiny-app-security/components";
import { i18n } from "webiny-app/i18n";
import { Form } from "webiny-form";
import { Grid, Cell } from "webiny-ui/Grid";
import { Input } from "webiny-ui/Input";
import { ButtonPrimary } from "webiny-ui/Button";
import { withSnackbar } from "webiny-admin/components";
import { compose, withHandlers, withState } from "recompose";
import { CircularProgress } from "webiny-ui/Progress";
import AvatarImage from "./Components/AvatarImage";

import {
    SimpleForm,
    SimpleFormHeader,
    SimpleFormFooter,
    SimpleFormContent
} from "webiny-admin/components/SimpleForm";

const t = i18n.namespace("Security.UsersForm");

const UsersForm = ({ onSubmit, user, loading }: Object) => (
    <Form data={user.data} onSubmit={onSubmit}>
        {({ data, form, Bind }) => (
            <SimpleForm>
                {loading && <CircularProgress />}
                <SimpleFormHeader title={"Account"} />
                <SimpleFormContent>
                    <Grid>
                        <Cell span={3}>
                            <Grid>
                                <Cell span={12}>
                                    <Bind name="avatar">
                                        <AvatarImage />
                                    </Bind>
                                </Cell>
                            </Grid>
                        </Cell>
                        <Cell span={9}>
                            <Grid>
                                <Cell span={12}>
                                    <Bind name="email" validators={["required"]}>
                                        <Input label={t`E-mail`} />
                                    </Bind>
                                </Cell>
                                <Cell span={12}>
                                    <Bind name="password" validators={["password"]}>
                                        <Input
                                            autoComplete="off"
                                            description={
                                                data.id && t`Type a new password to reset it.`
                                            }
                                            type="password"
                                            label={t`Password`}
                                        />
                                    </Bind>
                                </Cell>

                                <Cell span={12}>
                                    <Bind name="firstName">
                                        <Input label={t`First Name`} />
                                    </Bind>
                                </Cell>
                                <Cell span={12}>
                                    <Bind name="lastName">
                                        <Input label={t`Last name`} />
                                    </Bind>
                                </Cell>
                            </Grid>
                        </Cell>
                    </Grid>
                </SimpleFormContent>
                <SimpleFormFooter>
                    <ButtonPrimary type="primary" onClick={form.submit} align="right">
                        {t`Update account`}
                    </ButtonPrimary>
                </SimpleFormFooter>
            </SimpleForm>
        )}
    </Form>
);

const fields = `
    data {
        id email firstName lastName avatar { src } 
    }
    error {
        code
        message
    }
`;

const getCurrentUser = gql`
{
    security {
        getCurrentUser {
            ${fields}
        }
    }
}
`;

const updateCurrentUser = gql`
    mutation updateMe($data: CurrentUserInput!) {
        security {
            updateCurrentUser(data: $data) {
               ${fields}
            }
        }
    }
`;

export default compose(
    withSnackbar(),
    withSecurity(),
    withState("loading", "setLoading", null),
    graphql(getCurrentUser, {
        props: ({ data }) => ({
            user: get(data, "security.getCurrentUser") || { data: {} }
        })
    }),
    graphql(updateCurrentUser, { name: "updateCurrentUser" }),
    withHandlers({
        onSubmit: ({ setLoading, updateCurrentUser, showSnackbar }) => async formData => {
            setLoading(true);
            const { data: response } = await updateCurrentUser({
                variables: { data: pick(formData, ["email", "firstName", "lastName", "avatar"]) }
            });
            const { error } = response.security.updateCurrentUser;
            setLoading(false);
            if (error) {
                return showSnackbar(error.message, {
                    actionText: "Close"
                });
            }

            showSnackbar("Account saved successfully!");
        }
    })
)(UsersForm);
