// @flow
import React from "react";
import { Input } from "webiny-ui/Input";
import type { RenderFieldPluginType } from "webiny-app-forms/types";

export default ({
    type: "forms-field-render",
    name: "forms-field-render-email",
    field: {
        type: "email",
        render({ field }) {
            return <Input label={field.label} />;
        }
    }
}: RenderFieldPluginType);
