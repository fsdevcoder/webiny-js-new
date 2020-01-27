import { flow } from "lodash";
import { validation } from "@webiny/validation";
import content from "./pbPage/contentField";

import { withFields, string, withName } from "@webiny/commodo";

export default ({ createBase, context }) =>
    flow(
        withName("PbPageElement"),
        withFields({
            name: string({ validation: validation.create("required") }),
            category: string(),
            type: string({ validation: validation.create("required,in:element:block") }),
            content: content({ context }),
            preview: context.commodo.fields.id()
        })
    )(createBase({ maxPerPage: 1000 }));
