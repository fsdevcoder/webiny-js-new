import Model from "@webiny/model/model";

class Model1 extends Model {
    constructor() {
        super();
        this.attr("char").char();
        this.attr("model2").model(Model2);
    }
}

class Model2 extends Model {
    constructor() {
        super();
        this.attr("integer").integer();
        this.attr("model3").model(Model3);
    }
}

class Model3 extends Model {
    constructor() {
        super();
        this.attr("boolean").boolean();
    }
}

describe("getting and setting nested keys test", () => {
    test("should set nested values correctly", async () => {
        const model1 = new Model1();
        model1.char = "char";
        model1.model2 = {};
        model1.model2.integer = 123;
        model1.model2.model3 = {};
        model1.model2.model3.boolean = true;

        expect(model1.char).toEqual("char");
        expect(model1.model2.integer).toEqual(123);
        expect(model1.model2.model3.boolean).toEqual(true);
    });
});
