// @flow
import * as React from "react";
import { Form } from "webiny-form";
import { Input } from "webiny-ui/Input";
import { Typography } from "webiny-ui/Typography";
import { Grid, Cell } from "webiny-ui/Grid";
import { ButtonSecondary, ButtonPrimary } from "webiny-ui/Button";

const LinkForm = ({ data, onSubmit, onCancel }: Object) => {
    return (
        <Form data={data} onSubmit={onSubmit}>
            {({ submit, Bind }) => (
                <>
                    <Grid>
                        <Cell span={12}>
                            <Typography use={"overline"}>Link menu item</Typography>
                        </Cell>
                    </Grid>
                    <Grid>
                        <Cell span={12}>
                            <Bind name="title" validators={["required"]}>
                                <Input label="Title" />
                            </Bind>
                        </Cell>
                    </Grid>
                    <Grid>
                        <Cell span={12}>
                            <Bind name="url" validators={["required", "url"]}>
                                <Input label="URL" />
                            </Bind>
                        </Cell>
                    </Grid>
                    <Grid>
                        <Cell span={12}>
                            <ButtonSecondary onClick={onCancel}>Cancel</ButtonSecondary>
                            <ButtonPrimary onClick={submit} style={{ float: "right" }}>
                                Save menu item
                            </ButtonPrimary>
                        </Cell>
                    </Grid>
                </>
            )}
        </Form>
    );
};

export default LinkForm;
