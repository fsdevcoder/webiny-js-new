import { assert } from "chai";

import sinon from "sinon";
import { ComplexEntity, SimpleEntity } from "./entities/complexEntity";
import { collection, findCursor } from "./database";

const sandbox = sinon.sandbox.create();

describe("populateFromStorage test", function() {
    afterEach(() => {
        sandbox.restore();
        findCursor.data = [];
    });
    beforeEach(() => ComplexEntity.getEntityPool().flush());

    it("should populate entity correctly with data received from MongoDb", async () => {
        let findOneStub = sandbox.stub(collection, "findOne").callsFake(() => {
            return {
                firstName: "test",
                lastName: "tester",
                verification: { verified: true, documentType: "driversLicense" },
                tags: [
                    { slug: "no-name", label: "No Name" },
                    { slug: "adult-user", label: "Adult User" }
                ],
                simpleEntity: "01234567890123456789adee",
                simpleEntities: [22, 33, 44]
            };
        });

        let user = new ComplexEntity();
        assert.isFalse(user.getAttribute("simpleEntity").value.isLoading());
        assert.isFalse(user.getAttribute("simpleEntity").value.isLoaded());

        user = await ComplexEntity.findById(1);
        assert.isFalse(user.getAttribute("simpleEntity").value.isLoading());
        assert.isFalse(user.getAttribute("simpleEntity").value.isLoaded());

        findOneStub.restore();

        assert.equal(user.firstName, "test");
        assert.equal(user.lastName, "tester");
        assert.isTrue(user.verification.verified);
        assert.equal(user.verification.documentType, "driversLicense");
        assert.equal(user.tags[0].slug, "no-name");
        assert.equal(user.tags[0].label, "No Name");
        assert.equal(user.tags[1].slug, "adult-user");
        assert.equal(user.tags[1].label, "Adult User");
        assert.lengthOf(user.tags, 2);

        assert.equal(
            user.getAttribute("simpleEntity").value.getCurrent(),
            "01234567890123456789adee"
        );

        findOneStub = sandbox.stub(collection, "findOne").callsFake(() => {
            return { id: "01234567890123456789adee", name: "Test-1" };
        });

        const simpleEntity = await user.simpleEntity;
        findOneStub.restore();

        assert.equal(simpleEntity.id, "01234567890123456789adee");
        assert.equal(simpleEntity.name, "Test-1");

        assert.equal(user.getAttribute("simpleEntities").value.getCurrent()[0], 22);
        assert.equal(user.getAttribute("simpleEntities").value.getCurrent()[1], 33);
        assert.equal(user.getAttribute("simpleEntities").value.getCurrent()[2], 44);

        findCursor.data = [
            { id: 2, name: "Test-2" },
            { id: 3, name: "Test-3" },
            { id: 4, name: "Test-4" }
        ];

        const countStub = sandbox.stub(collection, "count").callsFake(() => 3);

        assert.lengthOf(await user.simpleEntities, 3);

        const simpleEntities = await user.simpleEntities;
        assert.instanceOf(simpleEntities[0], SimpleEntity);
        assert.equal(simpleEntities[0].id, 2);
        assert.equal(simpleEntities[0].name, "Test-2");

        assert.instanceOf(simpleEntities[1], SimpleEntity);
        assert.equal(simpleEntities[1].id, 3);
        assert.equal(simpleEntities[1].name, "Test-3");

        assert.instanceOf(simpleEntities[2], SimpleEntity);
        assert.equal(simpleEntities[2].id, 4);
        assert.equal(simpleEntities[2].name, "Test-4");

        countStub.restore();
        findCursor.data = [];
    });
});
