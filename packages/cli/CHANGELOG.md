# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.4.0-next.1](https://github.com/webiny/webiny-js/compare/@webiny/cli@2.4.0-next.0...@webiny/cli@2.4.0-next.1) (2019-11-20)


### Bug Fixes

* add missing "region" input to apps serverless.yml. ([7c3b6bf](https://github.com/webiny/webiny-js/commit/7c3b6bf64e79ad093667d83c864f568ab3ecd84a))
* check if state is available before deploying single component ([508ef29](https://github.com/webiny/webiny-js/commit/508ef297c8f8f402760f9be036ecb5b9f8589906))
* improve PUBLIC_URL handling for SSR ([1667a02](https://github.com/webiny/webiny-js/commit/1667a02d700f025deba3367b435c6c0e3e38715f))





# [2.4.0-next.0](https://github.com/webiny/webiny-js/compare/@webiny/cli@2.3.0...@webiny/cli@2.4.0-next.0) (2019-11-18)


### Features

* handler --tag parameter and load appropriate package versions. ([771db88](https://github.com/webiny/webiny-js/commit/771db88))
* move most of the boilerplate logic into plugins. ([8d856bb](https://github.com/webiny/webiny-js/commit/8d856bb))





# [2.3.0](https://github.com/webiny/webiny-js/compare/@webiny/cli@2.2.0...@webiny/cli@2.3.0) (2019-11-09)


### Features

* add update-notifier to check for CLI updates. ([#611](https://github.com/webiny/webiny-js/issues/611)) ([b531fde](https://github.com/webiny/webiny-js/commit/b531fde))





# [2.2.0](https://github.com/webiny/webiny-js/compare/@webiny/cli@2.1.0...@webiny/cli@2.2.0) (2019-11-08)


### Bug Fixes

* **file-manager:** improve file manager ([#609](https://github.com/webiny/webiny-js/issues/609)) ([cf884d2](https://github.com/webiny/webiny-js/commit/cf884d2))
* add missing dependency. ([6d110a3](https://github.com/webiny/webiny-js/commit/6d110a3))


### Features

* add support for selective component deploy and improve debug output. ([#610](https://github.com/webiny/webiny-js/issues/610)) ([5c3acb0](https://github.com/webiny/webiny-js/commit/5c3acb0))





# [2.1.0](https://github.com/webiny/webiny-js/compare/@webiny/cli@2.0.1...@webiny/cli@2.1.0) (2019-11-04)


### Features

* enable configuring min & max size for file uploads ([#593](https://github.com/webiny/webiny-js/issues/593)) ([5698ebf](https://github.com/webiny/webiny-js/commit/5698ebf4ff7a2d1a61b6b404a91e9b27c0940d84))





## [2.0.1](https://github.com/webiny/webiny-js/compare/@webiny/cli@2.0.0...@webiny/cli@2.0.1) (2019-10-31)


### Bug Fixes

* remove "serverless" dependency from new project template ([#573](https://github.com/webiny/webiny-js/issues/573)) ([e97c4fc](https://github.com/webiny/webiny-js/commit/e97c4fc1a517cd8d4857fa8830b95731a2ea7c8c))





# [2.0.0](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.8.1...@webiny/cli@2.0.0) (2019-10-29)


### Bug Fixes

* add binaryMediaTypes to apps serverless config. ([6ff988d](https://github.com/webiny/webiny-js/commit/6ff988d))





## [0.8.1](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.8.0...@webiny/cli@0.8.1) (2019-10-29)


### Bug Fixes

* remove blog layout. ([095631e](https://github.com/webiny/webiny-js/commit/095631e))
* update admin handler to properly detect binary files. ([3709b73](https://github.com/webiny/webiny-js/commit/3709b73))
* yml indentation and new URL for banner message. ([cc27f53](https://github.com/webiny/webiny-js/commit/cc27f53))





# [0.8.0](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.7.0...@webiny/cli@0.8.0) (2019-10-29)


### Features

* generate database name using api ID. ([e436663](https://github.com/webiny/webiny-js/commit/e436663))





# [0.7.0](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.6.0...@webiny/cli@0.7.0) (2019-10-29)


### Bug Fixes

* add ${files} ([f9c3e56](https://github.com/webiny/webiny-js/commit/f9c3e56))
* add check for binary files. ([b201222](https://github.com/webiny/webiny-js/commit/b201222))
* add missing font link. ([0a2c34b](https://github.com/webiny/webiny-js/commit/0a2c34b))
* add proper network error handling to admin app. ([a691d4e](https://github.com/webiny/webiny-js/commit/a691d4e))
* handle errors ([6b83857](https://github.com/webiny/webiny-js/commit/6b83857))
* manage dependencies ([9a825b4](https://github.com/webiny/webiny-js/commit/9a825b4))
* set Lambda timeout to 30secs ([831af62](https://github.com/webiny/webiny-js/commit/831af62))
* update file loaders and publicPath config. ([4a6a25f](https://github.com/webiny/webiny-js/commit/4a6a25f))
* update sls templates. ([1f8f1be](https://github.com/webiny/webiny-js/commit/1f8f1be))
* use console.log instead of throw ([71b8312](https://github.com/webiny/webiny-js/commit/71b8312))
* use graphqlUrl instead of url ([3f4f22c](https://github.com/webiny/webiny-js/commit/3f4f22c))


### Features

* add support for .env.json in project root. ([122a013](https://github.com/webiny/webiny-js/commit/122a013))





# [0.6.0](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.5.4...@webiny/cli@0.6.0) (2019-10-25)


### Bug Fixes

* clear ssr module before running render. ([ccf79df](https://github.com/webiny/webiny-js/commit/ccf79df))
* update project template. ([d209119](https://github.com/webiny/webiny-js/commit/d209119))


### Features

* show push notification when deploy finishes. ([b7e7ecd](https://github.com/webiny/webiny-js/commit/b7e7ecd))





## [0.5.4](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.5.3...@webiny/cli@0.5.4) (2019-10-24)


### Bug Fixes

* add missing build script. ([cbd52ff](https://github.com/webiny/webiny-js/commit/cbd52ff))
* add missing env variables to gateway template. ([0491aaf](https://github.com/webiny/webiny-js/commit/0491aaf))
* remove test image from template. ([0cbac67](https://github.com/webiny/webiny-js/commit/0cbac67))





## [0.5.3](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.5.2...@webiny/cli@0.5.3) (2019-10-24)


### Bug Fixes

* add helper to check if apps are already deployed. ([080fa6b](https://github.com/webiny/webiny-js/commit/080fa6b))
* ensure app environment is configured before attempting to deploy apps. ([244fa33](https://github.com/webiny/webiny-js/commit/244fa33))
* increase default lambda timeout. ([bdf4238](https://github.com/webiny/webiny-js/commit/bdf4238))
* point to correct ssr build script. ([d9bc2ab](https://github.com/webiny/webiny-js/commit/d9bc2ab))
* update template yaml. ([a1522bf](https://github.com/webiny/webiny-js/commit/a1522bf))
* update template yaml. ([2e9cdd1](https://github.com/webiny/webiny-js/commit/2e9cdd1))
* update template yaml. ([5980625](https://github.com/webiny/webiny-js/commit/5980625))





## [0.5.2](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.5.1...@webiny/cli@0.5.2) (2019-10-24)


### Bug Fixes

* add AppInstaller to admin app. ([d6b31d4](https://github.com/webiny/webiny-js/commit/d6b31d4))
* add missing deps to project template. ([1b25b0c](https://github.com/webiny/webiny-js/commit/1b25b0c))
* execute components one-by-one. ([eb1e550](https://github.com/webiny/webiny-js/commit/eb1e550))
* print website URL after deploy. ([1006c29](https://github.com/webiny/webiny-js/commit/1006c29))
* resolve components based on cwd. ([b93cefa](https://github.com/webiny/webiny-js/commit/b93cefa))
* update prettierrc config. ([15c72ce](https://github.com/webiny/webiny-js/commit/15c72ce))





## [0.5.1](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.5.0...@webiny/cli@0.5.1) (2019-10-23)

**Note:** Version bump only for package @webiny/cli





# [0.5.0](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.4.1...@webiny/cli@0.5.0) (2019-10-23)


### Bug Fixes

* add webiny.js to project setup and check if it exists before running hooks. ([f64a3a9](https://github.com/webiny/webiny-js/commit/f64a3a9))
* finalize CLI help and project setup. ([bae62d9](https://github.com/webiny/webiny-js/commit/bae62d9))


### Features

* add support for deploy hooks to inject state values. ([01f310f](https://github.com/webiny/webiny-js/commit/01f310f))





## [0.4.1](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.4.0...@webiny/cli@0.4.1) (2019-10-21)

**Note:** Version bump only for package @webiny/cli





# [0.4.0](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.3.10...@webiny/cli@0.4.0) (2019-10-21)


### Bug Fixes

* check if destination folder exists. ([7bffc85](https://github.com/webiny/webiny-js/commit/7bffc855c4d944feee520a64c648efa8297ea223))
* update new project setup. ([bb9365a](https://github.com/webiny/webiny-js/commit/bb9365a8e0cc8e65d3ae4dcfebc3e00f953ae7d4))


### Features

* replace all app .env files with a single .env.js file. ([831eb55](https://github.com/webiny/webiny-js/commit/831eb5561250b223d8bc82b23be642c565f88a3c))





## [0.3.10](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.3.9...@webiny/cli@0.3.10) (2019-10-17)


### Bug Fixes

* add "babel-loader" to devDependencies ([b98d201](https://github.com/webiny/webiny-js/commit/b98d201))
* remove unnecessary REACT_APP_API_HOST env variable in project tpl ([71694fc](https://github.com/webiny/webiny-js/commit/71694fc))





## [0.3.9](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.3.8...@webiny/cli@0.3.9) (2019-10-15)


### Bug Fixes

* add webpack-cli to devDependencies ([8e74255](https://github.com/webiny/webiny-js/commit/8e742554fbdd4aeb3ef96b8095936546fef2f0b5))





## [0.3.8](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.3.7...@webiny/cli@0.3.8) (2019-10-14)


### Bug Fixes

* synced dependencies across all packages ([#567](https://github.com/webiny/webiny-js/issues/567)) ([38eda54](https://github.com/webiny/webiny-js/commit/38eda547bead6e8a2c46875730bbcd8f1227e475))





## [0.3.7](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.3.6...@webiny/cli@0.3.7) (2019-10-11)


### Bug Fixes

* update dependencies ([2def479](https://github.com/webiny/webiny-js/commit/2def479886ed356e7981b7be61b957edcc87f887))





<a name="0.3.6"></a>
## [0.3.6](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.3.5...@webiny/cli@0.3.6) (2019-10-11)


### Bug Fixes

* update dependencies ([70a0004](https://github.com/webiny/webiny-js/commit/70a0004))





# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.3.5](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.3.4...@webiny/cli@0.3.5) (2019-10-10)


### Bug Fixes

* update gitignore path. ([702b543](https://github.com/webiny/webiny-js/commit/702b543))





## [0.3.4](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.3.3...@webiny/cli@0.3.4) (2019-10-10)


### Bug Fixes

* rename functions to api and update setup code. ([3167bb8](https://github.com/webiny/webiny-js/commit/3167bb8))





## [0.3.3](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.3.2...@webiny/cli@0.3.3) (2019-10-10)


### Bug Fixes

* remove "files" key from package.json. ([4a2e42a](https://github.com/webiny/webiny-js/commit/4a2e42a))





## [0.3.2](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.3.1...@webiny/cli@0.3.2) (2019-10-10)


### Bug Fixes

* update serverless config template. ([ae06654](https://github.com/webiny/webiny-js/commit/ae06654))





## [0.3.1](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.3.0...@webiny/cli@0.3.1) (2019-10-10)


### Bug Fixes

* add CLI version to project tracking and load messages from gist. ([086e962](https://github.com/webiny/webiny-js/commit/086e962))





# [0.3.0](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.2.1...@webiny/cli@0.3.0) (2019-10-08)


### Features

* add CLI version to project tracking. ([be8b114](https://github.com/webiny/webiny-js/commit/be8b114))





## [0.2.1](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.2.0...@webiny/cli@0.2.1) (2019-10-07)

**Note:** Version bump only for package @webiny/cli





# [0.2.0](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.1.1...@webiny/cli@0.2.0) (2019-10-07)


### Features

* add commands to enable/disable stats tracking. ([62a710d](https://github.com/webiny/webiny-js/commit/62a710d))
* add webiny config creation. ([d918fc2](https://github.com/webiny/webiny-js/commit/d918fc2))





## [0.1.1](https://github.com/webiny/webiny-js/compare/@webiny/cli@0.1.0...@webiny/cli@0.1.1) (2019-10-06)

**Note:** Version bump only for package @webiny/cli
