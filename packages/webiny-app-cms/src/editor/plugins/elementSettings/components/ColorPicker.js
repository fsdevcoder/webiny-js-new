// @flow
import * as React from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { pure } from "recompose";
import { Typography } from "webiny-ui/Typography";
import { Grid, Cell } from "webiny-ui/Grid";
import ColorPickerCmp from "webiny-app-cms/editor/components/ColorPicker";
import { getActiveElement } from "webiny-app-cms/editor/selectors";

type Props = {
    label: string,
    value: string,
    updatePreview: Function,
    updateValue: Function
};

const ColorPicker = pure(({ label, value, updatePreview, updateValue }: Props) => {
    return (
        <Grid>
            <Cell span={4}>
                <Typography use={"overline"}>{label}</Typography>
            </Cell>
            <Cell span={8}>
                <ColorPickerCmp
                    compact
                    value={value}
                    onChange={updatePreview}
                    onChangeComplete={updateValue}
                />
            </Cell>
        </Grid>
    );
});

export default connect((state, { value, valueKey, defaultValue }: Object) => {
    return {
        value: valueKey ? get(getActiveElement(state), valueKey, defaultValue) : value
    };
})(ColorPicker);
