import React from "react";
import styled from "@emotion/styled";
import { Tab } from "@webiny/ui/Tabs";
import { Input } from "@webiny/ui/Input";
import { Grid, Cell } from "@webiny/ui/Grid";
import { ReactComponent as CodeIcon } from "./round-text_format-24px.svg";
import { ReactComponent as TypeformLogo } from "./typeform-logo.svg";
import { ElementRoot } from "@webiny/app-page-builder/render/components/ElementRoot";
import TypeFormEmbed from "./TypeFormEmbed";
import render from "./../render";
import { validation } from "@webiny/validation";
import {
    PbEditorPageElementPlugin,
    PbEditorPageElementAdvancedSettingsPlugin
} from "@webiny/app-page-builder/admin/types";

const PreviewBox = styled("div")({
    textAlign: "center",
    height: 150,
    svg: {
        height: 150,
        width: 150
    }
});

export default [
    render,
    {
        name: "pb-page-element-typeform",
        type: "pb-editor-page-element",
        elementType: "typeform",
        toolbar: {
            title: "Typeform",
            group: "pb-editor-element-group-form",
            preview() {
                return (
                    <PreviewBox>
                        <TypeformLogo />
                    </PreviewBox>
                );
            }
        },
        settings: ["pb-editor-page-element-settings-delete", "", "pb-editor-page-element-settings-height"],
        target: ["column", "row", "list-item"],
        onCreate: "open-settings",
        render({ element }) {
            return (
                <ElementRoot element={element} className={"webiny-pb-page-element-typeform"}>
                    <TypeFormEmbed elementId={element.id} />
                </ElementRoot>
            );
        },
        create() {
            return {
                type: "typeform",
                elements: [],
                data: {},
                settings: {
                    style: {
                        height: "500px"
                    }
                }
            };
        }
    } as PbEditorPageElementPlugin,
    {
        name: "pb-editor-page-element-advanced-settings-typeform",
        type: "pb-editor-page-element-advanced-settings",
        elementType: "typeform",
        render({ Bind }) {
            return (
                <Tab icon={<CodeIcon />} label="Typeform">
                    <Grid>
                        <Cell span={12}>
                            <Bind
                                name={"source.url"}
                                validators={validation.create("required,url")}
                            >
                                <Input
                                    label={"Typeform URL"}
                                    description={"Enter a Typeform URL"}
                                />
                            </Bind>
                        </Cell>
                    </Grid>
                </Tab>
            );
        }
    } as PbEditorPageElementAdvancedSettingsPlugin
];
