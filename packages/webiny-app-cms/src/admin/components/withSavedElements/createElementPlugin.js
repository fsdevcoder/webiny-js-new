// @flow
import React from "react";
import cloneDeep from "lodash/cloneDeep";
import { addPlugin, getPlugin } from "webiny-plugins";
import Title from "./Title";

type Element = {
    id: string,
    name: string,
    type: string,
    content: Object,
    preview: {
        src: string
    }
};

export default (el: Element) => {
    const rootPlugin = getPlugin(el.content.type);
    if (!rootPlugin) {
        return;
    }

    const name = "cms-saved-element-" + el.id;

    addPlugin({
        name,
        title: el.name,
        type: "cms-element",
        target: rootPlugin.target,
        toolbar: {
            title({ refresh }) {
                return <Title plugin={name} title={el.name} id={el.id} refresh={refresh} />;
            },
            group: "cms-element-group-saved",
            preview() {
                return (
                    <img
                        src={el.preview.src}
                        alt={el.name}
                        style={{ width: 227, height: "auto", backgroundColor: "#fff" }}
                    />
                );
            }
        },
        onCreate: "skip",
        settings: rootPlugin ? rootPlugin.settings : [],
        create() {
            return cloneDeep(el.content);
        }
    });
};
