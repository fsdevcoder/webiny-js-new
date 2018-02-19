// @flow
import ColumnsContainer from "./columnsContainer";
import IndexesContainer from "./indexesContainer";

class Driver {
    connection: mixed;

    constructor() {
        this.connection = null;
    }

    getColumnsClass(): Class<ColumnsContainer> {
        return ColumnsContainer;
    }

    getIndexesClass(): Class<IndexesContainer> {
        return IndexesContainer;
    }

    getConnection(): mixed {
        return this.connection;
    }
}

export default Driver;
