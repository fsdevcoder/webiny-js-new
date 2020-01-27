import * as React from "react";
import { hasScopes, hasRoles } from "@webiny/app-security";
import { getPlugin } from "@webiny/plugins";
import { ResourcesType } from "../identity";
import { SecureRouteErrorPlugin } from "@webiny/app-security/types";

export default ({
    children,
    scopes,
    roles
}: {
    children: any;
    scopes?: ResourcesType;
    roles?: ResourcesType;
}): React.ReactElement => {
    const checks = {
        scopes: scopes ? hasScopes(scopes, { forceBoolean: true }) : true,
        roles: roles ? hasRoles(roles, { forceBoolean: true }) : true
    };

    if (checks.scopes && checks.roles) {
        return children;
    }

    const plugin = getPlugin("secure-route-error") as SecureRouteErrorPlugin;
    if (!plugin) {
        return <span>You are not authorized to view this route.</span>;
    }
    return plugin.render();
};
