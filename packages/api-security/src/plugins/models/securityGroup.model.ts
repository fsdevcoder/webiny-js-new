import { flow } from "lodash";
import { withHooks, withName, ref, string, boolean, withFields } from "@webiny/commodo";

export default ({ createBase, SecurityRole, SecurityRoles2Models }) => {
    // TODO: fix type when Commodo is migrated to TS
    const SecurityGroup: any = flow(
        withName("SecurityGroup"),
        withFields(() => ({
            description: string(),
            name: string(),
            slug: string(),
            system: boolean(),
            roles: ref({
                list: true,
                instanceOf: [SecurityRole, "model"],
                using: [SecurityRoles2Models, "role"]
            })
        })),
        withHooks({
            async beforeCreate() {
                const existingGroup = await SecurityGroup.findOne({
                    query: { slug: this.slug }
                });
                if (existingGroup) {
                    throw Error(`Group with slug "${this.slug}" already exists.`);
                }
            },
            async beforeDelete() {
                if (this.system) {
                    throw Error(`Cannot delete system group.`);
                }
            }
        })
    )(createBase());

    return SecurityGroup;
};
