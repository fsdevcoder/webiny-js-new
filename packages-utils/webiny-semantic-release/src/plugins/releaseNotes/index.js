const releaseNotesGenerator = require("@semantic-release/release-notes-generator");

export default () => {
    return async ({ packages, config: { repositoryUrl } }, next) => {
        // Detect next version for all packages
        for (let i = 0; i < packages.length; i++) {
            const pkg = packages[i];
            if (!pkg.nextRelease || !pkg.nextRelease.version) {
                continue;
            }

            pkg.nextRelease["notes"] = await releaseNotesGenerator(
                {},
                {
                    commits: pkg.commits,
                    lastRelease: pkg.lastRelease || {},
                    nextRelease: pkg.nextRelease,
                    options: { repositoryUrl }
                }
            );
        }

        next();
    };
};
