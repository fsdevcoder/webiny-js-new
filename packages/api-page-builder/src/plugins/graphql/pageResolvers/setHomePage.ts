import { ErrorResponse, Response, NotFoundResponse } from "@webiny/api";

export default async (root: any, args: {[key: string]: any}, context: {[key: string]: any}) => {
    const { PbPage, PbSettings } = context.models;

    const { id } = args;

    const newHomePage = await PbPage.findById(id);

    if (!newHomePage) {
        return new NotFoundResponse(id);
    }

    const settings = await PbSettings.load();
    if (settings.data.pages.home === newHomePage.parent) {
        return new ErrorResponse({
            code: "ALREADY_HOMEPAGE",
            message: `The page is already set as homepage.`
        });
    }

    if (!newHomePage.published) {
        newHomePage.published = true;
        await newHomePage.save();
    }

    settings.data.pages.home = newHomePage.parent;
    await settings.save();

    return new Response(newHomePage);
};
