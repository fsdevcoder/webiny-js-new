// @flow
import { Entity, type EntityCollection } from "webiny-entity";
import type { ICategory } from "./Category.entity";
import type { IRevision } from "./Revision.entity";

export interface IPage extends Entity {
    createdBy: string;
    activeRevision: Promise<IRevision>;
    revisions: Promise<EntityCollection>;
    category: Promise<ICategory>;
    status: "draft" | "published";
}

export const pageFactory = ({ user, entities }: Object): Class<IPage> => {
    return class Page extends Entity {
        static classId = "CmsPage";
        static storageClassId = "Cms_Pages";

        createdBy: string;
        activeRevision: Promise<IRevision>;
        revisions: Promise<EntityCollection>;
        category: Promise<ICategory>;
        status: "draft" | "published";

        constructor() {
            super();

            const { Revision, Category } = entities;

            this.attr("createdBy").char();

            this.attr("activeRevision")
                .entity(Revision)
                .setDynamic(async () => {
                    const publishedRevision = await Revision.findOne({
                        query: { page: this.id, published: true }
                    });

                    if (publishedRevision) {
                        return publishedRevision;
                    }

                    // Find latest revision
                    return await Revision.findOne({
                        query: { page: this.id },
                        sort: { createdOn: -1 }
                    });
                });

            this.attr("revisions").entities(Revision);

            this.attr("category")
                .entity(Category)
                .setValidators("required");

            this.attr("status")
                .char()
                .setValidators("in:draft:published:trash")
                .setDefaultValue("draft");

            this.on("beforeCreate", () => {
                this.createdBy = user.id;
            });

            this.on("afterCreate", async () => {
                const revision = new Revision();
                revision.populate({
                    page: this,
                    title: "Untitled",
                    slug: (await this.category).url + "untitled-" + this.id,
                    name: "Revision #1"
                });
                await revision.save();
            }).setOnce();
        }
    };
};
