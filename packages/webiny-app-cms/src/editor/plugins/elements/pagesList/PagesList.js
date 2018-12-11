// @flow
import * as React from "react";
import { pure } from "recompose";
import { Query } from "react-apollo";
import { withCms } from "webiny-app-cms/context";
import { loadPages } from "./graphql";

const PagesList = pure(({ settings, cms: { theme } }: Object = {}) => {
    const { component, ...vars } = settings;
    const pageList = theme.elements.pagesList.components.find(cmp => cmp.name === component);

    if (!pageList) {
        return "Selected page list component not found!";
    }

    const { component: ListComponent } = pageList;

    if (!ListComponent) {
        return "You must select a component to render your list!";
    }

    let sort = null;
    if (vars.sortBy) {
        sort = { [vars.sortBy]: vars.sortDirection || -1 };
    }

    return (
        <Query
            query={loadPages}
            variables={{
                category: vars.category,
                sort,
                tags: vars.tags,
                tagsRule: vars.tagsRule,
                perPage: vars.limit,
                page: 1
            }}
        >
            {({ data, loading }) => {
                if (loading) {
                    return "Loading...";
                }

                const pages = data.cms.listPublishedPages;

                if (!pages || !pages.data.length) {
                    return "No pages match the criteria.";
                }

                return <ListComponent {...pages} theme={theme} />;
            }}
        </Query>
    );
});

export default withCms()(PagesList);
