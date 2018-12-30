// @flow
import { hot } from "react-hot-loader";
import React from "react";
import { Webiny, Router } from "webiny-app";
import { registerPlugins } from "webiny-plugins";
import { Theme as AdminTheme } from "webiny-admin";
import { CmsProvider } from "webiny-app-cms/context";
import myTheme from "demo-theme";
import { Security } from "webiny-security/components";
import Login from "webiny-security/admin/views/Login";
import cookiePolicyPlugins from "webiny-integration-cookie-policy/plugins/admin";
import "./App.scss";
import config from "./config";
import plugins from "./plugins";

registerPlugins(plugins, cookiePolicyPlugins);

const App = () => {
    return (
        <Webiny config={config}>
            {({ router }) => (
                <CmsProvider theme={myTheme} isEditor>
                    <AdminTheme>
                        <Security>
                            {({ authenticated, notAuthenticated }) => (
                                <React.Fragment>
                                    {authenticated(<Router router={router} />)}
                                    {notAuthenticated(<Login />)}
                                </React.Fragment>
                            )}
                        </Security>
                    </AdminTheme>
                </CmsProvider>
            )}
        </Webiny>
    );
};

export default hot(module)(App);
