import { assert } from "chai";
import sinon from "sinon";
import SimpleEntity from "./entities/simpleEntity";
const sandbox = sinon.sandbox.create();
import { collection } from "./database";

describe("findById test", function() {
    afterEach(() => sandbox.restore());

    it("must generate correct query", async () => {
        const findOneSpy = sandbox.spy(collection, "findOne");

        await SimpleEntity.findById("customId");

        assert.deepEqual(findOneSpy.getCall(0).args[0], {
            id: "customId"
        });

        findOneSpy.restore();
    });

    it("findById - should find previously inserted entity", async () => {
        const findOneStub = sandbox.stub(collection, "findOne").callsFake(() => {
            return {
                id: 1,
                name: "This is a test",
                slug: "thisIsATest",
                enabled: true
            };
        });

        const simpleEntity = await SimpleEntity.findById(1);
        findOneStub.restore();

        assert.equal(simpleEntity.id, 1);
        assert.equal(simpleEntity.name, "This is a test");
        assert.equal(simpleEntity.slug, "thisIsATest");
        assert.isTrue(simpleEntity.enabled);

    });
});
