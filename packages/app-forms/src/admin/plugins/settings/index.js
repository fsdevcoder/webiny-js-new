// @flow
import * as React from "react";
import { Route } from "react-router-dom";
import { AdminLayout } from "@webiny/app-admin/components/AdminLayout";
import FormsSettings from "./components/FormsSettings";
import type { SettingsPluginType } from "@webiny/app-admin/types";
import { hasRoles } from "@webiny/app-security";
import { SecureRoute } from "@webiny/app-security/components";

export default ([
    {
        type: "settings",
        name: "settings-forms",
        settings: {
            show: () => hasRoles(["forms-settings"]),
            type: "app",
            name: "Form Builder",
            route: (
                <Route
                    path="/forms"
                    render={() => (
                        <AdminLayout>
                            <SecureRoute roles={["forms-settings"]}>
                                <FormsSettings />
                            </SecureRoute>
                        </AdminLayout>
                    )}
                />
            )
        }
    }
]: Array<SettingsPluginType>);
