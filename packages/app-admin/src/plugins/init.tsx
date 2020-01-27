import React from "react";
import { i18n } from "@webiny/app/i18n";
import { registerPlugins, getPlugins } from "@webiny/plugins";
import { ReactComponent as SettingsIcon } from "@webiny/app-admin/assets/icons/round-settings-24px.svg";
import { WebinyInitPlugin } from "@webiny/app/types";
import { SettingsPlugin } from "@webiny/app-admin/types";

const t = i18n.namespace("Webiny.Admin.Menus");

const renderPlugins = ({ plugins, Item }) => {
    return plugins
        .map(sp => {
            if (typeof sp.settings.show === "function" && !sp.settings.show()) {
                return null;
            }
            return (
                <Item
                    key={sp.name}
                    label={sp.settings.name}
                    path={"/settings" + sp.settings.route.props.path}
                />
            );
        })
        .filter(item => item);
};

const plugin: WebinyInitPlugin = {
    type: "webiny-init",
    name: "webiny-init-settings",
    init() {
        // Settings
        // Apps / integrations can register settings plugins and add menu items like the following.
        const settingsPlugins = getPlugins("settings") as SettingsPlugin[];

        settingsPlugins.forEach((sp: SettingsPlugin) => {
            registerPlugins({
                type: "route",
                name: "route-settings-" + sp.name,
                route: React.cloneElement(sp.settings.route, {
                    path: "/settings" + sp.settings.route.props.path
                })
            });
        });

        const sortedSettingsPlugins = {
            apps: settingsPlugins.filter(sp => sp.settings.type === "app"),
            integrations: settingsPlugins.filter(sp => sp.settings.type === "integration"),
            other: settingsPlugins.filter(sp => !["app", "integration"].includes(sp.settings.type))
        };

        registerPlugins({
            name: "menu-app-admin-settings",
            type: "menu",
            order: 100,
            render({ Menu, Section, Item }) {
                const render = {
                    apps: renderPlugins({ plugins: sortedSettingsPlugins.apps, Item }),
                    integrations: renderPlugins({
                        plugins: sortedSettingsPlugins.integrations,
                        Item
                    }),
                    other: renderPlugins({ plugins: sortedSettingsPlugins.other, Item })
                };

                if (render.apps.length || render.integrations.length || render.other.length) {
                    return (
                        <Menu name="settings" label={t`Settings`} icon={<SettingsIcon />}>
                            {render.apps.length > 0 && (
                                <Section label={t`Apps`}>{render.apps}</Section>
                            )}

                            {render.integrations.length > 0 && (
                                <Section label={t`Integrations`}>{render.integrations}</Section>
                            )}

                            {render.other.length > 0 && (
                                <Section label={t`Other`}>{render.other}</Section>
                            )}
                        </Menu>
                    );
                }

                return null;
            }
        });
    }
};

export default plugin;
