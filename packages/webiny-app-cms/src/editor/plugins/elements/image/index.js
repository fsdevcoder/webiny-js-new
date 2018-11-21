// @flow
import React from "react";
import Image from "./Image";
import styled from "react-emotion";
import { getPlugin } from "webiny-app/plugins";
import { redux, addMiddleware } from "webiny-app-cms/editor/redux";
import { ELEMENT_CREATED } from "webiny-app-cms/editor/actions";
import ElementStyle from "webiny-app-cms/render/components/ElementStyle";
import { ReactComponent as ImageIcon } from "./round-image-24px.svg";
import type { ElementPluginType } from "webiny-app-cms/types";
import { updateElement } from "webiny-app-cms/editor/actions";
import { get, set } from "dot-prop-immutable";
import { Grid, Cell } from "webiny-ui/Grid";
import { Tab } from "webiny-ui/Tabs";
import { Input } from "webiny-ui/Input";
import { Select } from "webiny-ui/Select";
import isNumeric from "isnumeric";

export default (): ElementPluginType => {
    const PreviewBox = styled("div")({
        textAlign: "center",
        height: 50,
        svg: {
            height: 50,
            width: 50
        }
    });

    return [
        {
            name: "cms-element-image",
            type: "cms-element",
            toolbar: {
                title: "Image",
                group: "cms-element-group-image",
                preview() {
                    return (
                        <PreviewBox>
                            <ImageIcon />
                        </PreviewBox>
                    );
                }
            },
            settings: [
                "cms-element-settings-background",
                "",
                "cms-element-settings-border",
                "cms-element-settings-shadow",
                "",
                "cms-element-settings-padding",
                "cms-element-settings-margin",
                "",
                "cms-element-settings-clone",
                "cms-element-settings-delete",
                ""
            ],
            target: ["cms-element-column", "cms-element-row"],
            init() {
                addMiddleware([ELEMENT_CREATED], ({ action, next }) => {
                    const { element, source } = action.payload;

                    next(action);

                    // Check the source of the element (could be `saved` element which behaves differently from other elements)
                    const { onCreate } = getPlugin(source.type);
                    if (!onCreate || onCreate !== "skip") {
                        // If source element does not define a specific `onCreate` behavior - continue with the actual element plugin
                        document
                            .querySelector(
                                `#cms-element-image-${element.id} [data-role="select-image"]`
                            )
                            .click();
                    }
                });
            },
            create(options) {
                return { type: "cms-element-image", elements: [], ...options };
            },
            render({ element }) {
                const { width, height } = get(element, "settings.advanced.img", {});
                const imgStyle = {};
                if (width) {
                    imgStyle.width = isNumeric(width) ? parseInt(width) : width;
                }
                if (height) {
                    imgStyle.height = isNumeric(height) ? parseInt(height) : height;
                }

                return (
                    <ElementStyle element={element}>
                        <Image
                            element={element}
                            img={{ style: imgStyle }}
                            showRemoveImageButton={false}
                            value={element.data}
                            onChange={data => {
                                redux.store.dispatch(
                                    updateElement({ element: set(element, "data", data) })
                                );
                            }}
                        />
                    </ElementStyle>
                );
            }
        },
        {
            name: "cms-element-advanced-settings-image",
            type: "cms-element-advanced-settings",
            element: "cms-element-image",
            render({ Bind }) {
                return (
                    <Tab icon={<ImageIcon />} label="Image">
                        <Grid>
                            <Cell span={12}>
                                <Bind name={"img.title"} defaultValue={""}>
                                    <Input label="Image title" />
                                </Bind>
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell span={12}>
                                <Bind name={"img.alt"} defaultValue={""}>
                                    <Input
                                        label="Alternate text (alt)"
                                        description={
                                            "Specifies an alternate text for an image, if the image cannot be displayed."
                                        }
                                    />
                                </Bind>
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell span={6}>
                                <Bind name={"img.width"} defaultValue={""}>
                                    <Input
                                        label="Width"
                                        placeholder="auto"
                                        description="eg. 300 or 50%"
                                    />
                                </Bind>
                            </Cell>
                            <Cell span={6}>
                                <Bind name={"img.height"} defaultValue={""}>
                                    <Input
                                        label="Height"
                                        placeholder="auto"
                                        description="eg. 300 or 50%"
                                    />
                                </Bind>
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell span={12}>
                                <Bind name={"img.align"} defaultValue={"center"}>
                                    <Select label="Align">
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </Select>
                                </Bind>
                            </Cell>
                        </Grid>
                    </Tab>
                );
            }
        }
    ];
};
