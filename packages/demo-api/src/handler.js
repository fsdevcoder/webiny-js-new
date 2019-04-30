// @flow
import "source-map-support/register";
import { registerPlugins } from "webiny-plugins";
import { createHandler } from "webiny-api";
import config from "./configs";
import plugins from "./plugins";

registerPlugins(plugins);
export const handler = createHandler(config);
