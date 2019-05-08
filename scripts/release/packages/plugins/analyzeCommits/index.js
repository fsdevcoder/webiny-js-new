const semver = require("semver");
const { template } = require("lodash");
const { analyzeCommits } = require("@semantic-release/commit-analyzer");
const getCommits = require("./getCommits");
const getLastReleaseFactory = require("./getLastRelease");

/**
 * Plugin factory.
 * @param {Object} pluginConfig
 * @param {Object} pluginConfig.commitAnalyzer (Optional) (https://github.com/semantic-release/commit-analyzer#options)
 * @param {Function} pluginConfig.isRelevant (Optional) A function to determine if the commit is relevant to the package.
 * @returns {function(*, *)}
 */
module.exports = (pluginConfig = {}) => {
    /**
     * Analyze commits for all packages and determine next release version
     */
    return async (params, next, finish) => {
        const { logger, config, git } = params;

        const getLastRelease = getLastReleaseFactory({ logger, git });

        // Fetch all commits and tags
        await git.fetchAll();

        // Detect next version
        const lastRelease = await getLastRelease(config.tagFormat);
        const commits = await getCommits(lastRelease.gitHead, config.branch, logger);
        let relevantCommits = commits;

        if (typeof pluginConfig.isRelevant === "function") {
            relevantCommits = commits.filter(commit => pluginConfig.isRelevant(params.packages, commit));
        }

        if (!relevantCommits.length) {
            logger.log(`No relevant commits were found!`);
            return finish();
        }

        // Store lastRelease for later use
        params["lastRelease"] = lastRelease;
        params["commits"] = relevantCommits;

        const type = await analyzeCommits(
            pluginConfig.commitAnalyzer || {},
            Object.assign({ logger, commits })
        );

        if (!type) {
            logger.info(`No relevant commits indicate a release!`);
            return finish();
        }

        let version;
        if (lastRelease.version) {
            version = semver.inc(lastRelease.version, type);
            logger.info("The next release version is %s", version);
        } else {
            version = "1.0.0";
            logger.info("There is no previous release, the next release version is %s", version);
        }
        params["nextRelease"] = {
            type,
            version,
            gitHead: await git.head(),
            gitTag: template(config.tagFormat)({ version })
        };
        next();
    };
};
