// @flow
import React from "react";
import styled from "react-emotion";
import { Tab } from "webiny-ui/Tabs";
import { Input } from "webiny-ui/Input";
import { Grid, Cell } from "webiny-ui/Grid";
import type { ElementPluginType } from "webiny-app-cms/types";
import {
    createEmbedPlugin,
    createEmbedSettingsPlugin
} from "./../../utils/oembed/createEmbedPlugin";
import { ReactComponent as MediaIcon } from "./../../../elementGroups/media/round-music_video-24px.svg";
import VimeoEmbed from "./VimeoEmbed";

import { ReactComponent as LogoIcon } from "./vimeo-v-brands.svg";

const PreviewBox = styled("div")({
    textAlign: "center",
    height: 50,
    svg: {
        height: 50,
        width: 50
    }
});

export default (): Array<ElementPluginType> => [
    createEmbedPlugin({
        type: "vimeo",
        toolbar: {
            title: "Vimeo",
            group: "cms-element-group-media",
            preview() {
                return (
                    <PreviewBox>
                        <LogoIcon />
                    </PreviewBox>
                );
            }
        },
        oembed: {
            renderEmbed(props) {
                return <VimeoEmbed {...props} />;
            }
        },
        renderElementPreview() {
            return <div>Vimeo video</div>;
        }
    }),
    createEmbedSettingsPlugin({
        type: "vimeo",
        render({ Bind }) {
            return (
                <Tab icon={<MediaIcon />} label="Vimeo">
                    <Grid>
                        <Cell span={12}>
                            <Bind name={"data.source.url"} validators={["required", "url"]}>
                                <Input label={"Video URL"} description={"Enter a video URL"} />
                            </Bind>
                        </Cell>
                    </Grid>
                </Tab>
            );
        }
    })
];
