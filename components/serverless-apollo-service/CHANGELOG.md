# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.2.0-next.1](https://github.com/Pavel910/webiny-js/compare/@webiny/serverless-apollo-service@2.2.0-next.0...@webiny/serverless-apollo-service@2.2.0-next.1) (2019-11-20)


### Bug Fixes

* add support for Windows project setup ([dc1a375](https://github.com/Pavel910/webiny-js/commit/dc1a375b95d671958337f9b064e07f64ab121b6d))





# [2.2.0-next.0](https://github.com/Pavel910/webiny-js/compare/@webiny/serverless-apollo-service@2.1.0...@webiny/serverless-apollo-service@2.2.0-next.0) (2019-11-18)


### Features

* add support for DB drivers and improve components. ([3ce1908](https://github.com/Pavel910/webiny-js/commit/3ce1908))
* move most of the boilerplate logic into plugins. ([8d856bb](https://github.com/Pavel910/webiny-js/commit/8d856bb))





# [2.1.0](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@2.0.0...@webiny/serverless-apollo-service@2.1.0) (2019-11-08)


### Features

* add support for selective component deploy and improve debug output. ([#610](https://github.com/Webiny/webiny-js/issues/610)) ([5c3acb0](https://github.com/Webiny/webiny-js/commit/5c3acb0))





# [2.0.0](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.5.0...@webiny/serverless-apollo-service@2.0.0) (2019-10-29)

**Note:** Version bump only for package @webiny/serverless-apollo-service





# [0.5.0](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.4.1...@webiny/serverless-apollo-service@0.5.0) (2019-10-29)


### Bug Fixes

* improve resource naming and add binaryMediaTypes support. ([42f8da0](https://github.com/Webiny/webiny-js/commit/42f8da0))
* key ([26fee95](https://github.com/Webiny/webiny-js/commit/26fee95))
* make sure apollo flags are booleans. ([43456f1](https://github.com/Webiny/webiny-js/commit/43456f1))
* remove getDatabase from context and remove "mongodb" key from config. ([191e419](https://github.com/Webiny/webiny-js/commit/191e419))


### Features

* add "graphqlPath" to output ([028f6b2](https://github.com/Webiny/webiny-js/commit/028f6b2))





## [0.4.1](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.4.0...@webiny/serverless-apollo-service@0.4.1) (2019-10-24)


### Bug Fixes

* remove project-utils usages from apollo-service. ([2aee36a](https://github.com/Webiny/webiny-js/commit/2aee36a))





# [0.4.0](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.3.5...@webiny/serverless-apollo-service@0.4.0) (2019-10-24)


### Bug Fixes

* remove dependency on project-utils. ([a026795](https://github.com/Webiny/webiny-js/commit/a026795))


### Features

* expose "webpackConfig" input to customize build of apollo-service component. ([48dfa94](https://github.com/Webiny/webiny-js/commit/48dfa94))





## [0.3.5](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.3.4...@webiny/serverless-apollo-service@0.3.5) (2019-10-24)

**Note:** Version bump only for package @webiny/serverless-apollo-service





## [0.3.4](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.3.3...@webiny/serverless-apollo-service@0.3.4) (2019-10-23)


### Bug Fixes

* add explicit webpack module resolve folder priorities for boilerplate code. ([ce29b32](https://github.com/Webiny/webiny-js/commit/ce29b32))





## [0.3.3](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.3.2...@webiny/serverless-apollo-service@0.3.3) (2019-10-21)

**Note:** Version bump only for package @webiny/serverless-apollo-service





## [0.3.2](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.3.1...@webiny/serverless-apollo-service@0.3.2) (2019-10-21)


### Bug Fixes

* make sure all API Gateways are deployed through serverless-api-gateway component. ([e1afd3d](https://github.com/Webiny/webiny-js/commit/e1afd3d7921747fc3e995b9f7dcead3aef72d651))
* remove the "enabled" flag, security must always be enabled ([b14cb32](https://github.com/Webiny/webiny-js/commit/b14cb3215591b53f7a2c75e6c06b79592cc0acdb))
* remove WEBINY prefix usage. ([8ea936e](https://github.com/Webiny/webiny-js/commit/8ea936ea4c2aeb6ff42ea2f01642440cfbcf5184))





## [0.3.1](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.3.0...@webiny/serverless-apollo-service@0.3.1) (2019-10-17)


### Bug Fixes

* add missing LICENSE and README files. ([4b2b895](https://github.com/Webiny/webiny-js/commit/4b2b895))
* increase default memory to 512 ([5eae46d](https://github.com/Webiny/webiny-js/commit/5eae46d))





# [0.3.0](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.2.3...@webiny/serverless-apollo-service@0.3.0) (2019-10-16)


### Features

* add serverless-aws-api-gateway component. ([71bac3f](https://github.com/Webiny/webiny-js/commit/71bac3f))





## [0.2.3](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.2.2...@webiny/serverless-apollo-service@0.2.3) (2019-10-16)


### Bug Fixes

* pass region when creating API gateways ([9fe7a1e](https://github.com/Webiny/webiny-js/commit/9fe7a1e7e8118123fd95f07245796dc5f8700cff))
* pass region when creating functions ([4db8636](https://github.com/Webiny/webiny-js/commit/4db86362b8d43d7d88a1dc5f9fcbade55977da8e))





## [0.2.2](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.2.1...@webiny/serverless-apollo-service@0.2.2) (2019-10-15)


### Bug Fixes

* add babel-loader to dependencies ([08a50d3](https://github.com/Webiny/webiny-js/commit/08a50d309fb45bed7107aa70d6923ad48838a264))





## [0.2.1](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.2.0...@webiny/serverless-apollo-service@0.2.1) (2019-10-14)


### Bug Fixes

* synced dependencies across all packages ([#567](https://github.com/Webiny/webiny-js/issues/567)) ([38eda54](https://github.com/Webiny/webiny-js/commit/38eda547bead6e8a2c46875730bbcd8f1227e475))





# [0.2.0](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.1.7...@webiny/serverless-apollo-service@0.2.0) (2019-10-10)


### Bug Fixes

* remove unused component name. ([8a3587f](https://github.com/Webiny/webiny-js/commit/8a3587f))
* renamed "extraEndpoints" to just "endpoints" ([9538b13](https://github.com/Webiny/webiny-js/commit/9538b13))


### Features

* rename extraEndpoints to endpoints ([92e8a4e](https://github.com/Webiny/webiny-js/commit/92e8a4e))





## [0.1.7](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.1.6...@webiny/serverless-apollo-service@0.1.7) (2019-10-08)


### Bug Fixes

* add component version to tracking. ([6fdaad9](https://github.com/Webiny/webiny-js/commit/6fdaad9))
* empty component state on component removal. ([2dc7899](https://github.com/Webiny/webiny-js/commit/2dc7899))





## [0.1.6](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.1.5...@webiny/serverless-apollo-service@0.1.6) (2019-10-07)


### Bug Fixes

* improve handling of boilerplate dependencies. ([cc4404b](https://github.com/Webiny/webiny-js/commit/cc4404b))
* track proper method on component removal. ([e3cf4b8](https://github.com/Webiny/webiny-js/commit/e3cf4b8))





## [0.1.5](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.1.4...@webiny/serverless-apollo-service@0.1.5) (2019-10-07)


### Bug Fixes

* update aws-api-gateway dependency version ([03f919d](https://github.com/Webiny/webiny-js/commit/03f919d))





## [0.1.4](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.1.3...@webiny/serverless-apollo-service@0.1.4) (2019-10-07)


### Bug Fixes

* add installation of dependencies per component boilerplate. ([647a472](https://github.com/Webiny/webiny-js/commit/647a472))





## [0.1.3](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.1.2...@webiny/serverless-apollo-service@0.1.3) (2019-10-07)


### Bug Fixes

* improve webpack error output. ([e0468cb](https://github.com/Webiny/webiny-js/commit/e0468cb))





## [0.1.2](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.1.1...@webiny/serverless-apollo-service@0.1.2) (2019-10-06)


### Bug Fixes

* update dependencies. ([a399620](https://github.com/Webiny/webiny-js/commit/a399620))





## [0.1.1](https://github.com/Webiny/webiny-js/compare/@webiny/serverless-apollo-service@0.1.0...@webiny/serverless-apollo-service@0.1.1) (2019-10-06)


### Bug Fixes

* add missing dependencies to package.json ([dd3152a](https://github.com/Webiny/webiny-js/commit/dd3152a))
* add missing dependencies. ([23af85c](https://github.com/Webiny/webiny-js/commit/23af85c))
