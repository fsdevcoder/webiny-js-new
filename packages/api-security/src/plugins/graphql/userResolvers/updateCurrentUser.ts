import { Response, NotFoundResponse, ErrorResponse } from "@webiny/commodo-graphql";

export default async (root: any, args: { [key: string]: any }, context: { [key: string]: any }) => {
    const { SecurityUser } = context.models;

    const { user, plugins } = context;

    const currentUser = await SecurityUser.findById(user.id);
    if (currentUser) {
        try {
            currentUser.populate(args.data);
            await currentUser.save();

            const authPlugin = plugins
                .byType("security-authentication-provider")
                // eslint-disable-next-line no-prototype-builtins
                .filter(pl => pl.hasOwnProperty("updateUser"))
                .pop();

            await authPlugin.updateUser({ data: args.data, user: currentUser }, context);

            return new Response(currentUser);
        } catch (e) {
            return new ErrorResponse({
                code: e.code,
                message: e.message,
                data: e.data || null
            });
        }
    }

    return new NotFoundResponse("User not found!");
};
