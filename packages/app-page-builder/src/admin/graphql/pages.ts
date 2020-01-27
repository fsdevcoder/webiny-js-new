import gql from "graphql-tag";
import { getPlugins } from "@webiny/plugins";
import { PbEditorPageSettingsPlugin } from "@webiny/app-page-builder/admin/types";

const error = `
error {
    code
    message
}`;

const sharedFields = `
    id
    title
    url
    version
    parent
    published
    isHomePage
    isErrorPage
    isNotFoundPage
    locked
    savedOn
`;

export const CREATE_PAGE = gql`
    mutation PbCreatePage($category: ID!) {
        pageBuilder {
            page: createPage(data: { category: $category }) {
                data {
                    id
                }
                ${error}
            }
        }
    }
`;

export const LIST_PAGES = gql`
    query PbListPages($sort: JSON, $page: Int, $perPage: Int, $search: String) {
        pageBuilder {
            pages: listPages(sort: $sort, page: $page, perPage: $perPage, search: $search) {
                data {
                    ${sharedFields}
                    category {
                        id
                        name
                    }
                    createdBy {
                        firstName
                        lastName
                    }
                }
                meta {
                    totalCount
                    to
                    from
                    nextPage
                    previousPage
                }
            }
        }
    }
`;

export const GET_PAGE = () => gql`
    query PbGetPage($id: ID!) {
        pageBuilder {
            page: getPage(id: $id) {
                data {
                    ${sharedFields}
                    snippet
                    content
                    settings {
                        _empty
                        ${getPlugins("pb-editor-page-settings")
                            .map((pl: PbEditorPageSettingsPlugin) => pl.fields)
                            .join("\n")}
                    }
                    category {
                        id
                        name
                        url
                    }
                    revisions {
                        ${sharedFields}
                    }
                }
                ${error}
            }
        }
    }
`;

export const CREATE_REVISION_FORM = gql`
    mutation PbCreateRevisionFrom($revision: ID!) {
        pageBuilder {
            revision: createRevisionFrom(revision: $revision) {
                data {
                    id
                }
                ${error}
            }
        }
    }
`;

export const PUBLISH_REVISION = gql`
    mutation PbPublishRevision($id: ID!) {
        pageBuilder {
            publishRevision(id: $id) {
                data {
                    ${sharedFields}
                }
                ${error}
            }
        }
    }
`;

export const DELETE_REVISION = gql`
    mutation PbDeleteRevision($id: ID!) {
        pageBuilder {
            deleteRevision(id: $id) {
                data
                ${error}
            }
        }
    }
`;

export const DELETE_PAGE = gql`
    mutation PbDeletePage($id: ID!) {
        pageBuilder {
            deletePage(id: $id) {
                data
                ${error}
            }
        }
    }
`;

const elementFields = /*GraphQL*/ `
    id
    name
    type
    category
    content
    preview {
        src
        meta
    }
`;

export const LIST_ELEMENTS = gql`
    query PbListElements {
        pageBuilder {
            elements: listElements(perPage: 1000) {
                data {
                    ${elementFields}
                }
            }
        }
    }
`;

export const CREATE_ELEMENT = gql`
    mutation PbCreateElement($data: PbElementInput!) {
        pageBuilder {
            element: createElement(data: $data) {
                data {
                    ${elementFields}
                }
                ${error}
            }
        }
    }
`;

export const UPDATE_ELEMENT = gql`
    mutation PbUpdateElement($id: ID!, $data: PbUpdateElementInput!) {
        pageBuilder {
            element: updateElement(id: $id, data: $data) {
                data {
                    ${elementFields}
                }
                ${error}
            }
        }
    }
`;
