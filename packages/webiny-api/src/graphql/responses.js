// @flow
import type { Entity, EntityCollection } from "webiny-entity";

type ErrorResponseParams = {
    code?: string,
    message?: string,
    data?: any
};

const defaultParams = {
    code: "",
    message: "",
    data: null
};

export class ErrorResponse {
    data: null;
    error: {
        code: string,
        message: string,
        data?: any
    };
    constructor(params: ErrorResponseParams) {
        this.data = null;
        this.error = {
            code: params.code || defaultParams.code,
            message: params.message || defaultParams.message,
            data: params.data || defaultParams.data
        };
    }
}

export class ListErrorResponse {
    data: null;
    meta: null;
    error: {
        code: string,
        message: string,
        data?: any
    };
    constructor(params: ErrorResponseParams) {
        this.data = null;
        this.meta = null;
        this.error = {
            code: params.code || defaultParams.code,
            message: params.message || defaultParams.message,
            data: params.data || defaultParams.data
        };
    }
}

export class Response {
    data: any;
    error: null;
    constructor(data: any) {
        this.data = data;
        this.error = null;
    }
}

export class ListResponse {
    data: EntityCollection<Entity> | Array<any>;
    meta: Object;
    error: null;
    constructor(data: EntityCollection<Entity> | Array<any>, meta: Object) {
        this.data = data;
        this.meta = meta;
        this.error = null;
    }
}
