import { registerPlugins } from "webiny-plugins";

const loaded = { render: false, editor: false };

export const lazyLoadMiddleware = () => async (params: Object, next: Function) => {
    const { route } = params;

    // If we are on pages list route, import plugins required to render the page content.
    if (route.path.startsWith("/cms/pages") && !loaded.render) {
        const renderPlugins = await import("webiny-app-cms/render/presets/default");
        registerPlugins(renderPlugins.default);

        loaded.render = true;
    }

    // If we are on the Editor route, import plugins required to render both editor and preview.
    if (route.path.startsWith("/cms/editor") && !loaded.editor) {
        const plugins = await Promise.all(
            [
                import("webiny-app-cms/editor/presets/default"),
                !loaded.render ? import("webiny-app-cms/render/presets/default") : null
            ].filter(Boolean)
        );
        registerPlugins(plugins.map(p => p.default));

        loaded.editor = true;
        loaded.render = true;
    }

    next();
};
