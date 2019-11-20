import { graphql } from "graphql";
import { setupSchema } from "@webiny/api/testing";
import filesPlugins from "@webiny/api-files/plugins";

export default ({ plugins }) => {
    let testing;

    beforeAll(async () => {
        // Setup schema
        testing = await setupSchema([plugins, filesPlugins()]);
    });

    test("create file", async () => {
        const query = /* GraphQL */ `
            mutation {
                files {
                    createFile(
                        data: {
                            id: "5c96410bf32d248a1a73b8c3"
                            key: "/files/filename.png"
                            name: "filename.png"
                            size: 123456
                            type: "image/png"
                            tags: ["sketch"]
                        }
                    ) {
                        data {
                            id
                        }
                        error {
                            code
                            data
                            message
                        }
                    }
                }
            }
        `;

        const response = await graphql(testing.schema, query, {}, testing.context);

        expect(response).toMatchObject({
            data: {
                files: {
                    createFile: {
                        data: {
                            id: expect.stringMatching("^[0-9a-fA-F]{24}$")
                        }
                    }
                }
            }
        });
    });

    test("list files", async () => {
        const query = /* GraphQL */ `
            {
                files {
                    listFiles(perPage: 1) {
                        data {
                            id
                            name
                            size
                            type
                            tags
                            key
                        }
                    }
                }
            }
        `;

        const response = await graphql(testing.schema, query, {}, testing.context);
        expect(response).toMatchObject({
            data: {
                files: {
                    listFiles: {
                        data: [
                            {
                                id: "5c96410bf32d248a1a73b8c3",
                                name: "filename.png",
                                size: 123456,
                                type: "image/png",
                                key: "/files/filename.png",
                                tags: ["sketch"]
                            }
                        ]
                    }
                }
            }
        });
    });

    test("get file by ID", async () => {
        const query = /* GraphQL */ `
            {
                files {
                    getFile(id: "5c96410bf32d248a1a73b8c3") {
                        data {
                            id
                            name
                            size
                            type
                            key
                            tags
                        }
                    }
                }
            }
        `;

        const response = await graphql(testing.schema, query, {}, testing.context);
        expect(response).toMatchObject({
            data: {
                files: {
                    getFile: {
                        data: {
                            id: "5c96410bf32d248a1a73b8c3",
                            name: "filename.png",
                            size: 123456,
                            type: "image/png",
                            key: "/files/filename.png",
                            tags: ["sketch"]
                        }
                    }
                }
            }
        });
    });

    test("list tags", async () => {
        const query = /* GraphQL */ `
            {
                files {
                    listTags
                }
            }
        `;

        const response = await graphql(testing.schema, query, {}, testing.context);
        expect(response).toMatchObject({
            data: {
                files: {
                    listTags: ["sketch"]
                }
            }
        });
    });
};
