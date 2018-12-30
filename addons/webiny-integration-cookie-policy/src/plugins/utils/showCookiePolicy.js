// @flow
import load from "webiny-load-assets";

const prepareParams = (params: Object) => {
    const prepared = { content: {}, ...params };

    if (!prepared.content.href) {
        prepared.showLink = false;
    }

    return prepared;
};

const showCookiePolicy = async (params: Object) => {
    await load(
        "//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.0/cookieconsent.min.css",
        "//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.0/cookieconsent.min.js"
    );

    window.cookieconsent.initialise(prepareParams(params));
};

export default showCookiePolicy;
