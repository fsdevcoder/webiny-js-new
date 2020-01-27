import * as React from "react";
import { Plugin } from "@webiny/app/types";
import { BindComponent } from "@webiny/form";

export type SecurityViewProps = {
    Bind: BindComponent;
    data: { [key: string]: any };
    error?: any;
    fields: { [key: string]: React.ReactElement };
};

export type SecurityViewInstallationFormPlugin = Plugin & {
    view: React.ComponentType<SecurityViewProps>;
};

export type SecurityViewUserFormPlugin = Plugin & {
    view: React.ComponentType<SecurityViewProps>;
};

export type SecurityViewUserAccountFormPlugin = Plugin & {
    view: React.ComponentType<SecurityViewProps>;
};
