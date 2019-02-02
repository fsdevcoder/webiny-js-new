// @flow
import { get } from "lodash";
import gql from "graphql-tag";
import { Form } from "webiny-form";
import { Mutation } from "react-apollo";
import React from "react";

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

const RenderMailchimpForm = (props: *) => {
    const { element, theme } = props;
    const { component: selected } = element.settings;
    const component = theme.elements.mailchimp.components.find(cmp => cmp.name === selected);

    if (component) {
        const Component = component.component;
        const style = { width: "100%", ...get(props, "element.settings.style") };
        return (
            <div style={style} className={"webiny-cms-element-mailchimp"}>
                <Mutation mutation={mutation}>
                    {update => (
                        <Form key={component.name}>
                            {({ form, data }) => {
                                return (
                                    <Component
                                        {...form}
                                        submit={async ({
                                            onError,
                                            onSuccess
                                        }: {
                                            onError?: (error: string) => void,
                                            onSuccess?: () => void
                                        }) => {
                                            const isValid = await form.validate();
                                            if (!isValid) {
                                                return;
                                            }

                                            const response = await update({
                                                variables: {
                                                    ...data,
                                                    list: element.settings.list
                                                }
                                            });

                                            const error = get(
                                                response,
                                                "data.mailchimp.addToList.error"
                                            );

                                            if (error) {
                                                onError && onError(error.message);
                                            } else {
                                                onSuccess && onSuccess();
                                            }
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
};

export default RenderMailchimpForm;
