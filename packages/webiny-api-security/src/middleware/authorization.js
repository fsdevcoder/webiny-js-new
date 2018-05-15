// @flow
import Permission from "webiny-api";
import _ from "lodash";

export default () => {
    /**
     * Authorization middleware.
     * Checks if request identity is authorized to execute the matched API method.
     *
     * @param {Api} params.app
     * @param next
     */
    return async (params, next: Function) => {
        const identity = params.req.identity;

        let identityScope = {};
        if (identity) {
            // Scope received from identity already possesses 'anonymous' permission's scope.
            identityScope = await identity.scope;
        } else {
            const anonymousPermission = await Permission.findOne({ query: { slug: "anonymous" } });
            for (let operationName in anonymousPermission.scope) {
                if (!identityScope[operationName]) {
                    identityScope[operationName] = [];
                }
                identityScope[operationName].push(anonymousPermission.scope[operationName]);
            }
        }

        if (
            _.get(params.graphql, "documentAST.definitions.0.name.value") === "IntrospectionQuery"
        ) {
            return next();
        }

        for (let i = 0; i < params.graphql.documentAST.definitions.length; i++) {
            let operationDefinition = params.graphql.documentAST.definitions[i];

            for (let j = 0; j < operationDefinition.selectionSet.selections.length; j++) {
                let selection = operationDefinition.selectionSet.selections[j];
                if (selection.kind === "Field") {
                    const fieldName = selection.name.value;

                    const fieldScopes = identityScope[fieldName] || [];

                    let hasAccess = false;
                    fieldScopes.forEach(fieldScope => {
                        if (fieldScope === true || fieldScope instanceof Object) {
                            hasAccess = true;
                            return false;
                        }
                    });

                    if (!hasAccess) {
                        throw Error(`Not authorized to access "${fieldName}" operation.`);
                    }

                    if (selection.selectionSet) {
                        checkScope(selection.selectionSet, fieldScopes);
                    }
                }
            }
        }

        next();
    };
};

const checkScope = (selectionSet, scopesList, parentFields = "") => {
    selectionSet.selections.forEach(selection => {
        if (selection.kind === "Field") {
            const fieldName = selection.name.value;

            let hasAccess = fieldName === "__typename";
            if (hasAccess) {
                return true;
            }

            const fullPath = parentFields ? `${parentFields}.${fieldName}` : fieldName;
            scopesList.forEach(scope => {
                if (_.get(scope, fullPath)) {
                    hasAccess = true;
                    if (selection.selectionSet) {
                        checkScope(selection.selectionSet, scopesList, fullPath);
                    }
                    return false;
                }
            });

            if (!hasAccess) {
                throw Error(`Not authorized to access "${fullPath}" field.`);
            }
        }
    });
};
