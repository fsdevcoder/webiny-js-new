import sinon from "sinon";
import SimpleEntity from "./entities/simpleEntity";

const sandbox = sinon.sandbox.create();

describe("count test", () => {
    afterEach(() => sandbox.restore());

    test("must generate correct query", async () => {
        const queryStub = sandbox
            .stub(SimpleEntity.getDriver().getConnection(), "query")
            .callsFake(() => {
                return [[], [{ count: null }]];
            });

        await SimpleEntity.count();

        expect(queryStub.getCall(0).args[0]).toEqual(
            "SELECT COUNT(*) AS count FROM `SimpleEntity`"
        );

        queryStub.restore();
    });

    test("must generate correct query - must have GROUP BY included", async () => {
        const queryStub = sandbox
            .stub(SimpleEntity.getDriver().getConnection(), "query")
            .callsFake(() => {
                return [[], [{ count: null }]];
            });

        await SimpleEntity.count({ groupBy: ["something"] });

        expect(queryStub.getCall(0).args[0]).toEqual(
            "SELECT COUNT(*) AS count FROM `SimpleEntity` GROUP BY something"
        );

        queryStub.restore();
    });

    test("must generate correct query - custom query and values must be accepted", async () => {
        const queryStub = sandbox
            .stub(SimpleEntity.getDriver().getConnection(), "query")
            .callsFake(() => {
                return [[], [{ count: null }]];
            });

        await SimpleEntity.count({
            sql: {
                query: "SELECT COUNT(*) FROM `SimpleEntity` WHERE age > ? OR type = ?",
                values: [20, "developer"]
            },
            groupBy: ["something"]
        });

        expect(queryStub.getCall(0).args[0]).toEqual(
            "SELECT COUNT(*) FROM `SimpleEntity` WHERE age > 20 OR type = 'developer'"
        );

        queryStub.restore();
    });

    test("should count entities", async () => {
        sandbox.stub(SimpleEntity.getDriver().getConnection(), "query").callsFake(() => {
            return [{ count: 1 }];
        });

        const count = await SimpleEntity.count();
        SimpleEntity.getDriver()
            .getConnection()
            .query.restore();

        expect(count).toEqual(1);
    });

    test("should include search query if passed", async () => {
        const queryStub = sandbox
            .stub(SimpleEntity.getDriver().getConnection(), "query")
            .callsFake(() => {
                return [[], [{ count: null }]];
            });

        await SimpleEntity.count({
            query: {
                age: { $gt: 30 }
            },
            search: {
                query: "this is",
                fields: ["name"]
            }
        });

        expect(queryStub.getCall(0).args[0]).toEqual(
            "SELECT COUNT(*) AS count FROM `SimpleEntity` WHERE (((`name` LIKE '%this is%') AND `age` > 30))"
        );

        queryStub.restore();
    });
});
