import { GraphQLContextPlugin } from "@webiny/api/types";
import acceptLanguageParser from "accept-language-parser";
import { GraphQLContextI18NGetLocales } from "@webiny/api-i18n/types";

const plugin: GraphQLContextPlugin = {
    type: "graphql-context",
    name: "graphql-context-i18n",
    apply: async context => {
        const locales = context.plugins.byName<GraphQLContextI18NGetLocales>(
            "graphql-context-i18n-get-locales"
        );

        if (!locales) {
            throw new Error(
                'Cannot load locales - missing "graphql-context-i18n-get-locales" plugin.'
            );
        }

        const { event } = context;
        const self = {
            __i18n: {
                acceptLanguage: null,
                defaultLocale: null,
                locale: null,
                locales: await locales.resolve({ context })
            },
            getDefaultLocale() {
                const allLocales = self.getLocales();
                return allLocales.find(item => item.default === true);
            },
            getLocale() {
                if (self.__i18n.locale) {
                    return self.__i18n.locale;
                }

                const allLocales = self.getLocales();
                const acceptLanguage = acceptLanguageParser.pick(
                    allLocales.map(item => item.code),
                    event.headers["accept-language"]
                );

                let currentLocale;
                if (acceptLanguage) {
                    currentLocale = allLocales.find(item => item.code === acceptLanguage);
                }

                if (!currentLocale) {
                    currentLocale = self.getDefaultLocale();
                }

                self.__i18n.locale = currentLocale;
                return self.__i18n.locale;
            },
            getLocales() {
                return self.__i18n.locales;
            },
            getValue(value) {
                if (!value) {
                    return "";
                }

                if (Array.isArray(value.values)) {
                    const locale = self.getLocale();
                    if (!locale) {
                        return "";
                    }

                    const valuesValue = value.values.find(value => value.locale === locale.id);
                    return valuesValue ? valuesValue.value : "";
                }

                return value.value || "";
            }
        };

        context.i18n = self;
    }
};

export default plugin;
