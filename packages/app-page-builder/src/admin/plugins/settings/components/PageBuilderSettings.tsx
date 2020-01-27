import React from "react";
import { Form } from "@webiny/form";
import { Grid, Cell } from "@webiny/ui/Grid";
import { ButtonPrimary } from "@webiny/ui/Button";
import { Query, Mutation } from "react-apollo";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import graphql from "./graphql";
import { PagesAutocomplete } from "@webiny/app-page-builder/admin/components/PagesAutocomplete";
import { CircularProgress } from "@webiny/ui/Progress";
import SingleImageUpload from "@webiny/app-admin/components/SingleImageUpload";
import { get } from "lodash";

import {
    SimpleForm,
    SimpleFormFooter,
    SimpleFormContent,
    SimpleFormHeader
} from "@webiny/app-admin/components/SimpleForm";

const PageBuilderSettings = () => {
    const { showSnackbar } = useSnackbar();

    return (
        <Query query={graphql.query}>
            {({ data, loading: queryInProgress }) => {
                const settings = get(data, "pageBuilder.getSettings.data") || {};

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
                                        <SimpleFormHeader title="Page Builder Settings" />
                                        <SimpleFormContent>
                                            <Grid>
                                                <Cell span={6}>
                                                    <Grid>
                                                        <Cell span={12}>
                                                            <Bind name={"pages.home"}>
                                                                <PagesAutocomplete
                                                                    label={"Homepage"}
                                                                    description={`This is the homepage of your website.`}
                                                                />
                                                            </Bind>
                                                        </Cell>
                                                        <Cell span={12}>
                                                            <Bind name={"pages.error"}>
                                                                <PagesAutocomplete
                                                                    label={"Error page"}
                                                                    description={`Shown when an error occurs during a page load.`}
                                                                />
                                                            </Bind>
                                                        </Cell>
                                                        <Cell span={12}>
                                                            <Bind name={"pages.notFound"}>
                                                                <PagesAutocomplete
                                                                    label={"Not found (404) page"}
                                                                    description={`Shown when the requested page is not found.`}
                                                                />
                                                            </Bind>
                                                        </Cell>
                                                    </Grid>
                                                </Cell>

                                                <Cell span={6}>
                                                    <Grid>
                                                        <Cell span={12}>
                                                            <Bind name={"social.image"}>
                                                                <SingleImageUpload
                                                                    label="Default Open Graph image"
                                                                    description={`The default OG image for all pages. Recommended resolution 1596x545.`}
                                                                    // TODO: @adrian
                                                                    // imageEditor={{
                                                                    //     crop: {
                                                                    //         autoEnable: true,
                                                                    //         aspectRatio: 1596 / 545
                                                                    //     }
                                                                    // }}
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

export default PageBuilderSettings;
