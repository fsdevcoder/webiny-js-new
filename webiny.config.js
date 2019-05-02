module.exports = {
    functions: {
        "demo-api": {
            install: "src/install.js",
            method: "ALL",
            path: "/function/api",
            env: {
                MONGODB_SERVER: process.env.MONGODB_SERVER,
                MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
                WEBINY_JWT_SECRET: process.env.WEBINY_JWT_SECRET
            }
        }
    },
    apps: {
        "demo-admin": {
            path: "/admin",
            env: {
                REACT_APP_FUNCTIONS_HOST: process.env.REACT_APP_FUNCTIONS_HOST
            }
        },
        "demo-site": {
            path: "/",
            ssr: true,
            env: {
                REACT_APP_FUNCTIONS_HOST: process.env.REACT_APP_FUNCTIONS_HOST
            }
        }
    }
};
