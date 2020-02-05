import { Response, NotFoundResponse, ErrorResponse } from "@webiny/api";
import { listPublishedPages } from "./listPublishedPages";

export default async (root: any, args: { [key: string]: any }, context: { [key: string]: any }) => {
    const { PbSettings } = context.models;
    const settings = await PbSettings.load();
    if (!settings.data.installation.completed) {
        return new ErrorResponse({
            code: "PB_NOT_INSTALLED",
            message: "Cannot get published pages, Page Builder is not installed."
        });
    }

    if (!args.parent && !args.url && !args.id) {
        return new NotFoundResponse("Page ID, parent or URL missing.");
    }

    // We utilize the same query used for listing published pages (single source of truth = less maintenance).
    const [page] = await listPublishedPages({ context, args: { ...args, perPage: 1 } });
    if (!page) {
        return new NotFoundResponse("The requested page was not found.");
    }

    return new Response(page);
};
