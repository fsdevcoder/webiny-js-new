// @flow
import React from "react";
import type { ElementPluginType } from "webiny-app-cms/types";
import { Tab } from "webiny-ui/Tabs";
import { ReactComponent as ListIcon } from "./round-list-24px.svg";
import PagesList from "./PagesList";
import PagesListSettings from "./PagesListSettings";

export default () => {
    return [
        ({
            name: "cms-element-pages-list",
            type: "cms-element",
            toolbar: {
                title: "Pages List",
                group: "cms-element-group-text",
                preview() {
                    return "List sample";
                }
            },
            settings: ["cms-element-settings-delete"],
            target: ["cms-element-row", "cms-element-column"],
            onCreate: "open-settings",
            create(options = {}) {
                return {
                    type: "cms-element-pages-list",
                    settings: {
                        limit: 3,
                        component: "default"
                    },
                    ...options
                };
            },
            render({ element }) {
                return <PagesList settings={element.settings} />;
            }
        }: ElementPluginType),
        {
            name: "cms-element-advanced-settings-pages-list",
            type: "cms-element-advanced-settings",
            element: "cms-element-pages-list",
            render(props: Object) {
                return (
                    <Tab icon={<ListIcon />} label="Pages List">
                        <PagesListSettings {...props} />
                    </Tab>
                );
            }
        }
    ];
};
