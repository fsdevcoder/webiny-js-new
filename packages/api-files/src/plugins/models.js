// @flow
import { flow } from "lodash";
import { withStorage, withCrudLogs, withSoftDelete } from "@webiny/commodo";
import { MongoDbDriver, withId } from "@commodo/fields-storage-mongodb";
import { withUser } from "@webiny/api-security";
import fileModel from "./models/file.model";
import filesSettings from "./models/filesSettings.model";

export default ({ database }) => ({
    name: "graphql-context-models",
    type: "graphql-context",
    apply(context) {
        const driver = new MongoDbDriver({
            database: database.mongodb
        });

        const createBase = () =>
            flow(
                withId(),
                withStorage({ driver }),
                withUser(context),
                withSoftDelete(),
                withCrudLogs()
            )();

        const File = fileModel({ createBase, context });
        const FilesSettings = filesSettings({ createBase });

        context.models = {
            File,
            FilesSettings
        };
    }
});
