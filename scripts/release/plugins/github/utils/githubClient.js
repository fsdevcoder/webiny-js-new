/**
 * Original code of @semantic-release/github (https://github.com/semantic-release/github)
 * AUTHOR: Pierre Vanduynslager (https://twitter.com/@pvdlg_)
 * CONTRIBUTORS:
 * - Stephan Bönnemann <stephan@boennemann.me> (http://boennemann.me)
 * - Gregor Martynus (https://twitter.com/gr2m)
 */

const _ = require("lodash");
const Octokit = require("@octokit/rest");
const pRetry = require("p-retry");
const Bottleneck = require("bottleneck");

/**
 * Default exponential back off configuration for retries.
 */
const DEFAULT_RETRY = { retries: 3, factor: 2, minTimeout: 1000 };

/**
 * Rate limit per API endpoints.
 *
 * See {@link https://developer.github.com/v3/#rate-limiting|Rate limiting}.
 */
const RATE_LIMITS = {
    core: 60 * 60 * 1000 / 5000 // 5000 calls per hour => 1 call per 720ms
};

/**
 * Global rate limit to prevent abuse.
 *
 * See {@link https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits|Dealing with abuse rate limits}
 */
const GLOBAL_RATE_LIMIT = 1000;

/**
 * Http error codes for which to not retry.
 */
const SKIP_RETRY_CODES = [400, 401, 403];

/**
 * Create or retrieve the throttler function for a given rate limit group.
 *
 * @param {Array} rate The rate limit group.
 * @param {String} limit The rate limits per API endpoints.
 * @param {Bottleneck} globalThrottler The global throttler.
 * @return {Bottleneck} The throller function for the given rate limit group.
 */
const getThrottler = _.memoize((rate, limit, globalThrottler) =>
    new Bottleneck({ minTime: limit[rate] }).chain(globalThrottler)
);

/**
 * Create a`handler` for a `Proxy` wrapping an Octokit instance to:
 * - Recursively wrap the child objects of the Octokit instance in a `Proxy`
 * - Throttle and retry the Octokit instance functions
 *
 * @param {Object} retry The configuration to pass to `p-retry`.
 * @param {Array} limit The rate limits per API endpoints.
 * @param {Throttler} globalThrottler The throttler function for the global rate limit.
 * @return {Function} The `handler` for a `Proxy` wrapping an Octokit instance.
 */
const handler = (retry, limit, globalThrottler) => ({
    /**
     * If the target has the property as own, determine the rate limit based on the property name and recursively wrap the value in a `Proxy`. Otherwise returns the property value.
     *
     * @param {Object} target The target object.
     * @param {String} name The name of the property to get.
     * @return {Any} The property value or a `Proxy` of the property value.
     */
    get: (target, name) => {
        return new Proxy(target[name], handler(retry, limit, globalThrottler, name));
    },

    /**
     * Create a throttled version of the called function then call it and retry it if the call fails with certain error code.
     *
     * @param {Function} func The target function.
     * @param {Any} that The this argument for the call.
     * @param {Array} args The list of arguments for the call.
     * @return {Promise<Any>} The result of the function called.
     */
    apply: (func, that, args) => {
        const throttler = getThrottler("core", limit, globalThrottler);

        return pRetry(async () => {
            try {
                return await throttler.wrap(func)(...args);
            } catch (err) {
                if (SKIP_RETRY_CODES.includes(err.code)) {
                    throw new pRetry.AbortError(err);
                }
                throw err;
            }
        }, retry);
    }
});

module.exports = ({
    githubToken,
    retry = DEFAULT_RETRY,
    limit = RATE_LIMITS,
    globalLimit = GLOBAL_RATE_LIMIT
}) => {
    const github = new Octokit();
    github.authenticate({ type: "token", token: githubToken });
    return new Proxy(github, handler(retry, limit, new Bottleneck({ minTime: globalLimit })));
};
