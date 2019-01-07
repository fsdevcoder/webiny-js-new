//@flow
import * as React from "react";
import { connect } from "webiny-app-cms/editor/redux";
import { compose } from "recompose";
import { isEqual } from "lodash";
import { getActiveElement } from "webiny-app-cms/editor/selectors";
import { Tabs, Tab } from "webiny-ui/Tabs";
import { updateElement } from "webiny-app-cms/editor/actions";
import ColorPicker from "webiny-app-cms/editor/plugins/elementSettings/components/ColorPicker";
import Input from "webiny-app-cms/editor/plugins/elementSettings/components/Input";
import withUpdateHandlers from "webiny-app-cms/editor/plugins/elementSettings/components/withUpdateHandlers";

const DATA_NAMESPACE = "data.settings.shadow";

const Settings = ({ getUpdateValue, getUpdatePreview }: Object) => {
    return (
        <React.Fragment>
            <Tabs>
                <Tab label={"Shadow"}>
                    <ColorPicker
                        label={"Color"}
                        valueKey={DATA_NAMESPACE + ".color"}
                        updateValue={getUpdateValue("color")}
                        updatePreview={getUpdatePreview("color")}
                    />

                    <Input
                        label={"Horizontal offset"}
                        valueKey={DATA_NAMESPACE + ".horizontal"}
                        updateValue={getUpdateValue("horizontal")}
                    />

                    <Input
                        label={"Vertical offset"}
                        valueKey={DATA_NAMESPACE + ".vertical"}
                        updateValue={getUpdateValue("vertical")}
                    />

                    <Input
                        label={"Blur"}
                        valueKey={DATA_NAMESPACE + ".blur"}
                        updateValue={getUpdateValue("blur")}
                    />

                    <Input
                        label={"Spread"}
                        valueKey={DATA_NAMESPACE + ".spread"}
                        updateValue={getUpdateValue("spread")}
                    />
                </Tab>
            </Tabs>
        </React.Fragment>
    );
};

export default compose(
    connect(
        state => {
            const { id, type, path } = getActiveElement(state);
            return { element: { id, type, path } };
        },
        { updateElement },
        null,
        { areStatePropsEqual: isEqual }
    ),
    withUpdateHandlers({ namespace: DATA_NAMESPACE })
)(Settings);
