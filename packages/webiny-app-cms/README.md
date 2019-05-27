# webiny-app-cms
[![](https://img.shields.io/npm/dw/webiny-app-cms.svg)](https://www.npmjs.com/package/webiny-app-cms) 
[![](https://img.shields.io/npm/v/webiny-app-cms.svg)](https://www.npmjs.com/package/webiny-app-cms)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Enables Webiny CMS in the Admin area and on your site. 

Use together with [webiny-api-cms](../webiny-api-cms) package.

For more information, please visit the Webiny documentation:
1. [Webiny Theme Tutorial Overview](https://docs.webiny.com/docs/developer-tutorials/new-theme-overview)
2. [CMS Element - Overview](https://docs.webiny.com/docs/developer-tutorials/cms-element-overview) 
  
## Install
```
npm install --save webiny-app-cms
```

Or if you prefer yarn: 
```
yarn add webiny-app-cms
```

Note: the [webiny-api-cms](../webiny-api-cms) is also required.

## Setup
To setup, you must register a set of plugins. For more information on 
plugins, please visit [Webiny documentation](https://docs.webiny.com/docs/developer-tutorials/plugins-crash-course).

#### Admin
```
import cmsPlugins from "webiny-app-cms/admin"
import { registerPlugins } from "webiny-plugins";

registerPlugins(cmsPlugins);
```
    
#### Site
```
import cmsPlugins from "webiny-app-cms/render"
import { registerPlugins } from "webiny-plugins";

registerPlugins(cmsPlugins);
```