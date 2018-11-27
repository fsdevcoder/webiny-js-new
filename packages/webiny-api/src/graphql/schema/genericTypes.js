// @flow
export const genericTypes = () => {
    return [
        `
        input SearchInput {
            query: String
            fields: [String]
            operator: String
        }
        
        type ListMeta {
            totalCount: Int
            totalPages: Int
            page: Int
            perPage: Int
            from: Int
            to: Int
            previousPage: Int
            nextPage: Int
        }
        
        type DeleteResponse {
            data: Boolean
            error: Error
        }
        
        type Error {
            code: String
            message: String
            data: JSON
        }
        
        type File {
            name: String
            size: Int
            type: String
            src: String
        }
        
        input FileInput {
            name: String
            size: Int
            type: String
            src: String
        }
  `
    ];
};
