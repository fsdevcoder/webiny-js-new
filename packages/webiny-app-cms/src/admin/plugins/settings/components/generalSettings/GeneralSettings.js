// @flow
import * as React from "react";
import { Form } from "webiny-form";
import { Grid, Cell } from "webiny-ui/Grid";
import { Input } from "webiny-ui/Input";
import { ButtonPrimary } from "webiny-ui/Button";
import Image from "./Image";
import { Query, Mutation } from "react-apollo";
import { withSnackbar } from "webiny-admin/components";
import graphql from "./graphql";
import { CircularProgress } from "webiny-ui/Progress";
import { get } from "lodash";

import {
    SimpleForm,
    SimpleFormFooter,
    SimpleFormContent,
    SimpleFormHeader
} from "webiny-admin/components/SimpleForm";

const GeneralSettings = ({ showSnackbar }) => {
    return (
        <Query query={graphql.query}>
            {({ data, loading: queryInProgress }) => {
                const settings = get(data, "settings.cms.data") || {};
                return (
                    <Mutation mutation={graphql.mutation}>
                        {(update, { loading: mutationInProgress }) => (
                            <Form
                                data={settings}
                                onSubmit={async data => {
                                    await update({
                                        variables: {
                                            data
                                        }
                                    });
                                    showSnackbar("Settings updated successfully.");
                                }}
                            >
                                {({ Bind, form }) => (
                                    <SimpleForm>
                                        {(queryInProgress || mutationInProgress) && (
                                            <CircularProgress />
                                        )}
                                        <SimpleFormHeader title={`General Settings`} />
                                        <SimpleFormContent>
                                            <Grid>
                                                <Cell span={6}>
                                                    <Grid>
                                                        <Cell span={12}>
                                                            <Bind name={"name"}>
                                                                <Input
                                                                    validators={["required", "url"]}
                                                                    label="Website name"
                                                                />
                                                            </Bind>
                                                        </Cell>
                                                        <Cell span={6}>
                                                            <Bind name={"favicon"}>
                                                                <Image
                                                                    label="Favicon"
                                                                    accept={["image/png"]}
                                                                />
                                                            </Bind>
                                                        </Cell>
                                                        <Cell span={6}>
                                                            <Bind name={"logo"}>
                                                                <Image label="Logo" />
                                                            </Bind>
                                                        </Cell>
                                                    </Grid>
                                                </Cell>

                                                <Cell span={6}>
                                                    <Grid>
                                                        <Cell span={12}>
                                                            <Bind
                                                                name={"social.facebook"}
                                                                validators={["url"]}
                                                            >
                                                                <Input label="Facebook" />
                                                            </Bind>
                                                        </Cell>
                                                        <Cell span={12}>
                                                            <Bind
                                                                name={"social.twitter"}
                                                                validators={["url"]}
                                                            >
                                                                <Input label="Twitter" />
                                                            </Bind>
                                                        </Cell>
                                                        <Cell span={12}>
                                                            <Bind
                                                                name={"social.instagram"}
                                                                validators={["url"]}
                                                            >
                                                                <Input label="Instagram" />
                                                            </Bind>
                                                        </Cell>
                                                    </Grid>
                                                </Cell>
                                            </Grid>
                                        </SimpleFormContent>
                                        <SimpleFormFooter>
                                            <ButtonPrimary
                                                type="primary"
                                                onClick={form.submit}
                                                align="right"
                                            >
                                                Save
                                            </ButtonPrimary>
                                        </SimpleFormFooter>
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

export default withSnackbar()(GeneralSettings);
