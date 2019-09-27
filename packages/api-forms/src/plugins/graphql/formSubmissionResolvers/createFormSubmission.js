// @flow
import { ErrorResponse, NotFoundResponse, Response } from "@webiny/api";

export default async (root: any, args: Object, context: Object) => {
    const { Form } = context.models;
    const form = await Form.findById(args.id);

    if (!form || !form.published) {
        return new NotFoundResponse(`Form with id "${args.id}" was not found!`);
    }

    try {
        await form.submit(args);
    } catch (e) {
        return new ErrorResponse({
            code: e.code,
            message: e.message,
            data: e.data
        });
    }
    return new Response();
};
