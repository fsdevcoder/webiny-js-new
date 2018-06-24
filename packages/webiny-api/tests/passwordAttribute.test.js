// @flow
import { api } from "webiny-api";
import User from "./entities/myUser";
import registerIdentityAttribute from "./../src/attributes/registerIdentityAttribute";
import registerPasswordAttribute from "./../src/attributes/registerPasswordAttribute";
import SecurityService from "../src/services/securityService";
import MyUser from "./entities/myUser";
import JwtToken from "../src/security/tokens/jwtToken";

describe("Password attribute test", () => {
    beforeAll(() => {
        // Register service (for identity attribute).
        api.services.register("security", () => {
            return new SecurityService({
                token: new JwtToken({ secret: "MyS3cr3tK3Y" }),
                identities: [
                    {
                        identity: MyUser
                    }
                ]
            });
        });

        // Register attributes.
        registerIdentityAttribute();
        registerPasswordAttribute();
    });

    it("should encrypt new password", function() {
        const user = new User();
        user.password = "12345";
        expect(user.password).not.toBe("12345");
    });

    it("should not encrypt an empty value", function() {
        const user = new User();
        user.password = "12345";
        const encryptedPassword = user.password;
        user.password = null;
        user.password = "";
        user.password = false;
        expect(user.password).toBe(encryptedPassword);
    });
});
