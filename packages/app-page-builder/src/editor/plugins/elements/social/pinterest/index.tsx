import React from "react";
import styled from "@emotion/styled";
import { Tab } from "@webiny/ui/Tabs";
import { Input } from "@webiny/ui/Input";
import { Select } from "@webiny/ui/Select";
import { Grid, Cell } from "@webiny/ui/Grid";
import { ReactComponent as SocialIcon } from "./../../../elementGroups/social/round-people-24px.svg";
import {
    createEmbedPlugin,
    createEmbedSettingsPlugin
} from "./../../utils/oembed/createEmbedPlugin";
import PinterestEmbed from "./PinterestEmbed";
import { validation } from "@webiny/validation";
import { ReactComponent as LogoIcon } from "./pinterest-brands.svg";

const PreviewBox = styled("div")({
    textAlign: "center",
    height: 50,
    svg: {
        height: 50,
        width: 50
    }
});

export default () => [
    createEmbedPlugin({
        type: "pinterest",
        toolbar: {
            title: "Pinterest post",
            group: "pb-editor-element-group-social",
            preview() {
                return (
                    <PreviewBox>
                        <LogoIcon />
                    </PreviewBox>
                );
            }
        },
        render({ element }) {
            return <PinterestEmbed element={element} />;
        }
    }),
    createEmbedSettingsPlugin({
        type: "pinterest",
        render({ Bind }) {
            return (
                <Tab icon={<SocialIcon />} label="Pinterest">
                    <Grid>
                        <Cell span={12}>
                            <Bind
                                name={"source.url"}
                                validators={validation.create("required,url")}
                            >
                                <Input
                                    label={"Pinterest URL"}
                                    description={"Enter a Pinterest URL"}
                                />
                            </Bind>
                        </Cell>
                        <Cell span={12}>
                            <Bind defaultValue="small" name={"source.size"}>
                                <Select label={"Size"}>
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </Select>
                            </Bind>
                        </Cell>
                    </Grid>
                </Tab>
            );
        }
    })
];
