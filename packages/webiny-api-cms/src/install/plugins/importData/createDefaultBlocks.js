// @flow
import get from "lodash/get";
import fs from "fs-extra";
import { blocks } from "./blocks";
import path from "path";

const createDefaultBlocks = async (context: Object) => {
    const { Element } = context.cms.entities;

    for (let i = 0; i < blocks.length; i++) {
        let data = blocks[i];
        const element = new Element();
        element.populate(data);
        await element.save();
    }

    // Copy images.
    if (get(context, "cms.copyFiles", true) !== false) {
        const folder: string = path.join(
            process.cwd(),
            "/",
            get(context, "cms.copyFilesTo") || "static"
        );
        await fs.copy(`${__dirname}/blocks/images`, folder);
    }
};

export default createDefaultBlocks;
