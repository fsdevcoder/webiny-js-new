// @flow
// $FlowFixMe
import React, { useReducer, useMemo, useContext } from "react";

export function init(props: Object) {
    return {
        ...props
    };
}

export function i18nReducer(state: Object, action: Object) {
    const next = { ...state };
    switch (action.type) {
        case "data": {
            next.data = action.data;
            break;
        }
    }

    return next;
}

const I18NContext = React.createContext();

function I18NProvider(props: Object) {
    const [state, dispatch] = useReducer(i18nReducer, props, init);

    const value = useMemo(() => {
        return {
            state,
            dispatch
        };
    });

    return <I18NContext.Provider value={value} {...props} />;
}

function useI18N() {
    const context = useContext(I18NContext);
    if (!context) {
        throw new Error("useI18N must be used within a I18NProvider");
    }

    const { state, dispatch } = context;
    const self = {
        // TODO: load these properly.
        acceptLanguage: "en-US",
        defaultLocale: "en-US",
        locales: ["en-US", "de-DE", "hr-HR"],
        getLocale() {
            return self.acceptLanguage || self.defaultLocale;
        },
        getLocales() {
            return self.locales;
        },
        translate(valueObject: ?Object): string {
            if (!valueObject) {
                return "";
            }

            if (Array.isArray(valueObject.values)) {
                const output = valueObject.values.find(item => item.locale === self.getLocale());
                return output ? output.value : "";
            }

            return valueObject.value || "";
        },
        state,
        dispatch
    };

    return self;
}

export { I18NProvider, useI18N };
