// @flow
import * as React from "react";
import { Grid, Cell } from "@webiny/ui/Grid";
import { Select } from "@webiny/ui/Select";
import ImagesList from "./ImagesList";
import { getPlugins } from "@webiny/plugins";

const ImagesListDesignSettings = ({ Bind, data }: Object) => {
    const components = getPlugins("pb-page-element-images-list-component");

    return (
        <React.Fragment>
            <Grid>
                <Cell span={12}>
                    <Bind
                        name={"component"}
                        defaultValue={components[0] ? components[0].componentName : null}
                    >
                        <Select
                            label={"Design"}
                            description={"Select a component to render the list"}
                        >
                            {components.map(cmp => (
                                <option key={cmp.name} value={cmp.componentName}>
                                    {cmp.title}
                                </option>
                            ))}
                        </Select>
                    </Bind>
                </Cell>
            </Grid>

            <Grid>
                <Cell span={12} style={{ overflowY: "scroll" }}>
                    <ImagesList data={data} />
                </Cell>
            </Grid>
        </React.Fragment>
    );
};

export default ImagesListDesignSettings;
