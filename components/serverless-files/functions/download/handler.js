// @flow
const S3 = require("aws-sdk/clients/s3");
const { imageLoader, defaultLoader } = require("./fileLoaders");
const { createHandler, getEnvironment, promisifyS3ObjectFunction } = require("../utils");
const { extractFilenameOptions, getObjectUrl, getObjectParams } = require("./utils");

/**
 * Loaders are listed here. The "defaultLoader" simply just returns the requested file,
 * and additionally does nothing to it. Leave it as the last item in the loaders array.
 */
const loaders = [imageLoader, defaultLoader];

module.exports.handler = createHandler(async event => {
    console.log("event", JSON.stringify(event, null, 2));
    const { path } = event;
    const { region } = getEnvironment();
    const s3Client = new S3({ region });
    const s3 = {
        client: s3Client,
        createObject: promisifyS3ObjectFunction({ s3: s3Client, action: "putObject" }),
        deleteObject: promisifyS3ObjectFunction({ s3: s3Client, action: "deleteObject" }),
        getObject: promisifyS3ObjectFunction({ s3: s3Client, action: "getObject" }),
        getObjectUrl: key => getObjectUrl(key),
        getObjectParams: filename => getObjectParams(filename)
    };

    const { options, filename, extension } = extractFilenameOptions(event);

    for (let i = 0; i < loaders.length; i++) {
        let loader = loaders[i];
        const canProcess = loader.canProcess({
            s3,
            options,
            file: {
                name: filename,
                extension
            }
        });

        if (canProcess) {
            const s3Object = await loader.process({
                s3,
                options,
                file: {
                    name: filename,
                    extension
                }
            });

            console.log("vracam", s3Object);
            return {
                data: s3Object.Body,
                headers: {
                    "Content-Type": s3Object.ContentType
                }
            };
        }
    }
});
