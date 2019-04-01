// @flow
import * as React from "react";
import { Form } from "webiny-form";
import { Grid, Cell } from "webiny-ui/Grid";
import { ButtonPrimary } from "webiny-ui/Button";
import { Query, Mutation } from "react-apollo";
import { withSnackbar } from "webiny-admin/components";
import graphql from "./graphql";
import PagesAutoComplete from "webiny-app-cms/admin/components/PagesAutoComplete";
import { CircularProgress } from "webiny-ui/Progress";
import Image from "./Image";
import { get } from "lodash";

import {
    SimpleForm,
    SimpleFormFooter,
    SimpleFormContent,
    SimpleFormHeader
} from "webiny-admin/components/SimpleForm";

class CmsSettings extends React.Component<Object, Object> {
    render() {
        const { showSnackbar } = this.props;
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
                                        this.setState({ loading: true });
                                        await update({
                                            variables: {
                                                data
                                            }
                                        });
                                        this.setState({ loading: false });

                                        showSnackbar("Settings updated successfully.");
                                    }}
                                >
                                    {({ Bind, form }) => (
                                        <SimpleForm>
                                            {(queryInProgress || mutationInProgress) && (
                                                <CircularProgress />
                                            )}
                                            <SimpleFormHeader title="CMS Settings" />
                                            <SimpleFormContent>
                                                <Grid>
                                                    <Cell span={6}>
                                                        <Grid>
                                                            <Cell span={12}>
                                                                <Bind name={"pages.home"}>
                                                                    <PagesAutoComplete
                                                                        label={"Homepage"}
                                                                        description={`This is the homepage of your website.`}
                                                                    />
                                                                </Bind>
                                                            </Cell>
                                                            <Cell span={12}>
                                                                <Bind name={"pages.error"}>
                                                                    <PagesAutoComplete
                                                                        label={"Error page"}
                                                                        description={`Shown when an error occurs during a page load.`}
                                                                    />
                                                                </Bind>
                                                            </Cell>
                                                            <Cell span={12}>
                                                                <Bind name={"pages.notFound"}>
                                                                    <PagesAutoComplete
                                                                        label={
                                                                            "Not found (404) page"
                                                                        }
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
                                                                    <Image
                                                                        imageEditor={{
                                                                            crop: {
                                                                                autoEnable: true,
                                                                                aspectRatio:
                                                                                    1596 / 545
                                                                            }
                                                                        }}
                                                                        label="Default Open Graph image"
                                                                        description={`Any CMS page that doesn't have an Open Graph image set, will use this one.`}
                                                                    />
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
    }
}

export default withSnackbar()(CmsSettings);
