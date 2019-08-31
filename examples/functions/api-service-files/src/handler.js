// @flow
import { createHandler, PluginsContainer } from "@webiny/api";
import createConfig from "service-config";

import servicePlugins from "@webiny/api/plugins/service";
import securityPlugins from "@webiny/api-security/plugins/service";
import filesPlugins from "@webiny/api-files/plugins";

const plugins = new PluginsContainer([servicePlugins, securityPlugins, filesPlugins]);

let apolloHandler;

export const handler = async (event: Object, context: Object) => {
    if (!apolloHandler) {
        const config = await createConfig();
        const { handler } = await createHandler({ plugins, config });
        apolloHandler = handler;
    }

    return apolloHandler(event, context);
};
