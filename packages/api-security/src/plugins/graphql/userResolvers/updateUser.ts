import { WithFieldsError } from "@webiny/commodo";
import { ErrorResponse, Response, NotFoundResponse } from "@webiny/api";
import { InvalidFieldsError } from "@webiny/commodo-graphql";

export default userFetcher => async (
    root: any,
    args: { [key: string]: any },
    context: { [key: string]: any }
) => {
    const { id, ...data } = args;
    const User = userFetcher(context);
    const user = await User.findById(id);

    if (!user) {
        return new NotFoundResponse(id ? `User "${id}" not found!` : "User not found!");
    }

    try {
        await user.populate(data).save();

        const authPlugin = context.plugins
            .byType("security-authentication-provider")
            // eslint-disable-next-line no-prototype-builtins
            .filter(pl => pl.hasOwnProperty("updateUser"))
            .pop();

        await authPlugin.updateUser({ data: args.data, user }, context);
    } catch (e) {
        if (e.code === WithFieldsError.VALIDATION_FAILED_INVALID_FIELDS) {
            const attrError = InvalidFieldsError.from(e);
            return new ErrorResponse({
                code: attrError.code || WithFieldsError.VALIDATION_FAILED_INVALID_FIELDS,
                message: attrError.message,
                data: attrError.data
            });
        }
        return new ErrorResponse({
            code: e.code,
            message: e.message,
            data: e.data
        });
    }
    return new Response(user);
};
