import { Entity } from "@webiny/entity";
import sinon from "sinon";

const sandbox = sinon.sandbox.create();

describe("dynamic entity class test", () => {
    afterEach(() => sandbox.restore());

    test("should return a class", async () => {
        class C extends Entity {}

        C.classId = "C";

        class Main extends Entity {
            constructor() {
                super();
                this.attr("type").char();
                this.attr("entity").entity(C);
            }
        }

        const main = new Main();
        expect(main.getAttribute("entity").getEntityClass()).toEqual(C);
    });
});
