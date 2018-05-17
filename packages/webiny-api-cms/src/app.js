// @flow
import Page from "./entities/page.entity";
import Revision from "./entities/revision.entity";
import Category from "./entities/category.entity";
import Widget from "./entities/widget.entity";
import addPageQueries from "./queries/page";
import { argv } from "yargs";

export default () => {
    return async ({ app }: Object, next: Function) => {
        app.graphql.schema(schema => {
            schema.addEntity(Page);
            schema.addEntity(Category);
            schema.addEntity(Revision);
            schema.addEntity(Widget);

            addPageQueries(schema);

            app.entities.addEntityClass(Page);
            app.entities.addEntityClass(Category);
            app.entities.addEntityClass(Revision);
            app.entities.addEntityClass(Widget);
        });

        if (argv.install) {
            const { default: install } = await import("./install");
            await install();
        }

        next();
    };
};
