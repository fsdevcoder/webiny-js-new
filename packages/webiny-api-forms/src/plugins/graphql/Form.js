// @flow
import {
    resolveCreate,
    resolveUpdate,
    resolveDelete,
    resolveGet
} from "webiny-api/graphql/crudResolvers";

import createRevisionFrom from "./formResolvers/createRevisionFrom";
import listForms from "./formResolvers/listForms";
import listPublishedForms from "./formResolvers/listPublishedForms";
import getPublishedForm from "./formResolvers/getPublishedForm";
import saveFormView from "./formResolvers/saveFormView";
import saveFormSubmission from "./formResolvers/saveFormSubmission";
import UserType from "webiny-api-security/plugins/graphql/User";

const formFetcher = ({ getEntity }) => getEntity("CmsForm");

export default {
    typeDefs: () => [
        UserType.typeDefs,
        /* GraphQL*/ `type Form {
            id: ID
            createdBy: User
            updatedBy: User
            savedOn: DateTime
            createdOn: DateTime
            deletedOn: DateTime
            publishedOn: DateTime
            version: Int
            name: String
            fields: [JSON]
            layout: [[JSON]]
            settings: FormSettingsType
            triggers: JSON
            published: Boolean
            parent: ID
            revisions: [Form]
        }
        
        type FormSettings {
            _empty: String
        }
        
        type FormSettingsLayoutType {
            renderer: String
        }
        
        type FormSettingsType {
            layout: FormSettingsLayoutType
            submitButtonLabel: String
            successMessage: String
        }
        
        input FormSettingsLayoutInput {
            renderer: String
        }
        
        input FormSettingsInput {
            layout: FormSettingsLayoutInput
            submitButtonLabel: String
            successMessage: String
        }
        
        input UpdateFormInput {
            name: String
            fields: [JSON],
            layout: [JSON]
            settings: FormSettingsInput
        }
       
        input FormSortInput {
            name: Int
            publishedOn: Int
        }
        
        input CreateFormInput {
            name: String!
        }

        # Response types
        type FormResponse {
            data: Form
            error: Error
        }
        
        type FormListResponse {
            data: [Form]
            meta: ListMeta
            error: Error
        }
        
        type FormSubmissionResponse {
            error: Error
        }
        
        type SaveFormViewResponse {
            error: Error
        }
        
        extend type FormsQuery {
            getForm(
                id: ID 
                where: JSON
                sort: String
            ): FormResponse
            
            getPublishedForm(id: String, url: String, parent: String): FormResponse
            
            listForms(
                page: Int
                perPage: Int
                sort: JSON
                search: String
                parent: String
            ): FormListResponse
            
            listPublishedForms(
                search: String
                category: String
                parent: String
                tags: [String]
                sort: FormSortInput
                page: Int
                perPage: Int
            ): FormListResponse
        }
        extend type FormsMutation {
            createForm(
                data: CreateFormInput!
            ): FormResponse
            
            # Create a new revision from an existing revision
            createRevisionFrom(
                revision: ID!
            ): FormResponse
            
            # Update revision
             updateRevision(
                id: ID!
                data: UpdateFormInput!
            ): FormResponse
            
            # Publish revision
            publishRevision(
                id: ID!
            ): FormResponse
            
            # Delete form and all of its revisions
            deleteForm(
                id: ID!
            ): DeleteResponse
            
            # Delete a single revision
            deleteRevision(
                id: ID!
            ): DeleteResponse
            
            # Submits a form
            saveFormSubmission(
                id: ID! 
                data: JSON!
                meta: JSON
            ): FormSubmissionResponse
            
            # Logs a view of a form
            saveFormView(id: ID!): SaveFormViewResponse
        }
    `
    ],
    resolvers: {
        FormsQuery: {
            getForm: resolveGet("CmsForm"),
            listForms: listForms,
            listPublishedForms,
            getPublishedForm
        },
        FormsMutation: {
            // Creates a new form
            createForm: resolveCreate(formFetcher),
            // Deletes the entire form
            deleteForm: resolveDelete(formFetcher),
            // Creates a revision from the given revision
            createRevisionFrom: createRevisionFrom,
            // Updates revision
            updateRevision: resolveUpdate(formFetcher),
            // Publish revision (must be given an exact revision ID to publish)
            publishRevision: (_: any, args: Object, ctx: Object, info: Object) => {
                args.data = { published: true };

                return resolveUpdate(formFetcher)(_, args, ctx, info);
            },
            // Delete a revision
            deleteRevision: resolveDelete(formFetcher),
            saveFormView,
            saveFormSubmission,
        },
        FormSettings: {
            _empty: () => ""
        }
    }
};
