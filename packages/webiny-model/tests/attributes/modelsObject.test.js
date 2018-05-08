import { assert } from "chai";
import ModelError from "./../../src/modelError";
import { Model } from "../../../webiny-model/src";

describe("attribute models test", function() {
    class Model1 extends Model {
        constructor() {
            super();
            this.attr("name")
                .char()
                .setValidators("required");
            this.attr("number").integer();
            this.attr("type")
                .char()
                .setValidators("in:cat:dog:mouse:parrot");
        }
    }

    class Model2 extends Model {
        constructor() {
            super();
            this.attr("firstName")
                .char()
                .setValidators("required");
            this.attr("lastName")
                .char()
                .setValidators("required");
            this.attr("enabled").boolean();
        }
    }

    const model = new Model(function() {
        this.attr("attribute1").models(Model1, true);
        this.attr("attribute2").models(Model2, true);
    });

    it("should not accept inline functions, must always receive a Model class", async () => {
        class ModelsAttributeWithoutModelsClassModel extends Model {
            constructor() {
                super();
                this.attr("modelsAttribute1").models(() => {});
            }
        }

        try {
            new ModelsAttributeWithoutModelsClassModel();
        } catch (e) {
            assert.equal(
                e.message,
                `"models" attribute "modelsAttribute1" received an invalid class (subclass of Model is required).`
            );
            return;
        }

        throw Error(`Error should've been thrown.`);
    });

    it("should fail - attributes should accept object with models as values", async () => {
        model.attribute1 = new Model1();
        assert.instanceOf(model.attribute1, Model1);

        model.attribute2 = new Model1();
        assert.instanceOf(model.attribute2, Model1);

        try {
            await model.validate();
        } catch (e) {
            assert.equal(e.data.invalidAttributes.attribute1.code, ModelError.INVALID_ATTRIBUTE);
            assert.equal(e.data.invalidAttributes.attribute2.code, ModelError.INVALID_ATTRIBUTE);
            return;
        }

        throw Error("Error should've been thrown.");
    });

    it("should pass - empty objects set", async () => {
        model.attribute1 = {};
        model.attribute2 = {};
        await model.validate();
    });

    it("should fail - object with empty plain objects as values set - nested validation must be triggered", async () => {
        model.attribute1 = { first: {}, second: {} };
        model.attribute2 = { first: {}, second: {}, third: {} };
        try {
            await model.validate();
        } catch (e) {
            assert.deepEqual(e.data, {
                invalidAttributes: {
                    attribute1: {
                        code: "INVALID_ATTRIBUTE",
                        data: [
                            {
                                code: "INVALID_ATTRIBUTES",
                                data: {
                                    index: "first",
                                    invalidAttributes: {
                                        name: {
                                            code: "INVALID_ATTRIBUTE",
                                            data: {
                                                message: "Value is required.",
                                                value: null,
                                                validator: "required"
                                            },
                                            message: "Invalid attribute."
                                        }
                                    }
                                },
                                message: "Validation failed."
                            },
                            {
                                code: "INVALID_ATTRIBUTES",
                                data: {
                                    index: "second",
                                    invalidAttributes: {
                                        name: {
                                            code: "INVALID_ATTRIBUTE",
                                            data: {
                                                message: "Value is required.",
                                                value: null,
                                                validator: "required"
                                            },
                                            message: "Invalid attribute."
                                        }
                                    }
                                },
                                message: "Validation failed."
                            }
                        ],
                        message: "Validation failed."
                    },
                    attribute2: {
                        code: "INVALID_ATTRIBUTE",
                        data: [
                            {
                                code: "INVALID_ATTRIBUTES",
                                data: {
                                    index: "first",
                                    invalidAttributes: {
                                        firstName: {
                                            code: "INVALID_ATTRIBUTE",
                                            data: {
                                                message: "Value is required.",
                                                value: null,
                                                validator: "required"
                                            },
                                            message: "Invalid attribute."
                                        },
                                        lastName: {
                                            code: "INVALID_ATTRIBUTE",
                                            data: {
                                                message: "Value is required.",
                                                value: null,
                                                validator: "required"
                                            },
                                            message: "Invalid attribute."
                                        }
                                    }
                                },
                                message: "Validation failed."
                            },
                            {
                                code: "INVALID_ATTRIBUTES",
                                data: {
                                    index: "second",
                                    invalidAttributes: {
                                        firstName: {
                                            code: "INVALID_ATTRIBUTE",
                                            data: {
                                                message: "Value is required.",
                                                value: null,
                                                validator: "required"
                                            },
                                            message: "Invalid attribute."
                                        },
                                        lastName: {
                                            code: "INVALID_ATTRIBUTE",
                                            data: {
                                                message: "Value is required.",
                                                value: null,
                                                validator: "required"
                                            },
                                            message: "Invalid attribute."
                                        }
                                    }
                                },
                                message: "Validation failed."
                            },
                            {
                                code: "INVALID_ATTRIBUTES",
                                data: {
                                    index: "third",
                                    invalidAttributes: {
                                        firstName: {
                                            code: "INVALID_ATTRIBUTE",
                                            data: {
                                                message: "Value is required.",
                                                value: null,
                                                validator: "required"
                                            },
                                            message: "Invalid attribute."
                                        },
                                        lastName: {
                                            code: "INVALID_ATTRIBUTE",
                                            data: {
                                                message: "Value is required.",
                                                value: null,
                                                validator: "required"
                                            },
                                            message: "Invalid attribute."
                                        }
                                    }
                                },
                                message: "Validation failed."
                            }
                        ],
                        message: "Validation failed."
                    }
                }
            });

            return;
        }
        throw Error("Error should've been thrown.");
    });

    it("should pass - valid data sent", async () => {
        model.attribute1 = {
            first: { name: "Enlai", type: "dog" },
            second: { name: "Rocky", type: "dog" },
            third: { name: "Lina", type: "parrot" }
        };
        model.attribute2 = {
            first: { firstName: "John", lastName: "Doe" },
            second: { firstName: "Jane", lastName: "Doe" }
        };
        await model.validate();
    });

    it("should fail - all good except last item of attribute1", async () => {
        model.attribute1 = {
            first: { name: "Enlai", type: "dog" },
            second: { name: "Rocky", type: "dog" },
            third: { name: "Lina", type: "bird" }
        };
        model.attribute2 = {
            first: { firstName: "John", lastName: "Doe" },
            second: { firstName: "Jane", lastName: "Doe" }
        };

        try {
            await model.validate();
        } catch (e) {
            assert.deepEqual(e.data, {
                invalidAttributes: {
                    attribute1: {
                        code: "INVALID_ATTRIBUTE",
                        data: [
                            {
                                code: "INVALID_ATTRIBUTES",
                                data: {
                                    index: "third",
                                    invalidAttributes: {
                                        type: {
                                            code: "INVALID_ATTRIBUTE",
                                            data: {
                                                message:
                                                    "Value must be one of the following: cat, dog, mouse, parrot.",
                                                value: "bird",
                                                validator: "in"
                                            },
                                            message: "Invalid attribute."
                                        }
                                    }
                                },
                                message: "Validation failed."
                            }
                        ],
                        message: "Validation failed."
                    }
                }
            });
        }
    });

    it("should fail on validation since an item is not an object of any type", async () => {
        const newModel = new Model(function() {
            this.attr("attribute1").models(Model1, true);
        });

        newModel.attribute1 = {
            first: { name: "Enlai", type: "dog" },
            second: { name: "Rocky", type: "dog" },
            last: 123
        };

        try {
            await newModel.validate();
        } catch (e) {
            assert.deepEqual(e.data, {
                invalidAttributes: {
                    attribute1: {
                        code: "INVALID_ATTRIBUTE",
                        data: [
                            {
                                code: "INVALID_ATTRIBUTE",
                                data: {
                                    index: "last"
                                },
                                message:
                                    "Validation failed, item at index last not an instance of Model class."
                            }
                        ],
                        message: "Validation failed."
                    }
                }
            });
            return;
        }

        throw Error("Error should've been thrown.");
    });

    it("validation must be executed on both attribute and model level", async () => {
        const newModel = new Model(function() {
            this.attr("attribute1")
                .models(Model1, true)
                .setValidators("required,minLength:2");
        });

        let error = null;
        try {
            await newModel.validate();
        } catch (e) {
            error = e;
        }

        assert.instanceOf(error, ModelError);
        assert.deepEqual(error.data, {
            invalidAttributes: {
                attribute1: {
                    code: "INVALID_ATTRIBUTE",
                    data: {
                        message: "Value is required.",
                        value: null,
                        validator: "required"
                    },
                    message: "Invalid attribute."
                }
            }
        });

        error = null;
        try {
            newModel.attribute1 = { first: { name: "Enlai", type: "dog" } };
            await newModel.validate();
        } catch (e) {
            error = e;
        }

        assert.equal(
            error.data.invalidAttributes.attribute1.data.message,
            "Value requires at least 2 items."
        );
        assert.equal(error.data.invalidAttributes.attribute1.data.validator, "minLength");
        assert.equal(error.data.invalidAttributes.attribute1.message, "Invalid attribute.");

        newModel.attribute1 = {
            first: { name: "Enlai", type: "dog" },
            second: { name: "Enlai", type: "dog" }
        };
        await newModel.validate();
    });

    it("should not set value if setOnce is enabled", async () => {
        const newModel = new Model(function() {
            this.attr("attribute1").models(Model1, true);
        });

        newModel.attribute1 = {
            first: { name: "Enlai", type: "dog" },
            second: { name: "Rocky", type: "dog" },
            third: { name: "Lina", type: "bird" }
        };

        newModel.getAttribute("attribute1").setOnce();

        await newModel.set("attribute1", null);

        assert.equal(await newModel.get("attribute1.first.name"), "Enlai");
        assert.equal(await newModel.get("attribute1.second.name"), "Rocky");
        assert.equal(await newModel.get("attribute1.third.name"), "Lina");
    });

    it("getJSONValue must return an empty object if nothing was set", async () => {
        const newModel = new Model(function() {
            this.attr("attribute1").models(Model1, true);
        });

        assert.deepEqual(await newModel.getAttribute("attribute1").getJSONValue(), {});
    });

    it("getStorageValue method must return empty object if nothing is set", async () => {
        const newModel = new Model(function() {
            this.attr("attribute1").models(Model1, true);
        });

        assert.deepEqual(await newModel.getAttribute("attribute1").getStorageValue(), {});
    });

    it("getStorageValue method must return initially set value if it's not an object", async () => {
        const newModel = new Model(function() {
            this.attr("attribute1").models(Model1, true);
        });

        newModel.attribute1 = null;
        assert.deepEqual(await newModel.getAttribute("attribute1").getStorageValue(), {});
    });

    it("getStorageValue must iterate through all models and all of its attributes and return its storage values", async () => {
        const storageModel = new Model(function() {
            this.attr("attribute1").models(Model1, true);
            this.attr("attribute2").models(Model2, true);
        });

        storageModel.attribute1 = {
            pet1: { name: "Enlai", type: "dog" },
            pet2: { name: "Rocky", type: "dog" },
            pet3: { name: "Lina", type: "parrot" }
        };

        storageModel.attribute2 = {
            user1: { firstName: "John", lastName: "Doe" },
            user2: { firstName: "Jane", lastName: "Doe" }
        };

        const data = await storageModel.toStorage();

        assert.deepEqual(data, {
            attribute1: {
                pet1: {
                    number: null,
                    name: "Enlai",
                    type: "dog"
                },
                pet2: {
                    number: null,
                    name: "Rocky",
                    type: "dog"
                },
                pet3: {
                    number: null,
                    name: "Lina",
                    type: "parrot"
                }
            },
            attribute2: {
                user1: {
                    enabled: null,
                    firstName: "John",
                    lastName: "Doe"
                },
                user2: {
                    enabled: null,
                    firstName: "Jane",
                    lastName: "Doe"
                }
            }
        });
    });

    it("when toJSON is called, it must return values correctly", async () => {
        const newModel = new Model(function() {
            this.attr("attribute1").models(Model1, true);
        });

        newModel.attribute1 = {};
        assert.deepEqual(await newModel.toJSON("attribute1.name"), {
            attribute1: {}
        });

        newModel
            .getAttribute("attribute1")
            .setStorageValue({ first: { name: "one" }, second: { name: "two" } });
        assert.deepEqual(await newModel.toJSON("attribute1[first.name,second.name]"), {
            attribute1: { first: { name: "one" }, second: { name: "two" } }
        });

        newModel.attribute1 = null;
        assert.deepEqual(await newModel.toJSON("attribute1.name"), {
            attribute1: null
        });
    });

    it("getJSONValue must return values correctly", async () => {
        const newModel = new Model(function() {
            this.attr("attribute1").models(Model1, true);
        });

        newModel.attribute1 = {};
        assert.deepEqual(await newModel.getAttribute("attribute1").getJSONValue(), {});

        newModel.attribute1 = 123;
        assert.deepEqual(await newModel.getAttribute("attribute1").getJSONValue(), 123);
    });

    it("getJSONValue must return empty objects as items", async () => {
        const newModel = new Model(function() {
            this.attr("attribute1").models(Model1, true);
        });

        newModel.attribute1 = { first: { name: 123, age: 123 }, second: { name: 234, age: 456 } };
        assert.deepEqual(await newModel.getAttribute("attribute1").getJSONValue(), {});
    });

    it("onSet/onGet must be triggered correctly", async () => {
        const newModel = new Model(function() {
            this.attr("someModels").models(Model1, true);
        });

        newModel.getAttribute("someModels").onSet(value => {
            const final = {};
            for (let name in value) {
                final["key_" + name] = value[name];
            }
            return final;
        });

        newModel.populate({
            someModels: {
                first: {
                    name: "Webiny LTD",
                    city: "London"
                },
                second: {
                    name: "Webiny LTD 2",
                    city: "London 2"
                }
            }
        });

        assert.equal(newModel.someModels.key_first.name, "Webiny LTD");
        assert.equal(newModel.someModels.key_second.name, "Webiny LTD 2");

        newModel.getAttribute("someModels").onGet(() => {
            return "random";
        });

        assert.equal(newModel.someModels, "random");
    });
});
