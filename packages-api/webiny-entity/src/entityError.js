// @flow
class EntityError extends Error {
    static ATTRIBUTE_NOT_FOUND: string;
    message: string;
    data: ?Object;
    type: ?string;

    constructor(message: string, type: ?string, data: ?Object) {
        super();
        this.message = message;
        this.data = data;
        this.type = type;
    }

    setMessage(message: string): this {
        this.message = message;
        return this;
    }

    getMessage(): string {
        return this.message;
    }

    setData(data: ?Object): this {
        this.data = data;
        return this;
    }

    getData(): ?Object {
        return this.data;
    }

    setType(type: string): this {
        this.type = type;
        return this;
    }

    getType(): ?string {
        return this.type;
    }
}

EntityError.ATTRIBUTE_NOT_FOUND = "attributeNotFound";

export default EntityError;
