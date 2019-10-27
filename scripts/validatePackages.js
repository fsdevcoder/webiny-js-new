const path = require("path");
const readJson = require("load-json-file");
const getPackages = require("get-yarn-workspaces");
const { blue, red } = require("chalk");

(async () => {
    console.log("Validating packages...");
    const packages = getPackages().filter(p => !p.includes("examples/"));
    const errors = [];
    for (let i = 0; i < packages.length; i++) {
        const package = packages[i];
        const json = await readJson(path.join(package, "package.json"));
        if (!json.private) {
            // Check publishConfig
            if (!json.publishConfig) {
                errors.push(
                    `${blue(">")} Missing ${blue("publishConfig.access")} in ${red(
                        path.basename(json.name)
                    )}!`
                );
            }

            if (!json.scripts["prepublishOnly"]) {
                errors.push(
                    `${blue(">")} Missing ${blue("prepublishOnly")} script in ${red(
                        path.basename(json.name)
                    )}!`
                );
            }
        }
    }

    if (errors.length) {
        errors.forEach(msg => console.log(msg));
        process.exit(1);
    }

    console.log(`✅ All packages are configured correctly!`);
    process.exit(0);
})();
