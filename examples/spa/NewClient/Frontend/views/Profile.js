import React from "react";
import { app, createComponent, i18n } from "webiny-client";
import { ModalComponent } from "webiny-client-ui";
import CustomDialog from "./CustomDialog";

class Profile extends React.Component {
    showDialog(name) {
        return () => app.services.get("modal").show(name);
    }

    render() {
        const {
            Ui: {
                AdminLayout,
                Form,
                View,
                Grid,
                Avatar,
                Section,
                Input,
                Button,
                Password,
                Switch,
                Modal,
                ClickConfirm,
                ClickSuccess,
                ChangeConfirm,
                CheckboxGroup,
                Dynamic,
                Gallery,
                ButtonGroup,
                File,
                RadioGroup,
                Select,
                IconPicker,
                Tabs,
                Tags,
                Tile,
                ViewSwitcher
            }
        } = this.props;

        const formProps = {
            api: "/security/users",
            connectToRouter: true,
            fields: "id,firstName,lastName,email,enabled"
        };

        const msg = data => (
            <span>
                Your purchase is now completed!<br />
                Transaction status: <strong>{data.status}</strong>
                <br />
                Thank you for shopping with us!
            </span>
        );

        const checkboxGroup = {
            label: "Select owners",
            name: "owners",
            api: "/security/users",
            fields: "id,email",
            sort: "email",
            perPage: 5,
            textAttr: "email",
            filterBy: "enabled"
        };

        const selectProps = {
            label: "Select assignee",
            placeholder: "Select a value",
            name: "assignee",
            api: "/security/users",
            fields: "id,email",
            sort: "email",
            perPage: 100,
            textAttr: "email",
            filterBy: "enabled"
        };

        const radioGroup = {
            label: "Select assignee",
            name: "assignee",
            api: "/security/users",
            fields: "id,email",
            sort: "email",
            perPage: 5,
            textAttr: "email",
            filterBy: "enabled",
            renderRadioLabel() {
                const { option } = this.props;
                return (
                    <span>
                        <strong>{option.data.email}</strong>
                        <br />
                        {option.data.id}
                    </span>
                );
            },
            renderRadio() {
                // `this` is bound to Radio component instance
                let style = {
                    border: "1px solid #666",
                    padding: 5,
                    marginBottom: 2
                };
                if (this.props.value) {
                    style.color = "white";
                    style.backgroundColor = "#FA5723";
                    style.fontWeight = "bold";
                }
                return (
                    <div style={style} onClick={this.onChange}>
                        {this.props.renderLabel.call(this)}
                    </div>
                );
            }
        };

        return (
            <AdminLayout>
                <Form {...formProps}>
                    {({ model, form }) => (
                        <View.Form>
                            <View.Header
                                title={
                                    model.id ? i18n("ACL - Edit User") : i18n("ACL - Create User")
                                }
                            >
                                <Button
                                    type="primary"
                                    label="Show modal"
                                    onClick={this.showDialog("myDialog")}
                                />
                                <Button
                                    type="primary"
                                    label="Confirm modal"
                                    onClick={this.showDialog("confirmAction")}
                                />
                                <Button
                                    type="primary"
                                    label="Success modal"
                                    onClick={this.showDialog("successAction")}
                                />
                                <ClickSuccess message="That was easy!">
                                    <Button type="primary" label="Click me!" onClick={() => {}} />
                                </ClickSuccess>
                                <CustomDialog name={"myDialog"} />
                                <Modal.Confirmation
                                    name={"confirmAction"}
                                    message={"Are you sure?"}
                                />
                                <Modal.Success name={"successAction"} message={"Hoorraaaay!"} />
                                <ClickSuccess message={msg}>
                                    {({ success }) => (
                                        <ClickConfirm
                                            message="This will charge your card with $15.99. Proceed?"
                                            onComplete={success}
                                        >
                                            <Button
                                                type="primary"
                                                label="Charge my credit card"
                                                onClick={() => {
                                                    return new Promise(r =>
                                                        setTimeout(() => {
                                                            r({ status: "processing" });
                                                        }, 1500)
                                                    );
                                                }}
                                            />
                                        </ClickConfirm>
                                    )}
                                </ClickSuccess>
                            </View.Header>
                            <View.Body noPadding>
                                <Tabs size="large">
                                    <Tabs.Tab label="User" icon="fa-home">
                                        <Grid.Row>
                                            <Grid.Col all={6}>
                                                <Section title={i18n("Info")} />
                                                <Grid.Row>
                                                    <Grid.Col all={8}>
                                                        <Input
                                                            label={i18n("First name")}
                                                            name="firstName"
                                                            validators="required"
                                                        />
                                                        <Input
                                                            label={i18n("Last name")}
                                                            name="lastName"
                                                            validators="required"
                                                        />
                                                        <Input
                                                            label={i18n("Email")}
                                                            name="email"
                                                            description={i18n("Your email")}
                                                            validators="required,email"
                                                        />
                                                        <Tags
                                                            name={"tags"}
                                                            label={"User tags"}
                                                            validatorsTags={"minLength:3"}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col all={4}>
                                                        <Avatar
                                                            cropper={{
                                                                title: "Crop your image",
                                                                action: "Upload image",
                                                                config: {
                                                                    aspectRatio: 1,
                                                                    closeOnClick: false,
                                                                    autoCropArea: 0.7,
                                                                    width: 300,
                                                                    height: 300
                                                                }
                                                            }}
                                                            name="avatar"
                                                            empty="x"
                                                        />
                                                    </Grid.Col>
                                                </Grid.Row>
                                            </Grid.Col>
                                            <Grid.Col all={6}>
                                                <Section title={i18n("Password")} />
                                                <Grid.Row>
                                                    <Grid.Col all={12}>
                                                        <Password
                                                            label={i18n("New password")}
                                                            name="password"
                                                            placeholder={i18n(
                                                                "Type a new password"
                                                            )}
                                                        />
                                                    </Grid.Col>
                                                </Grid.Row>
                                                <Grid.Row>
                                                    <Grid.Col all={12}>
                                                        <Password
                                                            label={i18n("Confirm password")}
                                                            name="confirmPassword"
                                                            validators="eq:@password"
                                                            placeholder={i18n(
                                                                "Retype the new password"
                                                            )}
                                                        >
                                                            <validator name="eq">
                                                                {i18n("Passwords do not match")}
                                                            </validator>
                                                        </Password>
                                                    </Grid.Col>
                                                </Grid.Row>
                                                <Grid.Row>
                                                    <Grid.Col all={12}>
                                                        <Gallery name={"gallery"} />
                                                    </Grid.Col>
                                                </Grid.Row>
                                            </Grid.Col>
                                        </Grid.Row>
                                    </Tabs.Tab>
                                    <Tabs.Tab label="Tab 2" icon="fa-cog">
                                        <Grid.Row>
                                            <Grid.Col all={6}>
                                                <Section title={i18n("Info")} />
                                                <CheckboxGroup {...checkboxGroup}>
                                                    <validator name="required">
                                                        You must select something!
                                                    </validator>
                                                    <validator name="minLength">
                                                        Select at least 2 items
                                                    </validator>
                                                </CheckboxGroup>
                                                <RadioGroup {...radioGroup} />
                                                <File
                                                    label="Verification document"
                                                    placeholder="Select a file"
                                                    name="document"
                                                />
                                                <IconPicker
                                                    label="Icon"
                                                    placeholder="Select an icon"
                                                    name={"icon"}
                                                />
                                                <Select {...selectProps} />
                                            </Grid.Col>
                                        </Grid.Row>
                                    </Tabs.Tab>
                                    <Tabs.Tab label="Tab 3" icon="fa-money">
                                        <Grid.Row>
                                            <Grid.Col all={12}>
                                                <ViewSwitcher>
                                                    <ViewSwitcher.View view="view1" defaultView>
                                                        {({ showView }) => (
                                                            <div>
                                                                <p>
                                                                    Hey, this is{" "}
                                                                    <strong>view1!</strong>
                                                                </p>
                                                                <Button
                                                                    label="Show View 2"
                                                                    onClick={showView("view2")}
                                                                />
                                                                <Button
                                                                    label="Show Modal View"
                                                                    onClick={showView("view3")}
                                                                />
                                                            </div>
                                                        )}
                                                    </ViewSwitcher.View>

                                                    <ViewSwitcher.View view="view2">
                                                        {({ showView }) => (
                                                            <div>
                                                                <p>
                                                                    You made it to{" "}
                                                                    <strong>view2</strong>.
                                                                </p>
                                                                <Button
                                                                    label="Show View 1"
                                                                    onClick={showView("view1")}
                                                                />
                                                            </div>
                                                        )}
                                                    </ViewSwitcher.View>

                                                    <ViewSwitcher.View view="view3" modal>
                                                        {() => (
                                                            <CustomDialog
                                                                name={"view-switcher-dialog"}
                                                            />
                                                        )}
                                                    </ViewSwitcher.View>
                                                </ViewSwitcher>

                                                <Dynamic.Fieldset name="contacts">
                                                    <Dynamic.Header>
                                                        {() => (
                                                            <Grid.Row>
                                                                <Grid.Col all={3}>
                                                                    <h5>Key</h5>
                                                                </Grid.Col>
                                                                <Grid.Col all={3}>
                                                                    <h5>Value</h5>
                                                                </Grid.Col>
                                                            </Grid.Row>
                                                        )}
                                                    </Dynamic.Header>
                                                    <Dynamic.Row>
                                                        {({ data, actions }) => (
                                                            <Grid.Row>
                                                                <Grid.Col all={3}>
                                                                    <Input
                                                                        placeholder="Key"
                                                                        name="key"
                                                                        validators="required"
                                                                    />
                                                                </Grid.Col>
                                                                <Grid.Col all={3}>
                                                                    <Input
                                                                        placeholder="Value"
                                                                        name="value"
                                                                        validators="required"
                                                                    />
                                                                </Grid.Col>
                                                                <Grid.Col all={6}>
                                                                    <ButtonGroup>
                                                                        <Button
                                                                            type="primary"
                                                                            label="Add"
                                                                            onClick={actions.add(
                                                                                data
                                                                            )}
                                                                        />
                                                                        <Button
                                                                            type="secondary"
                                                                            label="x"
                                                                            onClick={actions.remove(
                                                                                data
                                                                            )}
                                                                        />
                                                                    </ButtonGroup>
                                                                </Grid.Col>
                                                            </Grid.Row>
                                                        )}
                                                    </Dynamic.Row>
                                                    <Dynamic.Empty>
                                                        {({ actions }) => (
                                                            <Grid.Row>
                                                                <Grid.Col all={12}>
                                                                    <h6>
                                                                        You have not added any
                                                                        contacts yet. Click "Add
                                                                        contact" to start creating
                                                                        your contacts!
                                                                    </h6>
                                                                    <Button
                                                                        type="primary"
                                                                        label="Add contact"
                                                                        onClick={actions.add()}
                                                                    />
                                                                </Grid.Col>
                                                            </Grid.Row>
                                                        )}
                                                    </Dynamic.Empty>
                                                </Dynamic.Fieldset>
                                            </Grid.Col>
                                        </Grid.Row>
                                    </Tabs.Tab>
                                </Tabs>
                            </View.Body>
                            <View.Footer>
                                <Button
                                    type="default"
                                    onClick={form.cancel}
                                    label={i18n("Go back")}
                                />
                                <Button
                                    type="primary"
                                    onClick={form.submit}
                                    label={i18n("Save user")}
                                    align="right"
                                />
                            </View.Footer>
                        </View.Form>
                    )}
                </Form>
            </AdminLayout>
        );
    }
}

export default createComponent(Profile, {
    modulesProp: "Ui",
    modules: [
        { AdminLayout: "Skeleton.AdminLayout" },
        "Form",
        "View",
        "Grid",
        "Section",
        "Input",
        "Button",
        "Password",
        "Switch",
        "Modal",
        "ClickSuccess",
        "ClickConfirm",
        "ChangeConfirm",
        "CheckboxGroup",
        "Avatar",
        "Dynamic",
        "ButtonGroup",
        "File",
        "Gallery",
        "RadioGroup",
        "Select",
        "IconPicker",
        "Tabs",
        "Tags",
        "Tile",
        "ViewSwitcher"
    ]
});
