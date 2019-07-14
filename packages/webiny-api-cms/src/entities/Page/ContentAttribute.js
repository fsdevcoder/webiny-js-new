// @flow
import { ObjectAttribute } from "webiny-model";
import { getPlugins } from "webiny-plugins";

const isValidElement = element => {
    return element && element.type;
};

const getModifierPlugins = (elementType, modifierType) => {
    return getPlugins("cms-element-modifier").filter(plugin => {
        if (plugin.element === "*" || plugin.element === elementType) {
            return typeof plugin[modifierType] === "function";
        }
        return false;
    });
};

const syncModifiers = ({ context, modifierType, element }) => {
    if (!isValidElement(element)) {
        return;
    }

    const plugins = getModifierPlugins(element.type, modifierType);

    for (let i = 0; i < plugins.length; i++) {
        let plugin = plugins[i];
        plugin[modifierType]({ element, context });
    }

    if (Array.isArray(element.elements)) {
        for (let i = 0; i < element.elements.length; i++) {
            syncModifiers({ context, element: element.elements[i], modifierType });
        }
    }
};

const asyncModifiers = async ({ context, modifierType, element }) => {
    if (!isValidElement(element)) {
        return;
    }

    const plugins = getModifierPlugins(element.type, modifierType);

    for (let i = 0; i < plugins.length; i++) {
        let plugin = plugins[i];
        await plugin[modifierType]({ element, context });
    }

    if (Array.isArray(element.elements)) {
        for (let i = 0; i < element.elements.length; i++) {
            await asyncModifiers({ context, element: element.elements[i], modifierType });
        }
    }
};

export default context =>
    class ContentAttribute extends ObjectAttribute {
        async getStorageValue(): Promise<any> {
            const element = this.getValue();
            await asyncModifiers({
                context,
                element,
                modifierType: "getStorageValue"
            });
            return element;
        }

        setStorageValue(value: mixed) {
            const element = value;
            syncModifiers({
                context,
                element,
                modifierType: "setStorageValue"
            });
            this.value.setCurrent(element, { skipDifferenceCheck: true, forceSetAsClean: true });
            return this;
        }
    };
