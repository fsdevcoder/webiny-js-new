// @flow
import { app, App } from "webiny-api";
import BaseAuthEndpoint from "./endpoints/auth";
import generateEndpoint from "./endpoints/generator";
import { AuthenticationService, AuthorizationService } from "./index";
import registerAttributes from "./attributes/registerAttributes";
import UsersEndpoint from "./endpoints/users";
import PermissionsEndpoint from "./endpoints/permissions";
import RolesEndpoint from "./endpoints/roles";
import RoleGroupsEndpoint from "./endpoints/roleGroups";
import type { Entity } from "webiny-entity";

class Security extends App {
    constructor(config: Object) {
        super();

        this.name = "Security";
        app.services.add("authentication", () => new AuthenticationService(config.authentication));
        app.services.add("authorization", () => new AuthorizationService());

        this.endpoints = [
            generateEndpoint(
                BaseAuthEndpoint,
                config.authentication,
                app.services.get("authentication")
            ),
            UsersEndpoint,
            PermissionsEndpoint,
            RoleGroupsEndpoint,
            RolesEndpoint
        ];

        registerAttributes(app.services.get("authentication"));

        // Helper attributes
        this.extendEntity("*", (entity: Entity) => {
            // "savedBy" attribute - updated on both create and update events.
            entity.attr("savedByClassId").char();
            entity.attr("savedBy").identity({ classIdAttribute: "savedByClassId" });

            // "createdBy" attribute - updated only on entity creation.
            entity.attr("createdByClassId").char();
            entity.attr("createdBy").identity({ classIdAttribute: "createdByClassId" });

            // "updatedBy" attribute - updated only on entity updates.
            entity.attr("updatedByClassId").char();
            entity.attr("updatedBy").identity({ classIdAttribute: "updatedByClassId" });

            // We don't need a standalone "deletedBy" attribute, since its value would be the same as in "savedBy"
            // and "updatedBy" attributes. Check these attributes to find out who deleted an entity.
            entity.on("save", () => {
                if (!app.getRequest()) {
                    return;
                }

                const { identity } = app.getRequest();
                entity.savedBy = identity;
                if (entity.isExisting()) {
                    entity.updatedBy = identity;
                } else {
                    entity.createdBy = identity;
                }
            });
        });
    }
}

export default Security;
