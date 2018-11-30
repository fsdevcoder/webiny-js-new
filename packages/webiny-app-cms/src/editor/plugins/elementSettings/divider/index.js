// @flow
import React from "react";
import styled from "react-emotion";
import { pure } from "recompose";

const Divider = pure(
    styled("div")({
        backgroundColor: "var(--mdc-theme-on-background)",
        width: 1,
        height: 40,
        display: "block",
        margin: "0 5px"
    })
);

export default {
    name: "cms-element-settings-divider",
    type: "cms-element-settings",
    renderAction() {
        return <Divider />;
    }
};
