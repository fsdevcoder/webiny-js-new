// @flow
import get from "lodash/get";
import isPlainObject from "lodash/isPlainObject";
import setupEntities from "./setupEntities";
import * as data from "./data";

export default async (context: Object) => {
    setupEntities(context);
    const { User, Role, Group } = context.security.entities;

    const user = new User();

    const fullAccess = new Role();
    await fullAccess.populate(data.fullAccessRole).save();

    let userData = get(context, "security.admin");
    if (!userData || !isPlainObject(userData)) {
        userData = data.superAdminUser;
    }

    await user.populate({ ...userData, roles: [fullAccess] }).save();

    context.user = user;

    const group = new Group();
    await group.populate({ ...data.securityFullAccessGroup, roles: data.roles }).save();
};
