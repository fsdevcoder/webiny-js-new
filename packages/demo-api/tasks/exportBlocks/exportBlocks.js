/* eslint-disable */
// @flowIgnore
import config from "../../src/configs";
import fs from "fs-extra";
import { blue, green } from "chalk";

const pwd: string = (process.cwd(): any);

const copyImage = (srcFilename, targetFilename = null) => {
    const src = `${pwd}/../../.files/${srcFilename}`;
    const dest = `${pwd}/../webiny-api-cms/src/install/plugins/importData/blocks/images/${targetFilename ||
        srcFilename}`;
    fs.copySync(src, dest);
};

const writeIndexFile = content => {
    const dest = `${pwd}/../webiny-api-cms/src/install/plugins/importData/blocks/index.js`;

    fs.writeFileSync(dest, content);
};

export default async () => {
    fs.emptyDirSync(`${pwd}/../webiny-api-cms/src/install/plugins/importData/blocks`);
    const { database } = await config();

    const blocks = await database.mongodb
        .collection("CmsElement")
        .find({ deleted: false, type: "block" })
        .toArray();

    const exportedBlocks = [];
    const exportedFiles = [];

    for (let i = 0; i < blocks.length; i++) {
        const data = blocks[i];
        // Copy images.
        const regex = /(image|file|preview)":"([a-f0-9]{24})"/gm;

        const str = JSON.stringify(data);
        let m;

        console.log(`===========================\n> Block: ${data.name}`);
        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            if (Array.isArray(m)) {
                const [, , id] = m;
                if (exportedFiles.find(item => item.id === id)) {
                    continue;
                }
                const file = await database.mongodb.collection("File").findOne({ id });
                if (!file.meta) {
                    file.meta = {};
                }
                file.meta.private = true;

                file.name = file.src.match(/\/files\/(.*)/);
                file.name = file.name[1];

                exportedFiles.push(file);
                console.log(`${green("> Copy image:")} ${file.name}`);
                copyImage(file.name);
            }
        }

       /* console.log(`${blue("> Copy preview:")} ${data.preview.src}`);
        const previewName = data.preview.src.match(/\/files\/(.*)/)[1];
        let targetName = previewName;
        if (!targetName.startsWith("cms-element-")) {
            console.log(blue("Modifying file name"), previewName);
            targetName = `cms-element-${data.id}_${previewName}`;
            data.preview.name = targetName;
            data.preview.src = data.preview.src.replace(previewName, targetName);
        }
        copyImage(previewName, targetName);*/

        exportedBlocks.push(data);
    }

    // Generate code to include blocks in the installation process
    const index = [
        "// NOTE: THIS FILE IS AUTO-GENERATED. MANUAL CHANGES OF THIS FILE WILL BE LOST!\n",
        "",
        `export const blocks = [${exportedBlocks.map(b => JSON.stringify(b)).join(",\n")}];`,
        `export const files = [${exportedFiles.map(f => JSON.stringify(f)).join(",\n")}];`
    ].join("\n");

    console.log("\n> Writing index file...");
    writeIndexFile(index);

    console.log(`\nDone! Successfully exported ${exportedBlocks.length} blocks!`);
};
