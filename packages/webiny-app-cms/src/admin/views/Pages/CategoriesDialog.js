// @flow
import React from "react";
import { css } from "emotion";
import { withRouter } from "webiny-app/components";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import {
    Dialog,
    DialogHeader,
    DialogHeaderTitle,
    DialogBody,
    DialogFooter
} from "webiny-ui/Dialog";
import {
    List,
    ListItem,
    ListItemText,
    ListItemTextPrimary,
    ListItemTextSecondary
} from "webiny-ui/List";
import { ButtonDefault } from "webiny-ui/Button";

const narrowDialog = css({
    ".mdc-dialog__surface": {
        width: 400,
        minWidth: 400
    }
});

const loadCategories = gql`
    query ListCategories($sort: JSON) {
        cms {
            listCategories(sort: $sort) {
                data {
                    id
                    name
                    url
                }
            }
        }
    }
`;

const CategoriesDialog = ({
    open,
    onClose,
    onSelect,
    router
}: {
    open: boolean,
    onClose: Function,
    onSelect: Function,
    router: Object
}) => {
    return (
        <Dialog open={open} onClose={onClose} className={narrowDialog}>
            <DialogHeader>
                <DialogHeaderTitle>Select a category</DialogHeaderTitle>
            </DialogHeader>
            <DialogBody>
                <List twoLine>
                    <Query query={loadCategories} variables={{ sort: { name: 1 } }}>
                        {({ data, loading }) => {
                            if (loading) {
                                return "Loading categories...";
                            }

                            return (
                                <React.Fragment>
                                    {data.cms.listCategories.data.map(item => (
                                        <ListItem key={item.id} onClick={() => onSelect(item)}>
                                            <ListItemText>
                                                <ListItemTextPrimary>
                                                    {item.name}
                                                </ListItemTextPrimary>
                                                <ListItemTextSecondary>
                                                    {item.url}
                                                </ListItemTextSecondary>
                                            </ListItemText>
                                        </ListItem>
                                    ))}
                                </React.Fragment>
                            );
                        }}
                    </Query>
                </List>
            </DialogBody>
            <DialogFooter>
                <ButtonDefault onClick={() => router.goToRoute({ name: "Cms.Categories" })}>
                    + Create new category
                </ButtonDefault>
            </DialogFooter>
        </Dialog>
    );
};

export default withRouter()(CategoriesDialog);
