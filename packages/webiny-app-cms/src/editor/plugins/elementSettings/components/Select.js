// @flow
import * as React from "react";
import { pure } from "recompose";
import { Typography } from "webiny-ui/Typography";
import { Cell } from "webiny-ui/Grid";
import { Select } from "webiny-ui/Select";

type Props = {
    label: string,
    value: string,
    updateValue: Function,
    options: Array<string>
};

export default pure(({ label, value, updateValue, options }: Props) => {
    return (
        <React.Fragment>
            <Cell span={4}>
                <Typography use={"overline"}>{label}</Typography>
            </Cell>
            <Cell span={8}>
                <Select
                    value={value}
                    onChange={updateValue}
                    options={options}
                />
            </Cell>
        </React.Fragment>
    );
});
