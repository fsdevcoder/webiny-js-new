// @flow
import React from "react";
import { ReactComponent as CodeIcon } from "./code.svg";
import type { ElementGroupPluginType } from "webiny-app-cms/types";

export default ({
    name: "cms-element-group-code",
    type: "cms-element-group",
    group: {
        name: "code",
        title: "Code",
        icon: <CodeIcon />
    }
}: ElementGroupPluginType);
