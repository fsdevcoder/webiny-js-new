// @flow
import { Sync, ConsoleLog } from "webiny-sql-table-sync";
import { PageTable, CategoryTable, RevisionTable } from "webiny-api-cms/lib/mysql";
import FileTable from "webiny-api/lib/tables/file.mysql";
import ImageTable from "webiny-api/lib/tables/image.mysql";

import { MySQLTable } from "webiny-api";

// Configure MySQLTable driver
import { connection } from "./../../configs/database";

MySQLTable.getDriver().setConnection(connection);

(async () => {
    const tables = [PageTable, CategoryTable, RevisionTable, FileTable, ImageTable];

    const sync = new Sync({
        tables,
        drop: true,
        logClass: ConsoleLog
    });
    await sync.execute();

    const { default: importer } = await import("./import");
    return importer();
})();
