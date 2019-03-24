// @flow
import { ErrorResponse, Response, NotFoundResponse } from "webiny-api/graphql";

export default async (root: any, args: Object, context: Object) => {
    const { CmsSettings, Page } = context.cms.entities;
    const { id } = args;

    const newHomePage = await Page.findById(id);

    if (!newHomePage) {
        return new NotFoundResponse(id);
    }

    const settings = await CmsSettings.load();
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
