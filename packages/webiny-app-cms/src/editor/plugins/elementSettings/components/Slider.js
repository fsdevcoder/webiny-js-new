// @flow
import * as React from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { pure } from "recompose";
import { Typography } from "webiny-ui/Typography";
import { Grid, Cell } from "webiny-ui/Grid";
import { Slider as SliderCmp } from "webiny-ui/Slider";
import { getActiveElement } from "webiny-app-cms/editor/selectors";

type Props = {
    label: string,
    value: string,
    updatePreview: Function,
    updateValue: Function,
    min: number,
    max: number,
    step: number
};

const Slider = pure(
    ({ label, value, updatePreview, updateValue, min = 0, max = 100, step = 1 }: Props) => {
        return (
            <Grid>
                <Cell span={4}>
                    <Typography use={"overline"}>{label}</Typography>
                </Cell>
                <Cell span={8}>
                    <SliderCmp
                        value={value}
                        onChange={updateValue}
                        onInput={updatePreview}
                        min={min}
                        max={max}
                        discrete
                        step={step}
                    />
                </Cell>
            </Grid>
        );
    }
);

export default connect((state, { valueKey }: Object) => {
    return {
        value: get(getActiveElement(state), valueKey, 0)
    };
})(Slider);
