import { get } from "lodash";
import gql from "graphql-tag";
import { Form } from "@webiny/form";
import { Mutation } from "react-apollo";
import React from "react";
import { getPlugins } from "@webiny/plugins";
import { PbPageElementMailchimpComponentPlugin } from "../../types";

const mutation = gql`
    mutation addToList($email: String!, $list: String!) {
        mailchimp {
            addToList(email: $email, list: $list) {
                error {
                    message
                }
            }
        }
    }
`;

export class RenderMailchimpForm extends React.Component<any, { processing: boolean }> {
    state = { processing: false };

    render() {
        const { element } = this.props;
        const selected = get(element, "data.settings.component") || "";
        const component = getPlugins<PbPageElementMailchimpComponentPlugin>(
            "pb-page-element-mailchimp-component"
        ).find(cmp => cmp.componentName === selected);

        if (component) {
            const Component = component.component;
            const style = { width: "100%", ...get(this.props, "element.data.settings.style") };
            return (
                <div style={style} className={"webiny-pb-page-element-mailchimp"}>
                    <Mutation mutation={mutation}>
                        {update => (
                            <Form key={component.name}>
                                {({ form, data }) => {
                                    return (
                                        <Component
                                            {...form}
                                            processing={this.state.processing}
                                            submit={async ({
                                                onError,
                                                onSuccess
                                            }: {
                                                onError?: (error: string) => void;
                                                onSuccess?: () => void;
                                            }) => {
                                                const isValid = await form.validate();
                                                if (!isValid) {
                                                    return;
                                                }

                                                this.setState({ processing: true });
                                                const response = await update({
                                                    variables: {
                                                        ...data,
                                                        list: element.data.settings.list
                                                    }
                                                });

                                                this.setState({ processing: false }, () => {
                                                    const error = get(
                                                        response,
                                                        "data.mailchimp.addToList.error"
                                                    );

                                                    if (error) {
                                                        onError && onError(error.message);
                                                    } else {
                                                        form.setState(state => {
                                                            state.data.email = "";
                                                            return state;
                                                        });
                                                        onSuccess && onSuccess();
                                                    }
                                                });
                                            }}
                                        />
                                    );
                                }}
                            </Form>
                        )}
                    </Mutation>
                </div>
            );
        }

        return null;
    }
}