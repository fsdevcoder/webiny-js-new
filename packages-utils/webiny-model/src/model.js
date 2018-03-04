// @flow
import _ from "lodash";
import extractor from "webiny-data-extractor";
import DefaultAttributesContainer from "./defaultAttributesContainer";
import ModelError from "./modelError";
import type Attribute from "./attribute";

class Model {
    attributes: { [string]: Attribute };
    validating: boolean;
    attributesContainer: DefaultAttributesContainer;

    constructor(params?: Function) {
        this.attributes = {};
        this.validating = false;
        this.attributesContainer = this.createAttributesContainer();

        if (params) {
            if (typeof params === "function") {
                params.call(this);
            } else if (typeof params === "object") {
                // Here, params can be an object, which may contain several options.
                if (typeof params.definition === "function") {
                    params.definition.call(this);
                }
            }
        }

        return new Proxy((this: Object), {
            set: (instance: Model, key: string, value: mixed) => {
                const attr = instance.getAttribute(key);
                if (attr) {
                    attr.setValue(value);
                    return true;
                }

                (instance: Object)[key] = value;
                return true;
            },
            get: (instance: Model, key: string) => {
                const attr = instance.getAttribute(key);
                if (attr) {
                    return attr.getValue();
                }

                return (instance: Object)[key];
            }
        });
    }

    attr(attribute: string): DefaultAttributesContainer {
        return this.getAttributesContainer().attr(attribute);
    }

    createAttributesContainer(): DefaultAttributesContainer {
        return new DefaultAttributesContainer(((this: any): Model));
    }

    getAttributesContainer(): DefaultAttributesContainer {
        return this.attributesContainer;
    }

    getAttribute(attribute: string): ?Attribute {
        if (_.has(this.attributes, attribute)) {
            return this.attributes[attribute];
        }
    }

    setAttribute(name: string, attribute: Attribute): Model {
        this.attributes[name] = attribute;
        return this;
    }

    getAttributes(): { [string]: Attribute } {
        return this.attributes;
    }

    clean(): void {
        _.each(this.attributes, (attribute: Attribute) => {
            attribute.value.clean();
        });
    }

    isDirty(): boolean {
        let name;
        for (name in this.attributes) {
            const attribute: Attribute = this.attributes[name];
            if (attribute.value.isDirty()) {
                return true;
            }
        }
        return false;
    }

    isClean(): boolean {
        return !this.isDirty();
    }

    /**
     * Populates the model with given data.
     */
    populate(data: Object): this {
        if (!_.isObject(data)) {
            throw new ModelError(
                "Populate failed - received data not an object.",
                ModelError.POPULATE_FAILED_NOT_OBJECT
            );
        }

        _.each(this.attributes, (attribute: Attribute, name: string) => {
            if (attribute.getSkipOnPopulate()) {
                return;
            }

            if (_.has(data, name)) {
                attribute.setValue(data[name]);
            }
        });

        return this;
    }

    /**
     * Validates values of all attributes.
     */
    async validate(): Promise<void> {
        if (this.validating) {
            return;
        }
        this.validating = true;

        const invalidAttributes = {};
        await Promise.all(
            Object.keys(this.attributes).map(async (name: string) => {
                const attribute: Attribute = this.attributes[name];
                try {
                    await attribute.validate();
                } catch (e) {
                    if (e instanceof ModelError) {
                        invalidAttributes[name] = {
                            type: e.type,
                            data: e.data,
                            message: e.message
                        };
                    } else {
                        invalidAttributes[name] = {
                            type: ModelError.INVALID_ATTRIBUTE,
                            data: null,
                            message: e.message
                        };
                    }
                }
            })
        );

        this.validating = false;

        if (!_.isEmpty(invalidAttributes)) {
            throw new ModelError("Validation failed.", ModelError.INVALID_ATTRIBUTES, {
                invalidAttributes
            });
        }
    }

    async toJSON(fields: string): Promise<Object> {
        return await extractor.get(this, fields, {
            onRead: async (data, key) => {
                if ("getAttribute" in data && typeof data.getAttribute === "function") {
                    if (!data.getAttribute(key)) {
                        return;
                    }
                    return await data.getAttribute(key).getJSONValue();
                }
                return await data[key];
            }
        });
    }

    async get(path: string | Array<string> = "", defaultValue: ?mixed): Promise<mixed> {
        const steps = typeof path === "string" ? path.split(".") : path;
        let value: Object = this;
        for (let i = 0; i < steps.length; i++) {
            if (!_.isObject(value)) {
                return;
            }

            value = await value[steps[i]];
        }

        return typeof value === "undefined" ? defaultValue : value;
    }

    async set(path: string, value: mixed): Promise<void> {
        const steps = path.split(".");
        const lastStep = steps.pop();

        const model = await this.get(steps);
        if (model && model.getAttribute) {
            const attribute = model.getAttribute(lastStep);
            if (attribute) {
                return attribute.setValue(value);
            }
        }
    }

    /**
     * Returns data that is suitable for latter saving in a storage layer (database, caching etc.). This is useful because attributes can
     * have different values here (eg. only ID sometimes is needed) and also some attributes don't even need to be saved in the storage,
     * which is most often the case with dynamic attributes.
     */
    async toStorage(): Promise<{}> {
        const json = {};
        for (let name in this.getAttributes()) {
            const attribute = this.getAttribute(name);
            // $FlowIgnore - we can be sure we have attribute because it's pulled from list of attributes, using getAttributes() method.
            if (attribute.getToStorage()) {
                // $FlowIgnore - we can be sure we have attribute because it's pulled from list of attributes, using getAttributes() method.
                json[name] = await attribute.getStorageValue();
            }
        }

        return json;
    }

    populateFromStorage(data: Object) {
        if (!_.isObject(data)) {
            throw new ModelError(
                "Populate failed - received data not an object.",
                ModelError.POPULATE_FAILED_NOT_OBJECT
            );
        }

        let name;
        for (name in this.getAttributes()) {
            const attribute = this.getAttribute(name);
            _.has(data, name) &&
                // $FlowIgnore - we can be sure we have attribute because it's pulled from list of attributes, using getAttributes() method.
                attribute.getToStorage() &&
                // $FlowIgnore - we can be sure we have attribute because it's pulled from list of attributes, using getAttributes() method.
                attribute.setStorageValue(data[name]);
        }

        return this;
    }
}

export default Model;
