// @flow
import {
    resolveCreate,
    resolveDelete,
    resolveGet,
    resolveList,
    resolveUpdate
} from "webiny-api/graphql";

const menuFetcher = ctx => ctx.cms.Menu;
import getMenuBySlug from "./menuResolvers/getMenuBySlug";

export default {
    typeDefs: `
        type Menu {
            id: ID
            createdOn: DateTime
            title: String
            slug: String
            description: String
            items: JSON
        }
    
        input MenuInput {
            title: String
            slug: String
            description: String
            items: JSON
        }
        
        # Response types
        
        type MenuResponse {
            data: Menu
            error: Error
        }
        
        type MenuListResponse {
            data: [Menu]
            meta: ListMeta
            error: Error
        }
            
        extend type CmsQuery {
            getMenu(
                id: ID 
                where: JSON
                sort: String
            ): MenuResponse
            
            listMenus(
                page: Int
                perPage: Int
                where: JSON
                sort: JSON
                search: SearchInput
            ): MenuListResponse
            
            "Returns menu by given slug."
            getMenuBySlug(
                slug: String!
            ): MenuResponse
        }
        
        extend type CmsMutation {
            createMenu(
                data: MenuInput!
            ): MenuResponse
            
            updateMenu(
                id: ID!
                data: MenuInput!
            ): MenuResponse
        
            deleteMenu(
                id: ID!
            ): DeleteResponse
        }
    `,
    resolvers: {
        CmsQuery: {
            getMenu: resolveGet(menuFetcher),
            listMenus: resolveList(menuFetcher),
            getMenuBySlug: getMenuBySlug(menuFetcher)
        },
        CmsMutation: {
            createMenu: resolveCreate(menuFetcher),
            updateMenu: resolveUpdate(menuFetcher),
            deleteMenu: resolveDelete(menuFetcher)
        }
    }
};
