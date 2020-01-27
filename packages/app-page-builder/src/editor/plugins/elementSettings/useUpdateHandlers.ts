import { useMemo } from "react";
import { set } from "lodash";
import { useHandler } from "@webiny/app/hooks/useHandler";

export default props => {
    const updateSettings = useHandler(props, ({ element, updateElement, dataNamespace }) => {
        const historyUpdated = {};
        return (name: string, newValue: any, history = false) => {
            const propName = `${dataNamespace}.${name}`;

            const newElement = set(element, propName, newValue);

            if (!history) {
                updateElement({
                    element: newElement,
                    history,
                    merge: true
                });
                return;
            }

            if (historyUpdated[propName] !== newValue) {
                historyUpdated[propName] = newValue;
                updateElement({ element: newElement, merge: true });
            }
        };
    });

    const getUpdateValue = useMemo(() => {
        const handlers = {};
        return (name: string) => {
            if (!handlers[name]) {
                handlers[name] = value => updateSettings(name, value, true);
            }

            return handlers[name];
        };
    }, [updateSettings]);

    const getUpdatePreview = useMemo(() => {
        const handlers = {};
        return (name: string) => {
            if (!handlers[name]) {
                handlers[name] = value => updateSettings(name, value, false);
            }

            return handlers[name];
        };
    }, [updateSettings]);

    return { getUpdateValue, getUpdatePreview };
};
