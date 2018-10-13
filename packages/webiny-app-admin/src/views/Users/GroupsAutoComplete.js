// @flow
import * as React from "react";
import { compose } from "recompose";
import { get } from "dot-prop-immutable";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { AutoComplete } from "webiny-ui/AutoComplete";

let timeout: ?TimeoutID = null;

const loadGroups = gql`
    {
        security {
            listGroups(sort: { savedOn: -1 }) {
                data {
                    id
                    name
                }
            }
        }
    }
`;

const GroupsAutoComplete = () => {
    return (
        <Query
            query={loadGroups}
            props={({ data }) => ({ groups: get(data, "security.listGroups") })}
        >
            {({ groups, refetch }) => (
                <AutoComplete
                    multiple
                    options={groups}
                    onInput={query => {
                        timeout && clearTimeout(timeout);
                        timeout = setTimeout(
                            () =>
                                query &&
                                refetch({
                                    search: {
                                        query,
                                        fields: ["name", "description"]
                                    }
                                }),
                            250
                        );
                    }}
                />
            )}
        </Query>
    );
};

export default GroupsAutoComplete;
