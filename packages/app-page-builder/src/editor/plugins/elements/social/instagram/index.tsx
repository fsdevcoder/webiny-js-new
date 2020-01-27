import React from "react";
import styled from "@emotion/styled";
import { Tab } from "@webiny/ui/Tabs";
import { Input } from "@webiny/ui/Input";
import { Grid, Cell } from "@webiny/ui/Grid";
import { ReactComponent as SocialIcon } from "./../../../elementGroups/social/round-people-24px.svg";
import placeholder from "./placeholder.jpg";
import {
    createEmbedPlugin,
    createEmbedSettingsPlugin
} from "./../../utils/oembed/createEmbedPlugin";

import { ReactComponent as LogoIcon } from "./instagram-brands.svg";
import { validation } from "@webiny/validation";
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
        type: "instagram",
        toolbar: {
            title: "Instagram Post",
            group: "pb-editor-element-group-social",
            preview() {
                return (
                    <PreviewBox>
                        <LogoIcon />
                    </PreviewBox>
                );
            }
        },
        oembed: {
            global: "instgrm",
            sdk: "https://www.instagram.com/embed.js",
            init({ node }) {
                // @ts-ignore
                window.instgrm.Embeds.process(node.firstChild);
            }
        },
        renderElementPreview({ width, height }) {
            return <img style={{ width, height }} src={placeholder} alt={"Instagram"} />;
        }
    }),
    createEmbedSettingsPlugin({
        type: "instagram",
        render({ Bind }) {
            return (
                <Tab icon={<SocialIcon />} label="Instagram">
                    <Grid>
                        <Cell span={12}>
                            <Bind
                                name={"source.url"}
                                validators={validation.create("required,url")}
                            >
                                <Input
                                    label={"Instagram URL"}
                                    description={"Enter an Instagram URL"}
                                />
                            </Bind>
                        </Cell>
                    </Grid>
                </Tab>
            );
        }
    })
];
