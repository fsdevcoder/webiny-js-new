// @flow
import * as React from "react";
import warning from "warning";

const plugins = {};

export type PluginType = Object & {
    name: string,
    type: string
};

export const addPlugin = (...args: Array<PluginType>): void => {
    args.forEach(pl => {
        plugins[pl.name] = pl;
        pl.init && pl.init();
    });
};

export const getPlugins = (type: string): Array<PluginType> => {
    const values: Array<PluginType> = (Object.values(plugins): any);
    return values.filter((plugin: PluginType) => (type ? plugin.type === type : true));
};

export const getPlugin = (name: string): ?PluginType => {
    return plugins[name];
};

export const removePlugin = (name: string): void => {
    delete plugins[name];
};

/*************************************************************************/
/* Render functions and components                                       */
/*************************************************************************/

type RenderPluginOptions = {
    wrapper?: boolean,
    fn?: string,
    filter?: Function
};

const Plugin = ({ children }: { children: React.Node }) => children;

const Plugins = ({ children }: { children: React.Node }) => children;

export const renderPlugin = (
    name: string,
    params?: Object = {},
    { wrapper = true, fn = "render" }: RenderPluginOptions = {}
): React.Node | Array<React.Node> => {
    const plugin = getPlugin(name);
    warning(plugin, `No such plugin "${name}"`);

    if (!plugin) {
        return null;
    }

    const content = plugin[fn](params);
    if (content) {
        return wrapper ? (
            <Plugin key={plugin.name} name={name} params={params} fn={fn}>
                {content}
            </Plugin>
        ) : (
            React.cloneElement(content, { key: plugin.name })
        );
    }
    return null;
};

export const renderPlugins = (
    type: string,
    params?: Object = {},
    { wrapper = true, fn = "render", filter = v => v }: RenderPluginOptions = {}
): React.Node | Array<React.Node> => {
    const content = getPlugins(type)
        .filter(filter)
        .map(plugin => renderPlugin(plugin.name, params, { wrapper, fn }));

    return wrapper ? (
        <Plugins type={type} params={params} fn={fn}>
            {content}
        </Plugins>
    ) : (
        content
    );
};
