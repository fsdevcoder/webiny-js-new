// @flow
import "./style/theme.scss";
import StaticLayout from "./layouts/static";
import BlogLayout from "./layouts/blog";
import PageList from "./components/PageList";
import PageListv2 from "./components/PageListv2";
import DefaultMenu from "./components/DefaultMenu";

export default {
    layouts: [
        {
            name: "static",
            title: "Static page",
            component: StaticLayout
        },
        {
            name: "blog",
            title: "Blog",
            component: BlogLayout
        }
    ],
    fonts: {
        google: {
            families: ["IBM Plex Sans:400,500,700", "Lato:400,500,700"]
        }
    },
    colors: {
        primary: "var(--webiny-cms-theme-primary)",
        secondary: "var(--webiny-cms-theme-secondary)",
        background: "var(--webiny-cms-theme-background)",
        surface: "var(--webiny-cms-theme-surface)"
    },
    components: {
        menu: [
            {
                name: "default",
                component: DefaultMenu
            }
        ]
    },
    elements: {
        button: {
            types: [
                { className: "", label: "Default" },
                { className: "primary", label: "Primary" },
                { className: "secondary", label: "Secondary" }
            ]
        },
        pagesList: {
            components: [
                {
                    name: "default",
                    title: "Default page list",
                    component: PageList
                },
                {
                    name: "custom",
                    title: "Custom page list",
                    component: PageListv2
                }
            ]
        }
    },
    styles: {
        h1: {
            label: "Heading 1",
            component: "h1",
            className: "webiny-cms-typography-h1"
        },
        h2: {
            label: "Heading 2",
            component: "h2",
            className: "webiny-cms-typography-h2"
        },
        h3: {
            label: "Heading 3",
            component: "h3",
            className: "webiny-cms-typography-h3"
        },
        h4: {
            label: "Heading 4",
            component: "h4",
            className: "webiny-cms-typography-h4"
        },
        h5: {
            label: "Heading 5",
            component: "h5",
            className: "webiny-cms-typography-h5"
        },
        h6: {
            label: "Heading 6",
            component: "h6",
            className: "webiny-cms-typography-h6"
        },
        paragraph: {
            label: "Paragraph",
            component: "p",
            className: "webiny-cms-typography-body"
        },
        description: {
            label: "Description",
            component: "p",
            className: "webiny-cms-typography-description"
        },
        descriptionWhite: {
            label: "Description (white)",
            component: "p",
            className: "webiny-cms-typography-description-white"
        },
        primaryColorText: {
            label: "Primary color text",
            component: "p",
            className: "webiny-cms-typography-primary-color"
        }
    }
};
