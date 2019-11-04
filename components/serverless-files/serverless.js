const { join } = require("path");
const { Component } = require("@serverless/core");
const configureS3Bucket = require("./configureS3Bucket");

/**
 * This component deploys:
 * - S3 bucket for file storage
 * - API GW with "/files/{key}" route
 * - Three functions:
 *  - manage files - when a file is deleted, this makes sure all other related files are deleted too
 *  - download files - handles file download and calls image transformer if needed
 *  - image transformer - performs various image transformations
 */

const prefix = "serverless-files";

class FilesComponent extends Component {
    async default(inputs = {}) {
        const {
            region = "us-east-1",
            bucket = "webiny-files",
            env,
            uploadMinFileSize,
            uploadMaxFileSize,
            ...rest
        } = inputs;

        const manageFilesLambda = await this.load("@webiny/serverless-function", "manage-files");
        const manageFilesLambdaOutput = await manageFilesLambda({
            region,
            name: "Files component - manage files",
            timeout: 10,
            code: join(__dirname, "functions/manageFiles"),
            handler: "handler.handler",
            description: `${prefix}: Triggered once a file was deleted.`,
            env: {
                S3_BUCKET: bucket
            }
        });

        // Create S3 bucket for storing files.
        const s3 = await this.load("@serverless/aws-s3");
        const s3Output = await s3({ name: bucket, region });
        await configureS3Bucket({
            component: this,
            s3Output,
            manageFilesLambdaOutput,
            region,
            bucket
        });

        const imageTransformerLambda = await this.load(
            "@webiny/serverless-function",
            "image-transformer"
        );
        const imageTransformerLambdaOutput = await imageTransformerLambda({
            region,
            name: "Files component - image transformer",
            timeout: 10,
            code: join(__dirname, "functions/imageTransformer"),
            handler: "handler.handler",
            description: `${prefix}: Performs image optimization, resizing, etc.`,
            env: {
                S3_BUCKET: bucket
            }
        });

        // Deploy read/upload lambdas
        const downloadLambda = await this.load("@webiny/serverless-function", "download");
        const downloadLambdaOutput = await downloadLambda({
            region,
            name: "Files component - download files",
            timeout: 10,
            code: join(__dirname, "functions/downloadFile"),
            handler: "handler.handler",
            description: `${prefix}: Serves previously uploaded files.`,
            env: {
                S3_BUCKET: bucket,
                IMAGE_TRANSFORMER_LAMBDA_NAME: imageTransformerLambdaOutput.name
            }
        });

        // Deploy graphql API
        const apolloService = await this.load("@webiny/serverless-apollo-service");
        const apolloServiceOutput = await apolloService({
            region,
            plugins: ["@webiny/api-files/plugins"],
            binaryMediaTypes: ["*/*"],
            endpoints: [
                { path: "/files/{path}", method: "ANY", function: downloadLambdaOutput.arn }
            ],
            env: {
                ...env,
                S3_BUCKET: bucket,
                UPLOAD_MIN_FILE_SIZE: String(uploadMinFileSize),
                UPLOAD_MAX_FILE_SIZE: String(uploadMaxFileSize)
            },
            ...rest
        });

        const output = {
            api: apolloServiceOutput.api,
            s3: s3Output,
            cdnOrigin: {
                url: apolloServiceOutput.api.url,
                pathPatterns: {
                    "/files/*": {
                        ttl: 2592000 // 1 month
                    }
                }
            }
        };

        this.state.output = output;
        await this.save();

        return output;
    }

    async remove() {
        const apolloService = await this.load("@webiny/serverless-apollo-service");
        await apolloService.remove();

        let lambda = await this.load("@webiny/serverless-function", "manage-files");
        await lambda.remove();

        lambda = await this.load("@webiny/serverless-function", "image-transformer");
        await lambda.remove();

        lambda = await this.load("@webiny/serverless-function", "download");
        await lambda.remove();

        const s3 = await this.load("@serverless/aws-s3");
        await s3.remove();

        this.state = {};
        await this.save();
    }
}

module.exports = FilesComponent;
